public with sharing class SendEmailWithArticles {

    public class InvocableCase {
        @InvocableVariable(label='Case ID' required=true)
        public Id caseId;
    }

    public class ResponseWrapper {
        @InvocableVariable(label='Success')
        public Boolean isSuccess;

        @InvocableVariable(label='Message')
        public String message;

        @InvocableVariable(label='Status Code')
        public String statusCode;
    }

    @AuraEnabled
public static ResponseWrapper sendArticlesFromLWC(Id caseId) {
    List<InvocableCase> requestList = new List<InvocableCase>();
    InvocableCase req = new InvocableCase();
    req.caseId = caseId;
    requestList.add(req);
    List<ResponseWrapper> resList = sendEmail(requestList);
    return resList.isEmpty() ? null : resList[0];
}

    
    
    @InvocableMethod(label='Send Email with Articles' description='Sends an email with newly attached articles')
    public static List<ResponseWrapper> sendEmail(List<InvocableCase> requestList) {
        ResponseWrapper result = new ResponseWrapper();
        result.isSuccess = false;

        try {
            if (requestList == null || requestList.isEmpty() || requestList[0].caseId == null) {
                result.statusCode = 'INVALID_INPUT';
                result.message = 'No valid Case ID provided.';
                return new List<ResponseWrapper>{ result };
            }

            Id caseId = requestList[0].caseId;

            Case caseRecord = [
                SELECT Id, CaseNumber, Contact.Email, Contact.Name, Owner.Name, Owner.Email,
                       Initial_Queue__c, Queue__c, Support_Contact_Email__c
                FROM Case
                WHERE Id = :caseId
                LIMIT 1
            ];

            String contactEmail = '';
            if (caseRecord.Contact != null && !String.isBlank(caseRecord.Contact.Email)) {
                contactEmail = caseRecord.Contact.Email;
            } else if (caseRecord.Support_Contact_Email__c != null) {
                contactEmail = String.valueOf(caseRecord.Support_Contact_Email__c);
            } else {
                result.statusCode = 'NO_CUSTOMER_EMAIL';
                result.message = 'No valid customer email found on case.';
                return new List<ResponseWrapper>{ result };
            }

            List<CaseArticle> caseArticles = [
                SELECT KnowledgeArticleId
                FROM CaseArticle
                WHERE CaseId = :caseId
            ];
            if (caseArticles.isEmpty()) {
                result.statusCode = 'NO_ARTICLES';
                result.message = 'No articles are attached to this case. Please attach at least one article.';
                return new List<ResponseWrapper>{ result };
            }

            Set<String> previouslySentArticles = new Set<String>();
            for (EmailMessage email : [
                SELECT TextBody
                FROM EmailMessage
                WHERE ParentId = :caseId
            ]) {
                if (!String.isBlank(email.TextBody)) {
                    Matcher matcher = Pattern.compile('Article #: (\\d+)').matcher(email.TextBody);
                    while (matcher.find()) {
                        previouslySentArticles.add(matcher.group(1));
                    }
                }
            }

            Set<Id> articleIds = new Set<Id>();
            for (CaseArticle ca : caseArticles) {
                articleIds.add(ca.KnowledgeArticleId);
            }

            Map<Id, KnowledgeArticleVersion> articleMap = new Map<Id, KnowledgeArticleVersion>();
            Map<Id, KnowledgeArticleVersion> fullArticleMap = new Map<Id, KnowledgeArticleVersion>();
            for (KnowledgeArticleVersion article : [
                SELECT Title, ArticleNumber, KnowledgeArticleId, UrlName, IsVisibleInPkb
                FROM KnowledgeArticleVersion
                WHERE PublishStatus = 'Online'
                AND Language = 'en_US'
                AND KnowledgeArticleId IN :articleIds
            ]) {
                fullArticleMap.put(article.KnowledgeArticleId, article);
                if (article.IsVisibleInPkb) {
                    articleMap.put(article.KnowledgeArticleId, article);
                }
            }

            String publicCommunityBaseUrl = getPublicCommunityBaseUrl();
            String articleList = '';
            List<String> articleTitles = new List<String>();
            List<String> skippedTitles = new List<String>();

            for (CaseArticle ca : caseArticles) {
                KnowledgeArticleVersion fullArticle = fullArticleMap.get(ca.KnowledgeArticleId);
                if (fullArticle == null) continue;

                if (!articleMap.containsKey(ca.KnowledgeArticleId)) {
                    skippedTitles.add(fullArticle.Title);
                    continue;
                }

                KnowledgeArticleVersion article = articleMap.get(ca.KnowledgeArticleId);
                if (previouslySentArticles.contains(article.ArticleNumber)) continue;

                String articleUrl = publicCommunityBaseUrl + '/article/' + article.UrlName;
                articleList += '<p><strong>Article #: ' + article.ArticleNumber + '</strong><br/>' +
                    '<a style="color: #0070d2;" href="' + articleUrl + '" target="_blank">' + article.Title + '</a></p>';
                articleTitles.add('• ' + article.Title);
            }

            if (articleTitles.isEmpty() || String.isBlank(articleList)) {
                result.statusCode = 'NO_PUBLIC_ARTICLES';
                result.message = 'The attached article(s) are not available for public access. Please ensure they are published and publicly visible before sending.';
                return new List<ResponseWrapper>{ result };
            }

            String skippedMessage = skippedTitles.isEmpty() ? '' : ' (' + skippedTitles.size() + ' article(s) skipped: ' + String.join(skippedTitles, ', ') + ')';

            String emailServiceAddress = findBestEmailToCaseAddress(caseRecord);
            if (String.isBlank(emailServiceAddress)) {
                result.statusCode = 'NO_ROUTING_ADDRESS';
                result.message = 'Could not determine Email-to-Case routing address.';
                return new List<ResponseWrapper>{ result };
            }

            OrgWideEmailAddress orgEmail = getOrgWideEmailAddress(caseRecord);
            if (orgEmail == null) {
                result.statusCode = 'NO_ORG_WIDE_EMAIL';
                result.message = 'No Org-Wide Email Address available for sending.';
                return new List<ResponseWrapper>{ result };
            }

            String threadingToken = Cases.generateThreadingMessageId(caseRecord.Id);
            String contactNameStr = String.isBlank(caseRecord.Contact.Name) ? 'Customer' : caseRecord.Contact.Name;

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new List<String>{ contactEmail });
            email.setReplyTo(emailServiceAddress);
            email.setSubject('Knowledge Article(s) for Your Case ' + caseRecord.CaseNumber);
            email.setHtmlBody('Hi ' + contactNameStr + ',<br/><br/>' +
                'We wanted to share some helpful knowledge base information related to your case <b>' + caseRecord.CaseNumber +
                '</b>. These resources provide guidance and may help address your questions or offer additional insights.<br/><br/>' +
                articleList +
                '<br/><br/>If you have further questions or need additional assistance, feel free to respond to your case.<br/><br/>' +
                'Best regards,<br/>' +
                caseRecord.Owner.Name + '<br/><br/>' +
                '--- Reply directly to this email to respond to the case. Do not remove the token below ---<br/>');
            email.setReferences(threadingToken);
            email.setOrgWideEmailAddressId(orgEmail.Id);
            email.setWhatId(caseRecord.Id);
            email.setSaveAsActivity(true);

            Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });

            FeedItem feed = new FeedItem();
            feed.ParentId = caseRecord.Id;
            feed.Body = 'Sent knowledge articles to ' + contactNameStr + ' (' + contactEmail + ')\n' +
                'Articles:\n' + String.join(articleTitles, '\n');
            feed.Type = 'TextPost';
            insert feed;

            result.isSuccess = true;
            result.statusCode = 'SUCCESS';
            result.message = 'Email sent successfully with ' + articleTitles.size() + ' article(s)' + skippedMessage + '.';

        } catch (Exception e) {
            result.isSuccess = false;
            result.statusCode = 'EXCEPTION';
            result.message = 'Error: ' + e.getMessage();
        }

        return new List<ResponseWrapper>{ result };
    }

    private static String getPublicCommunityBaseUrl() {
        try {
            Knowledge_URL_Settings__mdt settings = [
                SELECT Public_Community_Base_URL__c
                FROM Knowledge_URL_Settings__mdt
                LIMIT 1
            ];
            if (settings != null && !String.isBlank(settings.Public_Community_Base_URL__c)) {
                return settings.Public_Community_Base_URL__c;
            }
        } catch (Exception e) {
            System.debug('Error fetching Public Community URL: ' + e.getMessage());
        }
        return '';
    }

    private static String findBestEmailToCaseAddress(Case caseRecord) {
        List<String> searchQueues = new List<String>();
        if (!String.isBlank(caseRecord.Initial_Queue__c)) searchQueues.add(caseRecord.Initial_Queue__c);
        if (!String.isBlank(caseRecord.Queue__c)) searchQueues.add(caseRecord.Queue__c);

        List<EmailMessage> caseEmails = [
            SELECT ToAddress, Headers
            FROM EmailMessage
            WHERE ParentId = :caseRecord.Id
            AND Incoming = true
            ORDER BY CreatedDate ASC
            LIMIT 1
        ];
        if (!caseEmails.isEmpty()) {
            String foundAddress = extractValidE2CAddress(caseEmails[0]);
            if (!String.isBlank(foundAddress)) {
                return foundAddress;
            }
        }

        if (!searchQueues.isEmpty()) {
            List<EmailMessage> queueEmails = [
                SELECT ToAddress
                FROM EmailMessage
                WHERE ParentId IN (
                    SELECT Id FROM Case WHERE Initial_Queue__c IN :searchQueues OR Queue__c IN :searchQueues
                )
                AND (ToAddress LIKE '%.case.sandbox.salesforce.com' OR ToAddress LIKE '%.case.salesforce.com')
                ORDER BY CreatedDate DESC
                LIMIT 1
            ];
            if (!queueEmails.isEmpty() && !String.isBlank(queueEmails[0].ToAddress)) {
                return queueEmails[0].ToAddress;
            }
        }

        try {
            List<SObject> emailServices = Database.query(
                'SELECT LocalPart, EmailDomainName ' +
                'FROM EmailServicesAddress ' +
                'WHERE IsActive = true ' +
                'AND FunctionId IN (SELECT Id FROM EmailServicesFunction WHERE FunctionName LIKE \"EmailToCase%\") ' +
                'ORDER BY CreatedDate DESC ' +
                'LIMIT 1'
            );
            if (!emailServices.isEmpty()) {
                return (String) emailServices[0].get('LocalPart') + '@' + (String) emailServices[0].get('EmailDomainName');
            }
        } catch (Exception e) {
            System.debug('Failed to query EmailServicesAddress: ' + e.getMessage());
        }

        return '';
    }

    private static String extractValidE2CAddress(EmailMessage email) {
        if (email == null) return '';

        if (!String.isBlank(email.ToAddress) &&
            (email.ToAddress.contains('case.salesforce.com') || email.ToAddress.contains('case.sandbox.salesforce.com'))) {
            return email.ToAddress;
        }

        if (!String.isBlank(email.Headers)) {
            Pattern pattern = Pattern.compile('To:.*?([\\w.-]+@[\\w.-]+\\.case\\.(?:sandbox\\.)?salesforce\\.com)');
            Matcher matcher = pattern.matcher(email.Headers);
            if (matcher.find()) {
                return matcher.group(1);
            }
        }
        return '';
    }

    private static OrgWideEmailAddress getOrgWideEmailAddress(Case caseRecord) {
        List<OrgWideEmailAddress> emails = [
            SELECT Id, Address, DisplayName
            FROM OrgWideEmailAddress
            WHERE IsAllowAllProfiles = true
            LIMIT 1
        ];
        if (!emails.isEmpty()) {
            return emails[0];
        }
        return null;
    }
}
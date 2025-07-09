document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Testimonial slider
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected testimonial and activate corresponding dot
        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
    }
    
    // Initialize testimonial display
    showTestimonial(currentTestimonial);
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
            currentTestimonial = index;
        });
    });
    
    // Auto-rotate testimonials
    setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.style.display = 'none';
    scrollBtn.style.position = 'fixed';
    scrollBtn.style.bottom = '20px';
    scrollBtn.style.right = '20px';
    scrollBtn.style.width = '50px';
    scrollBtn.style.height = '50px';
    scrollBtn.style.borderRadius = '50%';
    scrollBtn.style.backgroundColor = 'var(--primary-color)';
    scrollBtn.style.color = 'white';
    scrollBtn.style.border = 'none';
    scrollBtn.style.fontSize = '20px';
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.style.zIndex = '999';
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Animation on scroll
    const animateElements = document.querySelectorAll('.feature-card, .ai-feature, .step, .testimonial');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        .feature-card, .ai-feature, .step, .testimonial {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.animate, .ai-feature.animate, .step.animate, .testimonial.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(2), .ai-feature:nth-child(2), .step:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(3), .ai-feature:nth-child(3), .step:nth-child(3) {
            transition-delay: 0.4s;
        }
        
        .feature-card:nth-child(4), .ai-feature:nth-child(4), .step:nth-child(4) {
            transition-delay: 0.6s;
        }
        
        .feature-card:nth-child(5) {
            transition-delay: 0.8s;
        }
        
        .feature-card:nth-child(6) {
            transition-delay: 1s;
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('load', checkIfInView);
});

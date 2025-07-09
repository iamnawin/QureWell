import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  fetchRecordsStart, 
  fetchRecordsSuccess, 
  fetchRecordsFailure,
  deleteRecordStart,
  deleteRecordSuccess,
  deleteRecordFailure
} from '../redux/slices/healthRecordSlice';
import { Searchbar, FAB, Chip, Card, IconButton, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { formatDate } from '../utils/dateUtils';
import { getFileIcon } from '../utils/fileUtils';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

const HealthRecordsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { records, loading, error } = useSelector((state: RootState) => state.healthRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const recordTypes = [
    { id: 'all', label: 'All' },
    { id: 'lab_result', label: 'Lab Results' },
    { id: 'prescription', label: 'Prescriptions' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'vaccination', label: 'Vaccinations' },
    { id: 'discharge_summary', label: 'Discharge Summaries' },
    { id: 'doctor_note', label: 'Doctor Notes' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  useEffect(() => {
    if (records) {
      filterRecords();
    }
  }, [records, searchQuery, selectedType]);

  const fetchHealthRecords = async () => {
    dispatch(fetchRecordsStart());
    try {
      const response = await axios.get(`${API_URL}/api/health-records`);
      dispatch(fetchRecordsSuccess(response.data.data));
    } catch (error) {
      console.error('Error fetching health records:', error);
      dispatch(fetchRecordsFailure(error.response?.data?.message || 'Failed to fetch health records'));
    }
  };

  const filterRecords = () => {
    let filtered = [...records];
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(record => record.recordType === selectedType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.title.toLowerCase().includes(query) ||
        (record.description && record.description.toLowerCase().includes(query)) ||
        (record.metadata.doctor && record.metadata.doctor.toLowerCase().includes(query)) ||
        (record.metadata.hospital && record.metadata.hospital.toLowerCase().includes(query)) ||
        (record.tags && record.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredRecords(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterByType = (type) => {
    setSelectedType(type);
  };

  const handleAddRecord = () => {
    navigation.navigate('AddHealthRecord');
  };

  const handleViewRecord = (record) => {
    navigation.navigate('HealthRecordDetail', { recordId: record.id });
  };

  const handleEditRecord = (record) => {
    navigation.navigate('EditHealthRecord', { recordId: record.id });
    setMenuVisible(false);
  };

  const handleDeleteRecord = async (record) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this health record? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            dispatch(deleteRecordStart());
            try {
              await axios.delete(`${API_URL}/api/health-records/${record.id}`);
              dispatch(deleteRecordSuccess(record.id));
              Alert.alert('Success', 'Health record deleted successfully');
            } catch (error) {
              console.error('Error deleting health record:', error);
              dispatch(deleteRecordFailure(error.response?.data?.message || 'Failed to delete health record'));
              Alert.alert('Error', 'Failed to delete health record');
            }
          }
        }
      ]
    );
    setMenuVisible(false);
  };

  const handleShareRecord = (record) => {
    navigation.navigate('ShareHealthRecord', { recordId: record.id });
    setMenuVisible(false);
  };

  const showMenu = (record) => {
    setSelectedRecord(record);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const renderRecordItem = ({ item }) => (
    <Card style={styles.recordCard}>
      <Card.Title
        title={item.title}
        subtitle={`${recordTypes.find(type => type.id === item.recordType)?.label || 'Document'} • ${formatDate(item.metadata.date || item.createdAt)}`}
        left={(props) => getFileIcon(item.fileType, props)}
        right={(props) => (
          <IconButton
            {...props}
            icon="dots-vertical"
            onPress={() => showMenu(item)}
          />
        )}
      />
      <Card.Content>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.metadata.doctor && (
          <Text style={styles.metadataText}>
            Doctor: {item.metadata.doctor}
          </Text>
        )}
        {item.metadata.hospital && (
          <Text style={styles.metadataText}>
            Hospital: {item.metadata.hospital}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} style={styles.tag} small>
                {tag}
              </Chip>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
            )}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => handleViewRecord(item)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        {item.isShared && (
          <View style={styles.sharedIndicator}>
            <IconButton icon="account-multiple" size={16} />
            <Text style={styles.sharedText}>Shared</Text>
          </View>
        )}
      </Card.Actions>
      {selectedRecord && selectedRecord.id === item.id && (
        <Menu
          visible={menuVisible}
          onDismiss={hideMenu}
          anchor={{ x: 0, y: 0 }}
          style={styles.menu}
        >
          <Menu.Item 
            onPress={() => handleEditRecord(selectedRecord)} 
            title="Edit" 
            icon="pencil"
          />
          <Menu.Item 
            onPress={() => handleShareRecord(selectedRecord)} 
            title="Share" 
            icon="share"
          />
          <Divider />
          <Menu.Item 
            onPress={() => handleDeleteRecord(selectedRecord)} 
            title="Delete" 
            icon="delete"
            titleStyle={styles.deleteText}
          />
        </Menu>
      )}
    </Card>
  );

  const renderContent = () => {
    if (loading && !records.length) {
      return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />;
    }

    if (error) {
      return (
        <ErrorState
          message="Failed to load health records"
          onRetry={fetchHealthRecords}
        />
      );
    }

    if (!records.length) {
      return (
        <EmptyState
          icon="file-document-outline"
          title="No Health Records"
          message="You haven't added any health records yet. Add your first record by tapping the + button."
        />
      );
    }

    if (filteredRecords.length === 0) {
      return (
        <EmptyState
          icon="magnify"
          title="No Matching Records"
          message="No health records match your current filters. Try changing your search or filter criteria."
        />
      );
    }

    return (
      <FlatList
        data={filteredRecords}
        renderItem={renderRecordItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchHealthRecords}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search health records"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={recordTypes}
          renderItem={({ item }) => (
            <Chip
              selected={selectedType === item.id}
              onPress={() => handleFilterByType(item.id)}
              style={styles.filterChip}
              selectedColor="#6200ee"
            >
              {item.label}
            </Chip>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        />
      </View>
      
      {renderContent()}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddRecord}
        label="Add Record"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  chipContainer: {
    paddingHorizontal: 16,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  recordCard: {
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    marginBottom: 8,
    color: '#555',
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  moreTagsText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
    marginLeft: 4,
  },
  viewButton: {
    padding: 8,
  },
  viewButtonText: {
    color: '#6200ee',
    fontWeight: '500',
  },
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  sharedText: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    marginTop: 40,
  },
  deleteText: {
    color: 'red',
  },
});

export default HealthRecordsScreen;

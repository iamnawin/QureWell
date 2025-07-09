import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, TextInput, Chip, Avatar, Divider, FAB } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../redux/store';
import { fetchDoctors, bookAppointment } from '../redux/slices/bookingSlice';
import { Theme } from '../utils/theme';

const BookingScreen = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state: RootState) => state.booking);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const [markedDates, setMarkedDates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Endocrinology', 'Dermatology'];
  
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM', 
    '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ];

  const appointmentTypes = [
    { id: 'checkup', label: 'Regular Check-up', icon: 'clipboard-pulse' },
    { id: 'followup', label: 'Follow-up Visit', icon: 'calendar-check' },
    { id: 'consultation', label: 'New Consultation', icon: 'account-question' },
    { id: 'test', label: 'Medical Tests', icon: 'test-tube' },
    { id: 'emergency', label: 'Urgent Care', icon: 'alert-circle' }
  ];

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (doctors) {
      setFilteredDoctors(doctors);
    }
  }, [doctors]);

  useEffect(() => {
    if (doctors) {
      let filtered = doctors;
      
      if (searchQuery) {
        filtered = filtered.filter(doctor => 
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (specialtyFilter) {
        filtered = filtered.filter(doctor => 
          doctor.specialty === specialtyFilter
        );
      }
      
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, specialtyFilter, doctors]);

  const handleDateSelect = (day) => {
    const selectedDateStr = day.dateString;
    setSelectedDate(selectedDateStr);
    
    // Mark the selected date
    const updatedMarkedDates = {
      [selectedDateStr]: {
        selected: true,
        selectedColor: Theme.colors.primary
      }
    };
    setMarkedDates(updatedMarkedDates);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleAppointmentTypeSelect = (type) => {
    setAppointmentType(type);
    setStep(4);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentType) {
      Alert.alert('Missing Information', 'Please complete all required fields');
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      notes: notes
    };

    dispatch(bookAppointment(appointmentData));
    Alert.alert(
      'Appointment Booked',
      `Your appointment with Dr. ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} has been confirmed.`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset form
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedTime('');
            setAppointmentType('');
            setNotes('');
            setStep(1);
            setMarkedDates({});
          }
        }
      ]
    );
  };

  const renderDoctorList = () => {
    if (loading) {
      return <Text style={styles.message}>Loading doctors...</Text>;
    }

    if (error) {
      return <Text style={styles.errorMessage}>Error loading doctors: {error}</Text>;
    }

    if (filteredDoctors.length === 0) {
      return <Text style={styles.message}>No doctors found matching your criteria</Text>;
    }

    return (
      <>
        <TextInput
          label="Search doctors by name or specialty"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon name="magnify" />}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtyFilter}>
          <Chip 
            selected={specialtyFilter === ''} 
            onPress={() => setSpecialtyFilter('')}
            style={[styles.specialtyChip, specialtyFilter === '' && styles.selectedSpecialtyChip]}
            textStyle={specialtyFilter === '' ? styles.selectedChipText : {}}
          >
            All
          </Chip>
          {specialties.map(specialty => (
            <Chip 
              key={specialty} 
              selected={specialtyFilter === specialty}
              onPress={() => setSpecialtyFilter(specialty)}
              style={[styles.specialtyChip, specialtyFilter === specialty && styles.selectedSpecialtyChip]}
              textStyle={specialtyFilter === specialty ? styles.selectedChipText : {}}
            >
              {specialty}
            </Chip>
          ))}
        </ScrollView>
        
        <ScrollView style={styles.doctorList}>
          {filteredDoctors.map(doctor => (
            <TouchableOpacity key={doctor.id} onPress={() => handleDoctorSelect(doctor)}>
              <Card style={styles.doctorCard}>
                <Card.Content style={styles.doctorCardContent}>
                  <Avatar.Image source={{ uri: doctor.image }} size={60} />
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    <View style={styles.doctorRating}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{doctor.rating} • {doctor.experience} years exp</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color="#666" />
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  const renderDateSelection = () => {
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Select Date</Text>
        </View>
        
        <View style={styles.selectedDoctorContainer}>
          <Avatar.Image source={{ uri: selectedDoctor.image }} size={40} />
          <View style={styles.selectedDoctorInfo}>
            <Text style={styles.selectedDoctorName}>Dr. {selectedDoctor.name}</Text>
            <Text style={styles.selectedDoctorSpecialty}>{selectedDoctor.specialty}</Text>
          </View>
        </View>
        
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          minDate={new Date().toISOString().split('T')[0]}
          theme={{
            todayTextColor: Theme.colors.primary,
            selectedDayBackgroundColor: Theme.colors.primary,
            arrowColor: Theme.colors.primary,
          }}
        />
        
        {selectedDate && (
          <Button 
            mode="contained" 
            onPress={() => setStep(3)} 
            style={styles.nextButton}
            color={Theme.colors.primary}
          >
            Next
          </Button>
        )}
      </View>
    );
  };

  const renderTimeSelection = () => {
    return (
      <View style={styles.timeSelectionContainer}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={() => setStep(2)} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Select Time</Text>
        </View>
        
        <View style={styles.appointmentInfoContainer}>
          <View style={styles.appointmentInfoItem}>
            <Icon name="doctor" size={20} color={Theme.colors.primary} />
            <Text style={styles.appointmentInfoText}>Dr. {selectedDoctor.name}</Text>
          </View>
          <View style={styles.appointmentInfoItem}>
            <Icon name="calendar" size={20} color={Theme.colors.primary} />
            <Text style={styles.appointmentInfoText}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        
        <View style={styles.timeSlotGrid}>
          {timeSlots.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.selectedTimeSlot
              ]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text style={[
                styles.timeSlotText,
                selectedTime === time && styles.selectedTimeSlotText
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedTime && (
          <Button 
            mode="contained" 
            onPress={() => setStep(4)} 
            style={styles.nextButton}
            color={Theme.colors.primary}
          >
            Next
          </Button>
        )}
      </View>
    );
  };

  const renderAppointmentTypeSelection = () => {
    return (
      <View style={styles.appointmentTypeContainer}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={() => setStep(3)} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Appointment Details</Text>
        </View>
        
        <View style={styles.appointmentInfoContainer}>
          <View style={styles.appointmentInfoItem}>
            <Icon name="doctor" size={20} color={Theme.colors.primary} />
            <Text style={styles.appointmentInfoText}>Dr. {selectedDoctor.name}</Text>
          </View>
          <View style={styles.appointmentInfoItem}>
            <Icon name="calendar" size={20} color={Theme.colors.primary} />
            <Text style={styles.appointmentInfoText}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.appointmentInfoItem}>
            <Icon name="clock-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.appointmentInfoText}>{selectedTime}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Appointment Type</Text>
        
        <View style={styles.appointmentTypeGrid}>
          {appointmentTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.appointmentTypeCard,
                appointmentType === type.id && styles.selectedAppointmentType
              ]}
              onPress={() => handleAppointmentTypeSelect(type.id)}
            >
              <Icon 
                name={type.icon} 
                size={28} 
                color={appointmentType === type.id ? '#fff' : Theme.colors.primary} 
              />
              <Text style={[
                styles.appointmentTypeText,
                appointmentType === type.id && styles.selectedAppointmentTypeText
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any specific concerns or information for the doctor"
          style={styles.notesInput}
        />
        
        <Button 
          mode="contained" 
          onPress={handleBookAppointment} 
          style={styles.bookButton}
          color={Theme.colors.primary}
          disabled={!appointmentType}
        >
          Confirm Booking
        </Button>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderDoctorList();
      case 2:
        return renderDateSelection();
      case 3:
        return renderTimeSelection();
      case 4:
        return renderAppointmentTypeSelection();
      default:
        return renderDoctorList();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>
      
      {renderCurrentStep()}
      
      {step === 1 && (
        <FAB
          style={styles.fab}
          icon="history"
          color="#fff"
          onPress={() => Alert.alert('Previous Appointments', 'View your appointment history')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
  },
  specialtyFilter: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  specialtyChip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedSpecialtyChip: {
    backgroundColor: Theme.colors.primary,
  },
  selectedChipText: {
    color: 'white',
  },
  doctorList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  doctorCard: {
    marginBottom: 12,
    elevation: 2,
  },
  doctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  calendarContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedDoctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedDoctorInfo: {
    marginLeft: 12,
  },
  selectedDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDoctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    marginTop: 20,
  },
  timeSelectionContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  appointmentInfoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  appointmentInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentInfoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTimeSlot: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appointmentTypeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  appointmentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appointmentTypeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedAppointmentType: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  appointmentTypeText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedAppointmentTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  bookButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Theme.colors.primary,
  },
});

export default BookingScreen;

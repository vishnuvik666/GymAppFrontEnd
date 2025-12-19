import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Calendar from './Calendar';
import { Trash } from 'lucide-react-native';
import {
  fetchAvailabilities,
  deleteAvailability,
} from '../api/availability.api';
import CustomAlert from './CustomAlert';
import CustomToast from './CustomToast';

type Slot = {
  id: number;
  time: string;
  status: string;
};

export default function ClientTab() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const loadAvailabilities = async () => {
      try {
        const data = await fetchAvailabilities();
        setAvailabilities(data);
      } catch (err) {
        console.error('Error fetching availabilities:', err);
        setToastMessage('Failed to fetch availabilities');
        setToastVisible(true);
      }
    };
    loadAvailabilities();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];

    const slotsForDate = availabilities
      .filter(a => {
        if (a.repeatSessions && a.rangeStart && a.rangeEnd) {
          return formattedDate >= a.rangeStart && formattedDate <= a.rangeEnd;
        }
        return a.firstDate === formattedDate;
      })
      .map(a => ({
        id: a.id,
        time: `${a.startTime} - ${a.endTime}`,
        status: 'Open',
      }));

    setSlots(slotsForDate);
  }, [selectedDate, availabilities]);

  const handleDeleteSlot = (id: number) => {
    console.log('id', id);
    setDeleteId(id);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAvailability(deleteId);
      setAvailabilities(prev => prev.filter(a => a.id !== deleteId));
      setToastMessage('Slot deleted successfully');
      setToastVisible(true);
    } catch (err) {
      console.error('Failed to delete slot', err);
      setToastMessage('Failed to delete slot');
      setToastVisible(true);
    } finally {
      setAlertVisible(false);
      setDeleteId(null);
    }
  };

  const renderContent = () => {
    if (!selectedDate) {
      return (
        <Text style={styles.placeholderText}>
          Please select a date to view available slots
        </Text>
      );
    }

    if (slots.length === 0) {
      return (
        <Text style={styles.placeholderText}>
          No slots available for the selected date
        </Text>
      );
    }

    return slots.map(slot => (
      <View key={slot.id} style={styles.slotContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{slot.time}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{slot.status}</Text>
        </View>

        <TouchableOpacity onPress={() => handleDeleteSlot(slot.id)}>
          <Trash size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Client Slots</Text>
      <Text style={styles.subtitle}>
        Rahul Verma has 20 sessions left to book by 24 June 2026
      </Text>

      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <Text style={styles.slotsTitle}>Available Slots:</Text>

      <View style={styles.contentWrapper}>{renderContent()}</View>

      <CustomAlert
        visible={alertVisible}
        title="Delete Slot"
        message="Are you sure you want to delete this slot?"
        onCancel={() => setAlertVisible(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />

      <CustomToast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  slotsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 24,
    marginBottom: 16,
  },
  contentWrapper: {
    minHeight: 60,
    justifyContent: 'center',
  },
  slotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  timeContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#28A745',
    borderRadius: 8,
    padding: 14,
  },
  timeText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#d4f4dd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  statusText: {
    color: '#28A745',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});

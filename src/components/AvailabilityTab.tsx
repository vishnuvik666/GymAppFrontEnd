import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Calendar from './Calendar';
import { CalendarCheck } from 'lucide-react-native';
import RangeCalendar from './RangeCalendar';
import { createAvailability } from '../api/availability.api';

export default function AvailabilityTab() {
  const [firstDate, setFirstDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [repeatSessions, setRepeatSessions] = useState(false);
  const [rangeDates, setRangeDates] = useState({ start: null, end: null });
  const [sessionName, setSessionName] = useState('PT');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const onChangeFirstDate = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) setFirstDate(date);
  };

  const onChangeStartTime = (event, date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (date) setStartTime(date);
  };

  const onChangeEndTime = (event, date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (date) setEndTime(date);
  };

  const formatDate = date =>
    date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = date =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleRangeSelect = (selectedDate: Date) => {
    if (!rangeDates.start || (rangeDates.start && rangeDates.end)) {
      setRangeDates({ start: selectedDate, end: null });
    } else if (!rangeDates.end) {
      if (selectedDate < rangeDates.start) {
        setRangeDates({ start: selectedDate, end: rangeDates.start });
      } else {
        setRangeDates({ ...rangeDates, end: selectedDate });
      }
    }
  };

  const displayRange = rangeDates.start
    ? rangeDates.end
      ? `${formatDate(rangeDates.start)} - ${formatDate(rangeDates.end)}`
      : `${formatDate(rangeDates.start)} - ...`
    : 'Select date range';

  const createPayload = () => {
    const payload: any = {
      sessionName,
      firstDate: firstDate.toISOString().split('T')[0],
      startTime: `${startTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${startTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      repeatSessions,
    };

    if (repeatSessions && rangeDates.start) {
      payload.rangeDates = {
        start: rangeDates.start.toISOString().split('T')[0],
        end: rangeDates.end ? rangeDates.end.toISOString().split('T')[0] : null,
      };
    }

    return payload;
  };

  const validateAvailability = () => {
    if (!sessionName.trim()) {
      showToast('Session name is required');
      return false;
    }

    if (!firstDate) {
      showToast('First session date is required');
      return false;
    }

    if (!startTime || !endTime) {
      showToast('Start and end time are required');
      return false;
    }

    if (endTime <= startTime) {
      showToast('End time must be later than start time');
      return false;
    }

    if (repeatSessions) {
      if (!rangeDates.start || !rangeDates.end) {
        showToast('Please select a date range for repeated sessions');
        return false;
      }

      if (rangeDates.end < rangeDates.start) {
        showToast('Range end date must be after start date');
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateAvailability()) return;
    const payload = {
      sessionName,
      firstDate: firstDate.toISOString().split('T')[0],
      startTime: `${startTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${startTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      repeatSessions,
      rangeStart:
        repeatSessions && rangeDates.start
          ? rangeDates.start.toISOString().split('T')[0]
          : null,
      rangeEnd:
        repeatSessions && rangeDates.end
          ? rangeDates.end.toISOString().split('T')[0]
          : null,
    };

    try {
      const result = await createAvailability(payload);
      console.log('Availability saved:', result);

      setFirstDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setRepeatSessions(false);
      setRangeDates({ start: null, end: null });
      setSessionName('PT');
    } catch (err) {
      console.error('Error creating availability:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Availability</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Session Date*</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.input}>{formatDate(firstDate)}</Text>
          <CalendarCheck size={24} color="#666666" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={firstDate}
            mode="date"
            display="calendar"
            onChange={onChangeFirstDate}
          />
        )}
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeInputGroup}>
          <Text style={styles.label}>Start Time*</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text>{formatTime(startTime)}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="clock"
              onChange={onChangeStartTime}
            />
          )}
        </View>

        <View style={styles.timeInputGroup}>
          <Text style={styles.label}>End Time*</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text>{formatTime(endTime)}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="clock"
              onChange={onChangeEndTime}
            />
          )}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Repeat Sessions</Text>
        <Switch
          value={repeatSessions}
          onValueChange={setRepeatSessions}
          trackColor={{ false: '#d1d1d1', true: '#28A745' }}
          thumbColor="#ffffff"
        />
      </View>

      {repeatSessions && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Range for Repeated Sessions</Text>
          <RangeCalendar range={rangeDates} onRangeSelect={handleRangeSelect} />

          <Text style={{ marginTop: 8, color: '#666' }}>{displayRange}</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Session Name*</Text>
        <TextInput
          style={styles.sessionInput}
          value={sessionName}
          onChangeText={setSessionName}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#333' },
  timeRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  timeInputGroup: { flex: 1 },
  timeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  sessionInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 24,
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: { color: '#fff', fontWeight: '600' },
});

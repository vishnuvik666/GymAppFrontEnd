'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RangeCalendarProps {
  range: { start: Date | null; end: Date | null };
  onRangeSelect: (date: Date) => void;
}

export default function RangeCalendar({
  range,
  onRangeSelect,
}: RangeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  /** Month label */
  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  /** Change month */
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  /** Generate calendar dates */
  const weeks = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) dates.push(null);
    for (let d = 1; d <= daysInMonth; d++) dates.push(d);

    const weeksArray: (number | null)[][] = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeksArray.push(dates.slice(i, i + 7));
    }

    return weeksArray;
  }, [currentDate]);

  /** Check if date is in selected range */
  //   const isInRange = (date: number) => {
  //     const thisDate = new Date(
  //       currentDate.getFullYear(),
  //       currentDate.getMonth(),
  //       date,
  //     );
  //     if (!range.start) return false;
  //     const start = range.start;
  //     const end = range.end || range.start;
  //     return thisDate >= start && thisDate <= end;
  //   };

  const isInRange = (date: number) => {
    const thisDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date,
    );

    if (!range.start) return false;

    const start = range.start;
    const end = range.end || range.start;

    // Compare by time to handle exact days
    const thisTime = thisDate.setHours(0, 0, 0, 0);
    const startTime = start.setHours(0, 0, 0, 0);
    const endTime = end.setHours(0, 0, 0, 0);

    return thisTime >= startTime && thisTime <= endTime;
  };

  /** Handle selecting a date in range mode */
  const handleDateSelect = (date: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date,
    );

    if (!range.start || (range.start && range.end)) {
      // Start new range
      onRangeSelect(selectedDate);
    } else if (!range.end) {
      // Complete the range
      if (selectedDate < range.start) {
        onRangeSelect(selectedDate); // swap start and end internally in parent
      } else {
        onRangeSelect(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <ChevronLeft size={24} color="#666666" />
        </TouchableOpacity>

        <Text style={styles.monthText}>{monthLabel}</Text>

        <TouchableOpacity onPress={() => changeMonth('next')}>
          <ChevronRight size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekHeader}>
        {daysOfWeek.map(day => (
          <View key={day} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Dates */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((date, index) =>
            date ? (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  isInRange(date) && styles.selectedDateButton,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    isInRange(date) && styles.selectedDateText,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ) : (
              <View key={index} style={styles.dateButton} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayColumn: { width: 40, alignItems: 'center' },
  dayText: { fontSize: 14, fontWeight: '600', color: '#666666' },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dateButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  selectedDateButton: {
    backgroundColor: '#28A745',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedDateText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

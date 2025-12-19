'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <ChevronLeft size={24} color="#666666" />
        </TouchableOpacity>

        <Text style={styles.monthText}>{monthLabel}</Text>

        <TouchableOpacity onPress={() => changeMonth('next')}>
          <ChevronRight size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((date, index) =>
            date ? (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate?.toDateString() ===
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      date,
                    ).toDateString() && styles.selectedDateButton,
                ]}
                onPress={() =>
                  onDateSelect(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      date,
                    ),
                  )
                }
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate?.toDateString() ===
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        date,
                      ).toDateString() && styles.selectedDateText,
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
  dayColumn: {
    width: 40,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
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

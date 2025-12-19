'use client';

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
import WorkoutTab from '../components/WorkoutTab';
import ClientTab from '../components/ClientTab';
import AvailabilityTab from '../components/AvailabilityTab';
import { ChevronLeft, LogOut, Menu, RefreshCcw } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';

type TabType = 'Workout' | 'Client' | 'Availability' | 'Book Slots';

export default function WorkoutManagementScreen() {
  const logout = useAuthStore(state => state.logout);
  const [activeTab, setActiveTab] = useState<TabType>('Workout');
  const [isAddMode, setIsAddMode] = useState(false);

  const renderHeader = () => {
    const title = isAddMode ? 'Add Workout Plan' : 'Workout Management';

    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          {isAddMode ? (
            <ChevronLeft size={24} color="#fff" />
          ) : (
            <Menu size={24} color="#fff" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <RefreshCcw size={24} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout()}
            style={styles.headerButton}
          >
            <LogOut size={24} color={'#fff'} />
          </TouchableOpacity>
          {!isAddMode && (
            <TouchableOpacity style={styles.headerButton}>
              {/* <ChevronLeft size={24} color="#fff" /> */}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          {['Workout', 'Client', 'Availability', 'Book Slots'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as TabType)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Workout':
        return <WorkoutTab isAddMode={isAddMode} setIsAddMode={setIsAddMode} />;
      case 'Client':
        return null;
      case 'Availability':
        return <AvailabilityTab />;
      case 'Book Slots':
        return <ClientTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView style={styles.content}>{renderContent()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tabWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  tabScrollContainer: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },

  activeTab: {
    borderBottomColor: '#28A745',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#28A745',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

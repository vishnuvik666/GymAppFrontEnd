import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface CustomToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function CustomToast({
  message,
  visible,
  onHide,
  duration = 2000,
}: CustomToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(onHide);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: '10%',
    right: '10%',
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});

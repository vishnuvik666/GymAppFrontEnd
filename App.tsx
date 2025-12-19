// import { StatusBar, StyleSheet } from 'react-native';
// import WorkoutManagementScreen from './src/screens/WorkoutManagementScreen';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function App() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#28A745" />
//       <WorkoutManagementScreen />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
// });

import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkoutManagementScreen from './src/screens/WorkoutManagementScreen';
import LoginScreen from './src/screens/LoginScreen';
import { useAuthStore } from './src/store/useAuthStore';

export default function App() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#28A745" />
      {isLoggedIn ? <WorkoutManagementScreen /> : <LoginScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

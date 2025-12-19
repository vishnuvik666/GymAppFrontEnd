import { CirclePlus, Trash } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  createWorkoutPlan,
  deleteWorkoutPlan,
  getWorkouts,
} from '../api/workout.api';
import { useWorkoutStore } from '../store/useWorkoutStore';

interface WorkoutTabProps {
  isAddMode: boolean;
  setIsAddMode: (value: boolean) => void;
}

interface Workout {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
}

interface Day {
  id: number;
  muscle: string;
  exercises: Exercise[];
}

export default function WorkoutTab({
  isAddMode,
  setIsAddMode,
}: WorkoutTabProps) {
  const { addOfflineWorkout, offlineWorkouts, removeOfflineWorkout } =
    useWorkoutStore();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<Day[]>([
    { id: 1, muscle: '', exercises: [] },
  ]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addDay = () => {
    setDays(prev => [
      ...prev,
      { id: prev.length + 1, muscle: '', exercises: [] },
    ]);
  };

  const updateDayMuscle = (dayId: number, value: string) => {
    setDays(prev =>
      prev.map(day => (day.id === dayId ? { ...day, muscle: value } : day)),
    );
  };

  const addExercise = (dayId: number) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                { id: Date.now(), name: '', sets: '', reps: '' },
              ],
            }
          : day,
      ),
    );
  };

  const deleteExercise = (dayId: number, exerciseId: number) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.filter(e => e.id !== exerciseId),
            }
          : day,
      ),
    );
  };

  const updateExercise = (
    dayId: number,
    exerciseId: number,
    field: keyof Exercise,
    value: string,
  ) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map(e =>
                e.id === exerciseId ? { ...e, [field]: value } : e,
              ),
            }
          : day,
      ),
    );
  };

  const isPositiveNumber = (value: string) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };

  const validateWorkout = () => {
    if (!workoutName.trim()) {
      showToast('Workout name is required');
      return false;
    }

    if (days.length === 0) {
      showToast('Add at least one workout day');
      return false;
    }

    for (const day of days) {
      if (!day.muscle.trim()) {
        showToast(`Muscle group is required for Day ${day.id}`);
        return false;
      }

      if (day.exercises.length === 0) {
        showToast(`Add at least one exercise for Day ${day.id}`);
        return false;
      }

      for (const ex of day.exercises) {
        if (!ex.name.trim()) {
          showToast(`Exercise name missing in Day ${day.id}`);
          return false;
        }

        if (!isPositiveNumber(ex.sets)) {
          showToast(`Invalid sets in Day ${day.id} (${ex.name})`);
          return false;
        }

        if (!isPositiveNumber(ex.reps)) {
          showToast(`Invalid reps in Day ${day.id} (${ex.name})`);
          return false;
        }
      }
    }

    return true;
  };

  const submitWorkout = async () => {
    if (!validateWorkout()) return;
    const payload = {
      name: workoutName,
      description,
      days: days.map(day => ({
        dayNumber: day.id,
        muscleGroup: day.muscle,
        exercises: day.exercises
          .filter(e => e.name && e.sets && e.reps)
          .map(e => ({
            name: e.name,
            sets: Number(e.sets),
            reps: Number(e.reps),
          })),
      })),
    };

    const localId = Date.now();

    try {
      await createWorkoutPlan(payload);
      showToast('Workout plan created successfully!');
      setWorkouts(prev => [...prev, { id: Date.now(), name: workoutName }]);
      setIsAddMode(false);
      setWorkoutName('');
      setDescription('');
      setDays([{ id: 1, muscle: '', exercises: [] }]);
    } catch (err) {
      console.error('Failed to create workout plan:', err);
      showToast('Failed to create workout plan.');
      addOfflineWorkout({
        id: localId,
        payload,
      });

      showToast('Saved locally. Will sync when online.');
      setWorkouts(prev => [...prev, { id: localId, name: workoutName }]);
    } finally {
      setIsAddMode(false);
      setWorkoutName('');
      setDescription('');
      setDays([{ id: 1, muscle: '', exercises: [] }]);
    }
  };

  const deleteWorkout = async (id: number) => {
    try {
      await deleteWorkoutPlan(id);

      // API success
      setWorkouts(prev => prev.filter(w => w.id !== id));
      showToast('Workout deleted successfully');
    } catch (err) {
      console.error('Delete failed, removing locally', err);

      // Remove from offline store if exists
      removeOfflineWorkout(id);

      // Remove from UI anyway
      setWorkouts(prev => prev.filter(w => w.id !== id));

      showToast('Deleted locally (offline)');
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (e) {
      console.error('Failed to load workouts', e);
      setWorkouts(
        offlineWorkouts.map(w => ({
          id: w.id,
          name: w.payload.name,
        })),
      );
    }
  };

  if (isAddMode) {
    return (
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.workoutNameInput}
          placeholder="Workout Plan Name"
          value={workoutName}
          placeholderTextColor="#4d4d4f"
          onChangeText={setWorkoutName}
        />

        {days.map(day => (
          <View key={day.id} style={styles.dayBlock}>
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Day {day.id}</Text>
              </View>
              <TextInput
                style={styles.muscleInput}
                placeholder="Muscle (Chest, Legs, Back...)"
                value={day.muscle}
                placeholderTextColor="#4d4d4f"
                onChangeText={text => updateDayMuscle(day.id, text)}
              />
              <TouchableOpacity onPress={() => addExercise(day.id)}>
                <CirclePlus size={26} color="#28A745" />
              </TouchableOpacity>
            </View>

            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderEmpty} />
              <Text style={styles.tableHeaderText}>Sets</Text>
              <Text style={styles.tableHeaderText}>Reps</Text>
            </View>

            {day.exercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseRow}>
                <TextInput
                  style={styles.exerciseName}
                  placeholder="Exercise Name"
                  placeholderTextColor="#4d4d4f"
                  value={exercise.name}
                  onChangeText={text =>
                    updateExercise(day.id, exercise.id, 'name', text)
                  }
                />
                <TextInput
                  style={styles.inputBox}
                  value={exercise.sets}
                  placeholder="Sets"
                  placeholderTextColor="#4d4d4f"
                  keyboardType="numeric"
                  onChangeText={text =>
                    updateExercise(day.id, exercise.id, 'sets', text)
                  }
                />
                <TextInput
                  style={styles.inputBox}
                  value={exercise.reps}
                  placeholder="Reps"
                  placeholderTextColor="#4d4d4f"
                  keyboardType="numeric"
                  onChangeText={text =>
                    updateExercise(day.id, exercise.id, 'reps', text)
                  }
                />
                <TouchableOpacity
                  onPress={() => deleteExercise(day.id, exercise.id)}
                >
                  <Trash size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.addDayButton} onPress={addDay}>
          <CirclePlus size={32} color="#3498db" />
          <Text style={styles.addDayText}>Add Day</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Workout Description"
          placeholderTextColor="#4d4d4f"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={submitWorkout}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setIsAddMode(false);
            setWorkoutName('');
            setDescription('');
            setDays([{ id: 1, muscle: '', exercises: [] }]);
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {toast ? (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {workouts.map(workout => (
        <View key={workout.id} style={styles.workoutItem}>
          <Text style={styles.workoutItemText}>{workout.name}</Text>
          <TouchableOpacity onPress={() => deleteWorkout(workout.id)}>
            <Trash size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddMode(true)}
      >
        <CirclePlus size={32} color="#28A745" />
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
  workoutItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workoutItemText: { fontSize: 16 },
  addButton: { alignItems: 'center', marginTop: 16 },
  workoutNameInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#D9D9D9',
  },
  dayBlock: { marginBottom: 24 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dayBadge: { backgroundColor: '#28A745', padding: 8, borderRadius: 10 },
  dayBadgeText: { color: '#fff', fontSize: 16 },
  muscleInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
    flex: 1,
    borderColor: '#D9D9D9',
  },
  tableHeader: { flexDirection: 'row', marginBottom: 8 },
  tableHeaderEmpty: { flex: 2 },
  tableHeaderText: { flex: 1, textAlign: 'center' },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  exerciseName: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    borderColor: '#D9D9D9',
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
    borderColor: '#D9D9D9',
  },
  addDayButton: { alignItems: 'center', marginVertical: 20 },
  addDayText: { marginTop: 6, fontSize: 14, color: '#3498db' },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    borderColor: '#D9D9D9',
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
  cancelButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    alignItems: 'center',
  },
  cancelText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
});

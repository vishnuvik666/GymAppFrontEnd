const BASE_URL = 'http://10.100.46.248:3000/api';

export async function createWorkoutPlan(payload: any) {
  const response = await fetch(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function deleteWorkoutPlan(id: number) {
  const response = await fetch(`${BASE_URL}/workouts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function getWorkouts() {
  const response = await fetch(`${BASE_URL}/workouts`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

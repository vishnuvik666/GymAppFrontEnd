const BASE_URL = 'http://10.100.46.248:3000/api'; // Replace with your backend URL

export const createAvailability = async (payload: any) => {
  try {
    const response = await fetch(`${BASE_URL}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  } catch (err) {
    console.error('Failed to create availability:', err);
    throw err;
  }
};

export const fetchAvailabilities = async () => {
  try {
    const response = await fetch(`${BASE_URL}/availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json(); // this will return an array of availabilities
  } catch (err) {
    console.error('Failed to fetch availabilities:', err);
    throw err;
  }
};

export const deleteAvailability = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/availability/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json(); // returns { message, deleted }
  } catch (err) {
    console.error('Failed to delete availability:', err);
    throw err;
  }
};

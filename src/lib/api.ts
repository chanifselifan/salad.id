const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, options);
  return res.json();
}

export async function createMidtransTransaction(orderData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.transactionToken;
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    throw error;
  }
}

export async function fetchSalads() {
  try {
    const response = await fetch(`${API_BASE_URL}/salads`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching salads:', error);
    throw error;
  }
}

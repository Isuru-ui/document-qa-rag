import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ingestText = async (text) => {
  try {
    const response = await api.post('/ingest/text', { text });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ingestFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/ingest/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const askQuestion = async (question) => {
  try {
    const response = await api.post('/ask', { question });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetDatabase = async () => {
  try {
    const response = await api.post('/reset');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
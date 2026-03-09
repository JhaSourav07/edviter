import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Automatically intercept every request and attach the Firebase token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
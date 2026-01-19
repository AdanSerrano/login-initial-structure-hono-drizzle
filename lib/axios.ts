import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar/recibir cookies
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Preservar el error original para casos especiales (como verificación de email)
    // que necesitan acceso al response completo
    if (error.response?.status === 403 && error.response?.data?.requiresEmailVerification) {
      return Promise.reject(error);
    }

    // Extraer mensaje de error del servidor si existe
    const message = error.response?.data?.error || error.message || 'Error de conexión';
    return Promise.reject(new Error(message));
  }
);

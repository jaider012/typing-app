import { useState, useCallback } from 'react';
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { getIdToken } from '../services/firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Tipos simples para el hook
interface HttpError {
  message: string;
  status: number;
  data?: any;
}

interface HttpState {
  loading: boolean;
  error: HttpError | null;
}

// Función para obtener mensaje de error
const getErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as any;
    if (data.message) return data.message;
    if (data.error) return data.error;
  }

  switch (error.response?.status) {
    case 400:
      return 'Los datos enviados son inválidos';
    case 401:
      return 'No estás autorizado. Por favor inicia sesión nuevamente';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'El recurso solicitado no fue encontrado';
    case 429:
      return 'Demasiadas solicitudes. Intenta más tarde';
    case 500:
      return 'Error interno del servidor';
    default:
      return error.message || 'Error de conexión';
  }
};

const useHttp = () => {
  const [state, setState] = useState<HttpState>({
    loading: false,
    error: null,
  });

  // Crear instancia de Axios
  const createAxiosInstance = useCallback((): AxiosInstance => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar token de Firebase
    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('No se pudo obtener el token de Firebase:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejo de errores
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const httpError: HttpError = {
          message: getErrorMessage(error),
          status: error.response?.status || 500,
          data: error.response?.data,
        };
        return Promise.reject(httpError);
      }
    );

    return instance;
  }, []);

  // Función helper para hacer requests
  const makeRequest = useCallback(async <T = any>(
    requestFn: (instance: AxiosInstance) => Promise<AxiosResponse<T>>
  ): Promise<T> => {
    setState({ loading: true, error: null });

    try {
      const instance = createAxiosInstance();
      const response = await requestFn(instance);
      
      setState({ loading: false, error: null });
      return response.data;
    } catch (error: any) {
      const httpError: HttpError = {
        message: error.message || 'Error de conexión',
        status: error.status || 500,
        data: error.data,
      };

      setState({ loading: false, error: httpError });
      throw httpError;
    }
  }, [createAxiosInstance]);

  // GET request
  const get = useCallback(async <T = any>(
    url: string, 
    params?: Record<string, any>
  ): Promise<T> => {
    return makeRequest<T>((instance) => 
      instance.get(url, { params })
    );
  }, [makeRequest]);

  // POST request
  const post = useCallback(async <T = any>(
    url: string, 
    data?: any
  ): Promise<T> => {
    return makeRequest<T>((instance) => 
      instance.post(url, data)
    );
  }, [makeRequest]);

  // PUT request
  const put = useCallback(async <T = any>(
    url: string, 
    data?: any
  ): Promise<T> => {
    return makeRequest<T>((instance) => 
      instance.put(url, data)
    );
  }, [makeRequest]);

  // PATCH request
  const patch = useCallback(async <T = any>(
    url: string, 
    data?: any
  ): Promise<T> => {
    return makeRequest<T>((instance) => 
      instance.patch(url, data)
    );
  }, [makeRequest]);

  // DELETE request
  const remove = useCallback(async <T = any>(url: string): Promise<T> => {
    return makeRequest<T>((instance) => 
      instance.delete(url)
    );
  }, [makeRequest]);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    loading: state.loading,
    error: state.error,
    
    // Métodos HTTP
    get,
    post,
    put,
    patch,
    remove,
    
    // Utilidades
    clearError,
  };
};

export default useHttp; 
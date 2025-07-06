import axios, { AxiosInstance, AxiosError } from "axios";
import { getIdToken } from "./firebase";
import {
  CreateTestDto,
  TestResult,
  UserStats,
  UserProfile,
  LeaderboardEntry,
  ApiError,
} from "./types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add Firebase token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting Firebase token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: this.getErrorMessage(error),
          status: error.response?.status || 500,
          statusText: error.response?.statusText || "Unknown Error",
        };
        return Promise.reject(apiError);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as any;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    switch (error.response?.status) {
      case 400:
        return "Datos inválidos";
      case 401:
        return "No autorizado. Por favor inicia sesión nuevamente";
      case 403:
        return "No tienes permisos para realizar esta acción";
      case 404:
        return "Recurso no encontrado";
      case 429:
        return "Demasiadas solicitudes. Intenta más tarde";
      case 500:
        return "Error interno del servidor";
      default:
        return error.message || "Error de conexión";
    }
  }

  // Typing Tests
  async createTest(data: CreateTestDto): Promise<TestResult> {
    const response = await this.api.post("/typing", data);
    return response.data;
  }

  async getTests(limit?: number): Promise<TestResult[]> {
    const params = limit ? { limit } : {};
    const response = await this.api.get("/typing", { params });
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get("/typing/stats");
    return response.data;
  }

  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    const response = await this.api.get("/users/profile");
    return response.data;
  }

  // Leaderboards (public endpoints)
  async getWpmLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await this.api.get("/leaderboard/wpm", {
      params: { limit },
    });
    return response.data;
  }

  async getAccuracyLeaderboard(
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    const response = await this.api.get("/leaderboard/accuracy", {
      params: { limit },
    });
    return response.data;
  }

  async getScoreLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await this.api.get("/leaderboard/score", {
      params: { limit },
    });
    return response.data;
  }

  // Utility method to check if error is API error
  isApiError(error: any): error is ApiError {
    return (
      error &&
      typeof error.status === "number" &&
      typeof error.message === "string"
    );
  }
}

export const apiService = new ApiService();
export default apiService;

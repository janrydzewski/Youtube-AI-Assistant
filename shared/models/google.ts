export interface AuthResponse {
  success: boolean;
  user?: {
    email: string;
    name: string;
    picture: string;
  };
  error?: string;
}

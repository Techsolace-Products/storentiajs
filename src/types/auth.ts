export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    app_id: string;
    token: string;
    scopes: string[];
    expires_at: string;
    revoked_at: string | null;
    created_at: string;
    updated_at: string;
  };
  timestamp: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

export interface SendAuthEmailInput {
  email: string;
  name: string;
}

export interface SendAuthEmailResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface VerifyAuthEmailInput {
  email: string;
  code: string;
}

export interface VerifyAuthEmailResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

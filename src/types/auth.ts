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

export interface CustomerAuthResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface CustomerAuthInput {
  email: string;
  password: string;
  publicStoreToken: string;
}

export interface SendAuthEmailInput {
  email: string;
  publicStoreToken: string;
}

export interface SendAuthEmailResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface VerifyAuthEmailInput {
  email: string;
  code: string;
  publicStoreToken: string;
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

export interface UpdateMeInput {
  name?: string;
}

export interface Address {
  id: string;
  customerId: string;
  fullName: string | null;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  fullName?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

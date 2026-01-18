export type UserRole = 'user' | 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  dietary_preferences?: string[];
  allergies?: string[];
  business_name?: string;
  business_license?: string;
  business_verified?: boolean;
  ad_wallet_balance?: number;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  businessData?: {
    businessName: string;
    businessLicense: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

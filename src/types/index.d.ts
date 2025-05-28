// src/types/index.d.ts
export interface AuthConfig {
  domain: string;
  clientId: string;
  audience?: string;
  redirectUri?: string;
  scope?: string;
  responseType?: string;
  cacheLocation?: string;
}

export interface OktaConfig {
  orgUrl: string;
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
}

export interface UserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}

export interface AuthProvider {
  login(): Promise<void>;
  logout(): void;
  getUserProfile(forceRefresh?: boolean): Promise<UserProfile>;
  isAuthenticated(): boolean | Promise<boolean>;
  getAccessToken(): string | Promise<string>;
  refreshToken(): Promise<boolean>;
  resetPassword(email: string): Promise<string>;
  changePassword(oldPassword: string, newPassword: string): Promise<string>; // NEW: Change password for authenticated user
  getDetailedUserProfile(): Promise<UserProfile>; // NEW: Get detailed profile via Management API
  updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile>; // NEW: Update user profile
}

export interface GMFCIAMAuth {
  createAuthProvider(type: 'auth0' | 'okta', config: AuthConfig | OktaConfig): Promise<AuthProvider>;
}

declare const gmfCiamAuth: GMFCIAMAuth;
export default gmfCiamAuth;
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
    getUserProfile(): Promise<UserProfile>;
    isAuthenticated(): boolean;
    getAccessToken(): string;
  }
  
  export interface UniversalAuth {
    createAuthProvider(type: 'auth0' | 'okta', config: AuthConfig | OktaConfig): Promise<AuthProvider>;
  }
  
  declare const universalAuth: UniversalAuth;
  export default universalAuth;
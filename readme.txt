Universal Auth SDK
A lightweight, provider-agnostic authentication SDK for web applications that works with Auth0 and Okta.

Show Image
Show Image

Features
🔄 Single interface for multiple auth providers (Auth0, Okta)
🛡️ Built-in token refresh and management
📱 Framework-agnostic (works with React, Angular, Vue, and vanilla JS)
🔑 Secure storage and handling of authentication tokens
📝 Complete TypeScript definitions
Installation
bash
npm install universal-sdk
or

bash
yarn add universal-sdk
Quick Start
javascript
import UniversalAuth from 'universal-sdk';

// Configure your authentication provider
const config = {
  domain: 'your-domain.auth0.com',
  clientId: 'your-client-id',
  audience: 'https://api.example.com',
  redirectUri: window.location.origin
};

// Create an auth provider instance
UniversalAuth.createAuthProvider('auth0', config)
  .then(authProvider => {
    // Check if the user is authenticated
    if (authProvider.isAuthenticated()) {
      // User is logged in, get their profile
      authProvider.getUserProfile()
        .then(profile => console.log('User profile:', profile));
    } else {
      // User is not logged in, show login button
      document.getElementById('loginButton').addEventListener('click', () => {
        authProvider.login();
      });
    }
    
    // Add logout functionality
    document.getElementById('logoutButton').addEventListener('click', () => {
      authProvider.logout();
    });
  });
Framework Integration Examples
React
jsx
// Import the SDK and React hooks
import React, { useState, useEffect } from 'react';
import UniversalAuth from 'universal-sdk';

function App() {
  const [authProvider, setAuthProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the auth provider
    const config = {
      domain: 'your-domain.auth0.com',
      clientId: 'your-client-id',
      audience: 'https://api.example.com',
      redirectUri: window.location.origin
    };

    UniversalAuth.createAuthProvider('auth0', config)
      .then(provider => {
        setAuthProvider(provider);
        provider.isAuthenticated().then(authenticated => {
          setIsAuthenticated(authenticated);
          if (authenticated) {
            provider.getUserProfile().then(profile => setUser(profile));
          }
          setIsLoading(false);
        });
      });
  }, []);

  const login = () => authProvider?.login();
  const logout = () => {
    authProvider?.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.name}</h1>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div>
          <h1>Please log in</h1>
          <button onClick={login}>Log In</button>
        </div>
      )}
    </div>
  );
}
Angular
typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import UniversalAuth from 'universal-sdk';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authProvider: any;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userProfileSubject = new BehaviorSubject<any>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public userProfile$ = this.userProfileSubject.asObservable();
  
  constructor() {
    this.initAuth();
  }
  
  private async initAuth() {
    const config = {
      domain: 'your-domain.auth0.com',
      clientId: 'your-client-id',
      audience: 'https://api.example.com',
      redirectUri: window.location.origin
    };
    
    this.authProvider = await UniversalAuth.createAuthProvider('auth0', config);
    const isAuthenticated = await this.authProvider.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
    
    if (isAuthenticated) {
      const profile = await this.authProvider.getUserProfile();
      this.userProfileSubject.next(profile);
    }
  }
  
  public login() {
    this.authProvider?.login();
  }
  
  public logout() {
    this.authProvider?.logout();
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
  }
}
API Reference
UniversalAuth
createAuthProvider(type: string, config: object): Promise<AuthProvider>
Creates an authentication provider of the specified type
Supported types: 'auth0', 'okta'
AuthProvider Interface
All auth providers implement these methods:

login(): Promise<void> - Initiates the login process
logout(): void - Logs the user out
getUserProfile(): Promise<object> - Gets the user profile
isAuthenticated(): Promise<boolean> - Checks if the user is authenticated
getAccessToken(): Promise<string> - Gets the access token for API calls
refreshToken(): Promise<boolean> - Manually refreshes the token
Configuration Options
Auth0 Configuration
javascript
{
  domain: 'your-domain.auth0.com',  // Required: Your Auth0 domain
  clientId: 'your-client-id',       // Required: Your Auth0 client ID
  audience: 'https://api.example.com', // Required: API identifier
  redirectUri: window.location.origin, // Optional: Redirect URI after login
  scope: 'openid profile email offline_access', // Optional: OAuth scopes
  responseType: 'code',             // Optional: OAuth response type
  cacheLocation: 'localstorage'     // Optional: Where to store tokens
}
Okta Configuration
javascript
{
  orgUrl: 'https://your-org.okta.com', // Required: Your Okta organization URL
  clientId: 'your-client-id',          // Required: Your Okta client ID
  redirectUri: window.location.origin, // Optional: Redirect URI after login
  scopes: ['openid', 'profile', 'email'] // Optional: OAuth scopes
}
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is licensed under the MIT License - see the LICENSE file for details.


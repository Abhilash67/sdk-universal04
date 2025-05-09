# Universal Auth SDK

A universal authentication SDK that provides a consistent interface for different authentication providers (Auth0, Okta, etc.).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Vanilla JavaScript](#vanilla-javascript)
  - [React Integration](#react-integration)
  - [Angular Integration](#angular-integration)
- [Authentication Providers](#authentication-providers)
  - [Auth0](#auth0)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package using npm:

```bash
npm install universal-auth
```

Or using yarn:

```bash
yarn add universal-auth
```

## Usage

### Vanilla JavaScript

#### Using ES Modules

```javascript
import UniversalAuth from 'universal-auth';

// Configure Auth0
const auth0Config = {
  domain: 'your-domain.auth0.com',
  clientId: 'your-client-id',
  audience: 'your-audience-uri', // Required for Auth0
  redirectUri: window.location.origin
};

// Initialize Auth0 provider
async function initializeAuth() {
  try {
    const authClient = await UniversalAuth.createAuthProvider('auth0', auth0Config);
    
    // Check if user is already authenticated
    if (authClient.isAuthenticated()) {
      const profile = await authClient.getUserProfile();
      console.log('User profile:', profile);
    } else {
      // Set up login button
      document.getElementById('login-button').addEventListener('click', () => {
        authClient.login();
      });
    }
    
    // Set up logout button
    document.getElementById('logout-button').addEventListener('click', () => {
      authClient.logout();
    });
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', initializeAuth);
```

#### Using Script Tag (UMD)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Auth Example</title>
  <script src="node_modules/universal-auth/dist/universal-auth.js"></script>
</head>
<body>
  <button id="login-button">Login</button>
  <button id="logout-button" style="display:none">Logout</button>
  <div id="profile" style="display:none"></div>
  
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      // Configure Auth0
      const auth0Config = {
        domain: 'your-domain.auth0.com',
        clientId: 'your-client-id',
        audience: 'your-audience-uri', // Required for Auth0
        redirectUri: window.location.origin
      };
      
      try {
        // Initialize Auth0 provider
        const authClient = await UniversalAuth.createAuthProvider('auth0', auth0Config);
        
        // Handle login/logout
        document.getElementById('login-button').addEventListener('click', () => {
          authClient.login();
        });
        
        document.getElementById('logout-button').addEventListener('click', () => {
          authClient.logout();
        });
        
        // Check authentication status
        updateUI();
        
        function updateUI() {
          const isAuthenticated = authClient.isAuthenticated();
          document.getElementById('login-button').style.display = isAuthenticated ? 'none' : 'block';
          document.getElementById('logout-button').style.display = isAuthenticated ? 'block' : 'none';
          document.getElementById('profile').style.display = isAuthenticated ? 'block' : 'none';
          
          if (isAuthenticated) {
            authClient.getUserProfile().then(profile => {
              document.getElementById('profile').textContent = JSON.stringify(profile, null, 2);
            });
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    });
  </script>
</body>
</html>
```

### React Integration

#### Setting up Authentication Context

```jsx
// src/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import UniversalAuth from 'universal-auth';

// Create the authentication context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Configure Auth0
        const auth0Config = {
          domain: process.env.REACT_APP_AUTH0_DOMAIN,
          clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          redirectUri: window.location.origin
        };
        
        // Create Auth0 provider
        const client = await UniversalAuth.createAuthProvider('auth0', auth0Config);
        setAuthClient(client);
        
        // Check authentication status
        const authenticated = client.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const profile = await client.getUserProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = () => {
    if (authClient) {
      authClient.login();
    }
  };
  
  // Logout function
  const logout = () => {
    if (authClient) {
      authClient.logout();
    }
  };
  
  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    authClient
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
```

#### Using the Auth Context in Components

```jsx
// src/App.js
import React from 'react';
import { AuthProvider } from './auth/AuthContext';
import LoginButton from './components/LoginButton';
import Profile from './components/Profile';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header>
          <h1>React Auth Example</h1>
        </header>
        <main>
          <LoginButton />
          <Profile />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
```

```jsx
// src/components/LoginButton.js
import React from 'react';
import { useAuth } from '../auth/AuthContext';

function LoginButton() {
  const { isAuthenticated, loading, login, logout } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <button onClick={isAuthenticated ? logout : login}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}

export default LoginButton;
```

```jsx
// src/components/Profile.js
import React from 'react';
import { useAuth } from '../auth/AuthContext';

function Profile() {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated || !user) {
    return <div>Please log in to see your profile</div>;
  }
  
  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default Profile;
```

### Angular Integration

#### Creating an Auth Service

```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import UniversalAuth from 'universal-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authClient: any = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  user$ = this.userSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  
  constructor() {
    this.initializeAuth();
  }
  
  private async initializeAuth(): Promise<void> {
    try {
      // Configure Auth0
      const auth0Config = {
        domain: 'your-domain.auth0.com',
        clientId: 'your-client-id',
        audience: 'your-audience-uri', // Required for Auth0
        redirectUri: window.location.origin
      };
      
      // Create Auth0 provider
      this.authClient = await UniversalAuth.createAuthProvider('auth0', auth0Config);
      
      // Check authentication status
      const authenticated = this.authClient.isAuthenticated();
      this.isAuthenticatedSubject.next(authenticated);
      
      if (authenticated) {
        const profile = await this.authClient.getUserProfile();
        this.userSubject.next(profile);
      }
    } catch (error) {
      console.error('Authentication initialization error:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }
  
  login(): void {
    if (this.authClient) {
      this.authClient.login();
    }
  }
  
  logout(): void {
    if (this.authClient) {
      this.authClient.logout();
    }
  }
  
  async refreshUser(): Promise<void> {
    if (this.authClient && this.authClient.isAuthenticated()) {
      try {
        const profile = await this.authClient.getUserProfile();
        this.userSubject.next(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  }
  
  getAccessToken(): string | null {
    if (this.authClient && this.authClient.isAuthenticated()) {
      return this.authClient.getAccessToken();
    }
    return null;
  }
}
```

#### Creating Auth Components

```typescript
// src/app/components/login-button/login-button.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-button',
  template: `
    <button 
      *ngIf="!(loading$ | async)" 
      (click)="handleAuth()"
      class="btn btn-primary">
      {{ (isAuthenticated$ | async) ? 'Logout' : 'Login' }}
    </button>
    <div *ngIf="loading$ | async">Loading...</div>
  `
})
export class LoginButtonComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  loading$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.loading$ = this.authService.loading$;
  }
  
  ngOnInit(): void {}
  
  handleAuth(): void {
    if (this.authService.isAuthenticated$.value) {
      this.authService.logout();
    } else {
      this.authService.login();
    }
  }
}
```

```typescript
// src/app/components/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="!(loading$ | async); else loadingTemplate">
      <div *ngIf="(isAuthenticated$ | async) && (user$ | async); else notAuthenticated">
        <h2>User Profile</h2>
        <p>Name: {{ (user$ | async)?.name }}</p>
        <p>Email: {{ (user$ | async)?.email }}</p>
        <pre>{{ (user$ | async) | json }}</pre>
      </div>
      <ng-template #notAuthenticated>
        <p>Please log in to see your profile</p>
      </ng-template>
    </div>
    <ng-template #loadingTemplate>
      <div>Loading...</div>
    </ng-template>
  `
})
export class UserProfileComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<any>;
  loading$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.user$ = this.authService.user$;
    this.loading$ = this.authService.loading$;
  }
  
  ngOnInit(): void {}
}
```

#### Using Auth Components in AppModule

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginButtonComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Authentication Providers

### Auth0

#### Configuration

The Auth0 provider requires the following configuration:

| Parameter    | Type     | Description                                          | Required |
|--------------|----------|------------------------------------------------------|----------|
| `domain`     | string   | Your Auth0 domain (e.g., `your-domain.auth0.com`)    | Yes      |
| `clientId`   | string   | Your Auth0 application client ID                      | Yes      |
| `audience`   | string   | API identifier for the API you want to access         | Yes      |
| `redirectUri`| string   | URI where Auth0 will redirect after authentication    | No (defaults to `window.location.origin`) |
| `scope`      | string   | Scopes requested during authentication                | No (defaults to `openid profile email`) |

#### Example Configuration

```javascript
const auth0Config = {
  domain: 'your-domain.auth0.com',
  clientId: 'your-client-id',
  audience: 'https://your-domain.auth0.com/api/v2/',
  redirectUri: window.location.origin,
  scope: 'openid profile email read:data'
};
```

## API Reference

### UniversalAuth.createAuthProvider(providerType, config)

Creates and initializes a new authentication provider.

#### Parameters:

- `providerType` (string): The type of authentication provider ('auth0', etc.)
- `config` (object): Provider-specific configuration

#### Returns:

- Promise that resolves to an authentication provider instance

### AuthProvider Methods

All authentication providers implement the following interface:

#### login()

Redirects the user to the provider's login page.

#### logout()

Logs out the user and clears the authentication state.

#### getUserProfile()

Retrieves the authenticated user's profile.

#### Returns:

- Promise that resolves to the user profile object

#### isAuthenticated()

Checks if the user is currently authenticated.

#### Returns:

- Boolean indicating authentication status

#### getAccessToken()

Gets the access token for the authenticated user.

#### Returns:

- String containing the access token

## Troubleshooting

### Common Issues

#### 1. "Missing required Auth0 configuration parameters"

Make sure you have provided all required parameters in your Auth0 configuration:
- `domain`
- `clientId`
- `audience` (required for Auth0)

#### 2. Redirect Not Working

If clicking the login button doesn't redirect to Auth0:
- Check that you're using the correct domain and clientId
- Make sure your Auth0 application has the correct callback URLs configured
- Check the browser console for any errors

#### 3. Callback URL Issues

If you're getting errors after authentication:
- Verify that the redirectUri in your config matches the Allowed Callback URLs in your Auth0 dashboard
- Make sure your application is being served from the same origin as the redirectUri

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

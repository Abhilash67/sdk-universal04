export class AuthProvider {
  constructor(config) {
    if (this.constructor === AuthProvider) {
      throw new Error(
        "AuthProvider is an abstract class and cannot be instantiated directly"
      );
    }
  }

  login() {
    throw new Error("Method 'login()' must be implemented");
  }

  logout() {
    throw new Error("Method 'logout()' must be implemented");
  }

  getUserProfile(forceRefresh = false) {
    throw new Error("Method 'getUserProfile()' must be implemented");
  }

  isAuthenticated() {
    throw new Error("Method 'isAuthenticated()' must be implemented");
  }

  getAccessToken() {
    throw new Error("Method 'getAccessToken()' must be implemented");
  }

  refreshToken() {
    throw new Error("Method 'refreshToken()' must be implemented");
  }
  
  resetPassword(email) {
    throw new Error("Method 'resetPassword()' must be implemented");
  }

  // NEW: Change password for authenticated user
  changePassword(oldPassword, newPassword) {
    throw new Error("Method 'changePassword()' must be implemented");
  }

  // NEW: Get detailed user profile
  getDetailedUserProfile() {
    throw new Error("Method 'getDetailedUserProfile()' must be implemented");
  }

  // NEW: Update user profile
  updateUserProfile(updates) {
    throw new Error("Method 'updateUserProfile()' must be implemented");
  }
}

export function createAuthProvider(type, config) {
  console.log("type", type);
  return import("../src/provider/auth0-provider").then((module) => {
    return new module.default(config);
  });
}
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

  getUserProfile() {
    throw new Error("Method 'getUserProfile()' must be implemented");
  }

  isAuthenticated() {
    throw new Error("Method 'isAuthenticated()' must be implemented");
  }

  getAccessToken() {
    throw new Error("Method 'getAccessToken()' must be implemented");
  }
}

export function createAuthProvider(type, config) {
  console.log("type", type);
  return import("../src/provider/auth0-provider").then((module) => {
    return new module.default(config);
  });
}

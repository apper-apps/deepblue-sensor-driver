import userData from "@/services/mockData/users.json";

class AuthServiceClass {
  constructor() {
    this.users = [...userData];
    this.currentUser = null;
  }

  async login(credentials) {
    await this.delay();
    
    const { email, password } = credentials;
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated. Please contact an administrator.");
    }

    const userData = { ...user };
    delete userData.password;
    
    this.currentUser = userData;
    localStorage.setItem('auth_token', JSON.stringify(userData));
    
    return userData;
  }

  async logout() {
    await this.delay();
    this.currentUser = null;
    localStorage.removeItem('auth_token');
  }

  async register(registrationData) {
    await this.delay();
    
    const existingUser = this.users.find(u => u.email === registrationData.email);
    if (existingUser) {
      throw new Error("Email address already registered");
    }

    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...registrationData,
      role: 'student', // Default role
      isActive: true,
      createdAt: new Date().toISOString(),
      profileComplete: false,
      certifications: [],
      emergencyContact: {},
      preferences: {
        visibility: 'public',
        showContact: false,
        showCertifications: true
      }
    };

    this.users.push(newUser);
    
    const userData = { ...newUser };
    delete userData.password;
    
    this.currentUser = userData;
    localStorage.setItem('auth_token', JSON.stringify(userData));
    
    return userData;
  }

  async getCurrentUser() {
    const stored = localStorage.getItem('auth_token');
    if (!stored) {
      throw new Error("No user logged in");
    }

    const userData = JSON.parse(stored);
    
    // Verify user still exists and is active
    const user = this.users.find(u => u.Id === userData.Id);
    if (!user || !user.isActive) {
      localStorage.removeItem('auth_token');
      throw new Error("User session invalid");
    }

    this.currentUser = userData;
    return userData;
  }

  async changePassword(currentPassword, newPassword) {
    await this.delay();
    
    if (!this.currentUser) {
      throw new Error("Not authenticated");
    }

    const user = this.users.find(u => u.Id === this.currentUser.Id);
    if (!user || user.password !== currentPassword) {
      throw new Error("Current password is incorrect");
    }

    const index = this.users.findIndex(u => u.Id === this.currentUser.Id);
    this.users[index].password = newPassword;
    
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const AuthService = new AuthServiceClass();
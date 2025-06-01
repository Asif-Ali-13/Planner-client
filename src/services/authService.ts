
// Authentication service for handling user signup, signin, and profile management
// TODO: Implement actual authentication logic with your backend API

export interface SignUpData {
  username: string; // Must be unique
  email: string;    // Must be unique
  password: string;
}

export interface SignInData {
  username: string; // Changed from email to username
  password: string;
}

export interface User {
  id: string;
  username: string; // Added username field
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
}

class AuthService {
  private baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // TODO: Implement actual signup API call
  async signUp(data: SignUpData): Promise<User> {
    try {
      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // 
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Signup failed');
      // }
      // 
      // return response.json();
      
      // Simulated response for now
      console.log('Signing up user:', data);
      return {
        id: '1',
        username: data.username,
        name: data.username, // Using username as display name for now
        email: data.email,
        joinedDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Failed to create account. Username or email may already exist.');
    }
  }

  // TODO: Implement actual signin API call
  async signIn(data: SignInData): Promise<{ user: User; token: string }> {
    try {
      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/signin`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // 
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Signin failed');
      // }
      // 
      // return response.json();
      
      // Simulated response for now
      console.log('Signing in user:', data);
      return {
        user: {
          id: '1',
          username: data.username,
          name: data.username,
          email: `${data.username}@example.com`,
          joinedDate: '2024-01-15'
        },
        token: 'mock-jwt-token'
      };
    } catch (error) {
      console.error('Signin failed:', error);
      throw new Error('Invalid username or password');
    }
  }

  // TODO: Implement actual profile fetch API call
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/me`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch user');
      // }
      // 
      // return response.json();
      
      // Simulated response for now
      return {
        id: '1',
        username: 'johndoe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        joinedDate: '2024-01-15'
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }

  // TODO: Implement actual signout functionality
  async signOut(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem('auth_token');
      
      // Optional: Call backend to invalidate token
      // await fetch(`${this.baseURL}/auth/signout`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
    } catch (error) {
      console.error('Signout failed:', error);
    }
  }

  // TODO: Implement profile update API call
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/profile`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(updates)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update profile');
      // }
      // 
      // return response.json();
      
      // Simulated response for now
      const currentUser = await this.getCurrentUser();
      return { ...currentUser!, ...updates };
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Failed to update profile');
    }
  }

  // TODO: Implement username/email uniqueness check
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/check-username/${username}`);
      // const result = await response.json();
      // return result.available;
      
      // Simulated response for now
      console.log('Checking username availability:', username);
      return true; // Assume available for demo
    } catch (error) {
      console.error('Failed to check username:', error);
      return false;
    }
  }

  // TODO: Implement email uniqueness check
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      // Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/check-email/${email}`);
      // const result = await response.json();
      // return result.available;
      
      // Simulated response for now
      console.log('Checking email availability:', email);
      return true; // Assume available for demo
    } catch (error) {
      console.error('Failed to check email:', error);
      return false;
    }
  }
}

export const authService = new AuthService();

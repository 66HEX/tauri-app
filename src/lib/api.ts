// API service for handling authentication and other API requests

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PORT = import.meta.env.VITE_API_PORT;

// Construct the base URL
const baseUrl = `${API_BASE_URL}:${API_PORT}`;

// Interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for registration credentials
interface RegisterCredentials {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

// Interface for authentication response
interface AuthResponse {
  token?: string;
  user?: any;
  success: boolean;
  message?: string;
}

// Interface for user data
interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'client' | 'trainer' | 'admin';
  phone_number?: string;
}

/**
 * Login function that sends credentials to the authentication endpoint
 * @param credentials - Object containing email and password
 * @returns Promise with authentication response
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Send credentials in the request body as JSON
    const url = new URL(`${baseUrl}/api/auth/login`);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Store token in localStorage for future requests
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem('user_data', JSON.stringify(data.user));
    }
    
    return {
      success: true,
      token: data.token,
      user: data.user,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
};

/**
 * Register function that sends user registration data to the API
 * @param credentials - Object containing registration information
 * @returns Promise with authentication response
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    // Send registration data in the request body as JSON
    const url = new URL(`${baseUrl}/api/users`);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // If registration returns a token, store it
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem('user_data', JSON.stringify(data.user));
    }
    
    return {
      success: true,
      token: data.token,
      user: data.user,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed'
    };
  }
};

/**
 * Function to check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('auth_token') !== null;
};

/**
 * Function to logout user
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

/**
 * Get current user data
 * @returns The user data or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('user_data');
  if (!userData) {
    console.warn('User data not found in localStorage');
    return null;
  }
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get authentication token
 * @returns The authentication token or null if not authenticated
 */
export const getToken = (): string | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.warn('Authentication token not found in localStorage');
    return null;
  }
  return token;
};

/**
 * Helper function to make authenticated API requests
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param body - Request body
 * @returns Promise with response data
 */
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body: any = null
): Promise<any> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      // Check for authorization errors specifically
      if (response.status === 401) {
        console.error('Authorization error: Token may be invalid or expired');
        // Clear the invalid token
        localStorage.removeItem('auth_token');
        throw new Error('Authorization failed: Please log in again');
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * Get appointments for the current client
 * @returns Promise with appointments data
 */
export const getClientAppointments = async (): Promise<any> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  if (user.role === 'admin') {
    // Admins can see all appointments
    return apiRequest('/api/appointments');
  } else {
    // Use the user ID from the stored user data
    return apiRequest(`/api/appointments/client/${user.id}`);
  }
};

/**
 * Get appointments for the current trainer
 * @returns Promise with appointments data
 */
export const getTrainerAppointments = async (): Promise<any> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  if (user.role === 'admin') {
    // Admins can see all appointments
    return apiRequest('/api/appointments');
  } else {
    // Use the user ID from the stored user data
    return apiRequest(`/api/appointments/trainer/${user.id}`);
  }
};

/**
 * Create a new appointment
 * @param appointmentData - Appointment data to create
 * @returns Promise with created appointment
 */
export const createAppointment = async (appointmentData: any): Promise<any> => {
  return apiRequest('/api/appointments', 'POST', appointmentData);
};

/**
 * Update an appointment
 * @param id - Appointment ID
 * @param appointmentData - Updated appointment data
 * @returns Promise with updated appointment
 */
export const updateAppointment = async (id: string, appointmentData: any): Promise<any> => {
  return apiRequest(`/api/appointments/${id}`, 'PUT', appointmentData);
};

/**
 * Update appointment status
 * @param id - Appointment ID
 * @param status - New status (completed, cancelled, no-show)
 * @returns Promise with updated appointment
 */
export const updateAppointmentStatus = async (id: string, status: string): Promise<any> => {
  return apiRequest(`/api/appointments/${id}`, 'PUT', { status });
};
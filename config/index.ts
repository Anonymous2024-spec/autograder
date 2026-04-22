/**
 * Configuration for the frontend app
 * Update API_BASE_URL to match your backend deployment
 */

// For local development (Docker)
// export const API_BASE_URL = "http://localhost:3000/api";

// For Android emulator
// export const API_BASE_URL = "http://10.0.2.2:3000/api";

// For iOS simulator
// export const API_BASE_URL = "http://127.0.0.1:3000/api";

// For physical device on WiFi (replace with your machine IP)
export const API_BASE_URL = "http://192.168.1.5:3000/api";

// Timeout for API requests (in milliseconds)
export const API_TIMEOUT = 30000;

// Test credentials for development
export const TEST_CREDENTIALS = {
  admin: {
    email: "admin@autograder.com",
    password: "admin123",
  },
  lecturer: {
    email: "lecturer1@autograder.com",
    password: "lecturer123",
  },
  student: {
    email: "student1@autograder.com",
    password: "student123",
  },
};

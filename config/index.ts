/**
 * Configuration for the frontend app
 * Update API_BASE_URL to match your backend deployment.
 * The backend runs inside Docker, exposed on host port 3000.
 *
 * Uncomment the line that matches your setup:
 */

// iOS simulator / Expo Web / local browser:
// export const API_BASE_URL = "http://localhost:3000/api";

// Android emulator (10.0.2.2 routes to the host machine):
// export const API_BASE_URL = "http://10.0.2.2:3000/api";

// Physical device on WiFi (machine's LAN IP):
export const API_BASE_URL = "http://192.168.8.196:3000/api";

// export const API_BASE_URL = "http://31.97.44.199:3000/api";

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

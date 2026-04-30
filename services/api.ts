/**
 * API Service for AutoGrader
 * Handles all backend API communication
 */

import { API_BASE_URL } from "../config";

// Helper to make authenticated requests
export async function apiCall(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
) {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let message = "API request failed";
    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // Response body is not JSON — keep default message
    }
    throw new Error(message);
  }

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json()),

  signup: (
    email: string,
    password: string,
    full_name: string,
    role: string,
    student_id_number?: string,
    department?: string
  ) =>
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name,
        role,
        student_id_number,
        department,
      }),
    }).then((r) => r.json()),

  getMe: (token: string) =>
    apiCall("/auth/me", { token }),

  logout: (token: string) =>
    apiCall("/auth/logout", { method: "POST", token }),
};

// ============ ADMIN ENDPOINTS ============

export const adminAPI = {
  getAllStudents: (token: string) =>
    apiCall("/admin/students", { token }),

  getStudent: (studentId: number, token: string) =>
    apiCall(`/admin/students/${studentId}`, { token }),

  getAllLecturers: (token: string) =>
    apiCall("/admin/lecturers", { token }),

  getAllCourses: (token: string) =>
    apiCall("/admin/courses", { token }),

  enrollStudent: (studentId: number, courseId: number, token: string) =>
    apiCall(`/admin/enroll?student_id=${studentId}&course_id=${courseId}`, {
      method: "POST",
      token,
    }),

  unenrollStudent: (studentId: number, courseId: number, token: string) =>
    apiCall(`/admin/enroll?student_id=${studentId}&course_id=${courseId}`, {
      method: "DELETE",
      token,
    }),

  deleteUser: (userId: number, token: string) =>
    apiCall(`/admin/users/${userId}`, { method: "DELETE", token }),

  updateUser: (
    userId: number,
    data: {
      full_name?: string;
      email?: string;
      student_id_number?: string;
      department?: string;
      specialization?: string;
    },
    token: string
  ) =>
    apiCall(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  getLecturer: (lecturerId: number, token: string) =>
    apiCall(`/admin/lecturers/${lecturerId}`, { token }),

  getCourse: (courseId: number, token: string) =>
    apiCall(`/admin/courses/${courseId}`, { token }),

  createCourse: (
    data: { code: string; title: string; description?: string; lecturer_id: number },
    token: string
  ) =>
    apiCall("/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateCourse: (
    courseId: number,
    data: { code?: string; title?: string; description?: string },
    token: string
  ) =>
    apiCall(`/admin/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteCourse: (courseId: number, token: string) =>
    apiCall(`/admin/courses/${courseId}`, { method: "DELETE", token }),
};

// ============ LECTURER ENDPOINTS ============

export const lecturerAPI = {
  createCourse: (courseData: any, token: string) =>
    apiCall("/lecturer/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
      token,
    }),

  getCourses: (token: string) =>
    apiCall("/lecturer/courses", { token }),

  getCourse: (courseId: number, token: string) =>
    apiCall(`/lecturer/courses/${courseId}`, { token }),

  createQuestion: async (
    unitId: number,
    questionData: any,
    token: string
  ) => {
    const formData = new FormData();
    formData.append("unit_id", unitId.toString());
    formData.append("question_text", questionData.question_text || "");
    formData.append("total_marks", (questionData.total_marks || 10).toString());

    if (questionData.question_pdf) {
      formData.append("question_pdf", questionData.question_pdf);
    }
    if (questionData.marking_guide_pdf) {
      formData.append("marking_guide_pdf", questionData.marking_guide_pdf);
    }

    const response = await fetch(`${API_BASE_URL}/lecturer/questions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create question");
    }

    return response.json();
  },

  getUnitQuestions: (unitId: number, token: string) =>
    apiCall(`/lecturer/questions/${unitId}`, { token }),

  getCourseGrades: (courseId: number, token: string) =>
    apiCall(`/lecturer/grades/course/${courseId}`, { token }),

  getCourseStudents: (courseId: number, token: string) =>
    apiCall(`/lecturer/courses/${courseId}/students`, { token }),

  getCourseQuestions: (courseId: number, token: string) =>
    apiCall(`/lecturer/courses/${courseId}/questions`, { token }),
};

// ============ STUDENT ENDPOINTS ============

export const studentAPI = {
  getEnrolledCourses: (token: string) =>
    apiCall("/student/courses", { token }),

  getAllGrades: (token: string) =>
    apiCall("/student/grades", { token }),

  getCourseGrades: (courseId: number, token: string) =>
    apiCall(`/student/grades/${courseId}`, { token }),
};

// ============ GRADING ENDPOINTS ============

export const gradingAPI = {
  gradeQuestion: async (
    questionId: number,
    studentId: number,
    answerSheet: any,
    token: string
  ) => {
    const formData = new FormData();
    formData.append("question_id", questionId.toString());
    formData.append("student_id", studentId.toString());
    formData.append("answer_sheet", answerSheet);

    const response = await fetch(`${API_BASE_URL}/grade`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to grade question");
    }

    return response.json();
  },

  getGrade: (gradeId: number, token: string) =>
    apiCall(`/grade/${gradeId}`, { token }),
};

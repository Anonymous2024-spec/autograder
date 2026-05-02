# AutoGrader Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate the frontend with the FastAPI backend. The frontend now uses real API calls instead of mock data.

## Configuration

### 1. Update Backend URL
Edit `config/index.ts` to match your backend deployment:

```typescript
// For local development (Docker)
export const API_BASE_URL = "http://localhost:3000/api";

// For Android emulator
export const API_BASE_URL = "http://10.0.2.2:3000/api";

// For iOS simulator
export const API_BASE_URL = "http://127.0.0.1:3000/api";

// For physical device on same WiFi
export const API_BASE_URL = "http://192.168.1.5:3000/api";  // Replace with your IP
```

## Authentication Flow

### Login/Signup
The `AuthContext` now communicates with the backend:

```typescript
// Login
await login(email, password);
// Internally:
// 1. Sends POST /api/auth/login
// 2. Backend returns { access_token, token_type, user }
// 3. Stores token in SecureStore
// 4. Stores user in SecureStore
```

**Test Credentials:**
- Admin: `admin@autograder.com` / `admin123`
- Lecturer: `lecturer1@autograder.com` / `lecturer123`
- Student: `student1@autograder.com` / `student123`

## Available APIs

All APIs are defined in `services/api.ts`:

### Authentication
```typescript
import { authAPI } from '@/services/api';

// Login
const response = await authAPI.login(email, password);

// Get current user
const user = await authAPI.getMe(token);

// Logout
await authAPI.logout(token);
```

### Lecturer APIs
```typescript
import { lecturerAPI } from '@/services/api';

// Get courses
const courses = await lecturerAPI.getCourses(token);

// Create course
const course = await lecturerAPI.createCourse({
  code: "CS101",
  title: "Intro to Programming",
  units: [...]
}, token);

// Create question with PDFs
const question = await lecturerAPI.createQuestion(unitId, {
  question_text: "...",
  total_marks: 10,
  question_pdf: file,
  marking_guide_pdf: file
}, token);

// Get course grades
const grades = await lecturerAPI.getCourseGrades(courseId, token);
```

### Student APIs
```typescript
import { studentAPI } from '@/services/api';

// Get enrolled courses
const courses = await studentAPI.getEnrolledCourses(token);

// Get grades
const grades = await studentAPI.getAllGrades(token);
const courseGrades = await studentAPI.getCourseGrades(courseId, token);
```

### Grading APIs
```typescript
import { gradingAPI } from '@/services/api';

// Grade a student's answer sheet
const result = await gradingAPI.gradeQuestion(
  questionId,
  studentId,
  answerSheetFile,
  token
);
// Returns: { grade: GradeResponse, grading_result: {...} }
```

## Using Data-Fetching Hooks

### useAsync Hook
For loading data on component mount:

```typescript
import { useAsync } from '@/hooks/use-async';
import { lecturerAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export function CoursesList() {
  const { token } = useAuth();
  const { data: courses, loading, error, execute } = useAsync(
    () => lecturerAPI.getCourses(token!),
    true  // Fetch immediately on mount
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ScrollView>
      {courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </ScrollView>
  );
}
```

### useAsyncMutation Hook
For manual API calls (mutations):

```typescript
import { useAsyncMutation } from '@/hooks/use-async';
import { gradingAPI } from '@/services/api';

export function GradingScreen() {
  const { token, user } = useAuth();
  const { execute: grade, loading, error } = useAsyncMutation(
    (questionId: number, answerSheet: any) =>
      gradingAPI.gradeQuestion(questionId, user!.id, answerSheet, token!)
  );

  const handleGrade = async () => {
    try {
      const result = await grade(questionId, answerSheetFile);
      // Handle result
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button onPress={handleGrade} disabled={loading}>
        {loading ? "Grading..." : "Grade"}
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  );
}
```

## Loading States

Use the `LoadingOverlay` component for full-screen loading:

```typescript
import LoadingOverlay from '@/components/LoadingOverlay';

<LoadingOverlay visible={loading} message="Processing..." />
```

Or `LoadingIndicator` for inline loading:

```typescript
import { LoadingIndicator } from '@/components/LoadingOverlay';

if (loading) return <LoadingIndicator size="large" />;
```

## Error Handling

All API errors have this format:
```typescript
{
  detail: "Error message"
}
```

Handle errors in your screens:

```typescript
try {
  await apiCall(...);
} catch (err) {
  setError(err.message);
  // Show error UI
}
```

## Updating Existing Screens

### Example: Lecturer Dashboard
Replace mock data with API calls:

**Before:**
```typescript
const ACTIONS = [
  { id: "courses", stat: "8", statLabel: "courses assigned" },
  { id: "questions", stat: "340", statLabel: "questions added" },
  // ... mock data
];
```

**After:**
```typescript
const { token } = useAuth();
const { data: courses, loading } = useAsync(
  () => lecturerAPI.getCourses(token!),
  !!token
);

const courseCount = courses?.length ?? 0;

// Use courseCount instead of "8"
```

### Example: Lecturer Courses Screen
```typescript
export function CoursesScreen() {
  const { token } = useAuth();
  const { data: courses, loading, error } = useAsync(
    () => lecturerAPI.getCourses(token!),
    !!token
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ScrollView>
      {courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </ScrollView>
  );
}
```

### Example: Grading Screen
```typescript
export function GradingScreen() {
  const { token, user } = useAuth();
  const { execute: grade, loading } = useAsyncMutation(
    (q: number, sheet: any) =>
      gradingAPI.gradeQuestion(q, user!.id, sheet, token!)
  );

  return (
    <View>
      <Button 
        onPress={handleSelectAndGrade}
        disabled={loading}
        title={loading ? "Grading..." : "Grade Answer Sheet"}
      />
    </View>
  );
}
```

## Common Patterns

### 1. Fetch on Mount
```typescript
const { data, loading, error } = useAsync(
  () => apiCall(token),
  !!token  // Only fetch when token is available
);
```

### 2. Manual Trigger
```typescript
const { execute, loading } = useAsyncMutation(apiCall);
const handleClick = async () => {
  try {
    const result = await execute();
  } catch (err) {
    // Handle error
  }
};
```

### 3. Refetch
```typescript
const { data, execute } = useAsync(apiCall, true);
const handleRefresh = () => execute();
```

### 4. Form Submission
```typescript
const { execute: submitForm, loading } = useAsyncMutation(
  (formData) => apiCall(formData, token)
);

const handleSubmit = async (data) => {
  try {
    const result = await submitForm(data);
    Alert.alert("Success", "Data saved");
  } catch (err) {
    setError(err.message);
  }
};
```

## Type Safety

All API responses are typed. Import schemas from backend:

```typescript
// Response types
import type {
  CourseResponse,
  GradeResponse,
  UserResponse,
  QuestionResponse
} from 'your-backend-types';  // Or define locally
```

Or define locally in `types/api.ts`:

```typescript
export interface CourseResponse {
  id: number;
  code: string;
  title: string;
  lecturer_id: number;
}

export interface GradeResponse {
  id: number;
  student_id: number;
  marks_awarded: number;
  percentage: number;
  grade_letter: string;
}
```

## Environment Variables

Create `.env` or `.env.local` if needed:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

Then import in config:

```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "...";
```

## Debugging

### Network Requests
Enable logging in `services/api.ts`:

```typescript
console.log(`[API] ${method} ${endpoint}`, payload);
const response = await fetch(...);
console.log(`[API] Response:`, await response.json());
```

### Backend Logs
```bash
docker-compose logs -f auto-grader
```

### Database Queries
Enable in `database.py`:
```python
engine = create_engine(DATABASE_URL, echo=True)  # Logs all SQL
```

## Checklist for Integration

- [ ] Update `config/index.ts` with correct API_BASE_URL
- [ ] Test login with backend credentials
- [ ] Update lecturer dashboard to fetch courses from API
- [ ] Update student dashboard to fetch enrolled courses
- [ ] Update grading screen to send to backend
- [ ] Add loading indicators to all async operations
- [ ] Add error handling and user feedback
- [ ] Test on physical device (not just emulator)
- [ ] Verify token is sent in all authenticated requests
- [ ] Test role-based access (admin/lecturer/student)

## Troubleshooting

### "Network request failed"
- Check backend is running: `docker-compose logs`
- Check API_BASE_URL is correct for your device
- On Android emulator: Use `10.0.2.2` instead of `localhost`
- On physical device: Use your machine's IP address

### "Invalid authentication credentials"
- Check token is being stored in SecureStore
- Verify token format: `Bearer <token>`
- Check token hasn't expired (30 days expiry)

### "CORS error"
- Backend should have CORS enabled (it does by default)
- Check headers are correct

### API returns 404
- Verify endpoint exists in backend
- Check request parameters match backend spec
- Check user has required role/permissions

## Next Steps

1. **Start backend:** `docker-compose up --build`
2. **Update config:** Edit `config/index.ts`
3. **Test login:** Try login with backend credentials
4. **Integrate screens:** Update each screen to use new APIs
5. **Add loaders:** Add loading/error states
6. **Test on device:** Test on physical device with WiFi

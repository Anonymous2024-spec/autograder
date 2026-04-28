# AutoGrader API Quick Reference

## Backend API Endpoints

### Authentication
```
POST   /api/auth/login          Login with email/password
POST   /api/auth/signup         Register new user
GET    /api/auth/me             Get current user
POST   /api/auth/logout         Logout
GET    /api/health              Health check
```

### Admin (requires admin role)
```
GET    /api/admin/students      List all students
GET    /api/admin/students/{id} Get student details
GET    /api/admin/lecturers     List all lecturers
DELETE /api/admin/users/{id}    Delete user
```

### Lecturer (requires lecturer role)
```
POST   /api/lecturer/courses                 Create course with units
GET    /api/lecturer/courses                 List lecturer's courses
GET    /api/lecturer/courses/{id}            Get course details
POST   /api/lecturer/questions               Create question + upload PDFs
GET    /api/lecturer/questions/{unit_id}     List questions in unit
GET    /api/lecturer/grades/course/{id}      Get all course grades
```

### Student (requires student role)
```
GET    /api/student/courses                  List enrolled courses
GET    /api/student/grades                   List all grades
GET    /api/student/grades/{course_id}       List course grades
```

### Grading
```
POST   /api/grade      Grade question (multipart: question_id, student_id, answer_sheet)
GET    /api/grade/{id} Get grade record
```

## Frontend Service Layer

### authAPI
```typescript
import { authAPI } from '@/services/api';

authAPI.login(email, password)
authAPI.signup(email, password, full_name, role, student_id_number?, department?)
authAPI.getMe(token)
authAPI.logout(token)
```

### adminAPI
```typescript
import { adminAPI } from '@/services/api';

adminAPI.getAllStudents(token)
adminAPI.getStudent(studentId, token)
adminAPI.getAllLecturers(token)
adminAPI.deleteUser(userId, token)
```

### lecturerAPI
```typescript
import { lecturerAPI } from '@/services/api';

lecturerAPI.createCourse(courseData, token)
lecturerAPI.getCourses(token)
lecturerAPI.getCourse(courseId, token)
lecturerAPI.createQuestion(unitId, questionData, token)
lecturerAPI.getUnitQuestions(unitId, token)
lecturerAPI.getCourseGrades(courseId, token)
```

### studentAPI
```typescript
import { studentAPI } from '@/services/api';

studentAPI.getEnrolledCourses(token)
studentAPI.getAllGrades(token)
studentAPI.getCourseGrades(courseId, token)
```

### gradingAPI
```typescript
import { gradingAPI } from '@/services/api';

gradingAPI.gradeQuestion(questionId, studentId, answerSheet, token)
gradingAPI.getGrade(gradeId, token)
```

## Hooks

### useAsync (automatic fetching)
```typescript
import { useAsync } from '@/hooks/use-async';

const { data, loading, error, execute } = useAsync(
  () => lecturerAPI.getCourses(token),
  !!token  // Only fetch when token exists
);

// data: The API response
// loading: boolean
// error: string | null
// execute: () => Promise<void>  // Refetch
```

### useAsyncMutation (manual trigger)
```typescript
import { useAsyncMutation } from '@/hooks/use-async';

const { execute, data, loading, error } = useAsyncMutation(
  (questionId: number, sheet: any) =>
    gradingAPI.gradeQuestion(questionId, user.id, sheet, token)
);

const handleGrade = async () => {
  try {
    await execute(1, answerSheetFile);
  } catch (err) {
    console.error(err.message);
  }
};
```

## Components

### LoadingOverlay (full screen)
```typescript
import LoadingOverlay from '@/components/LoadingOverlay';

<LoadingOverlay visible={loading} message="Processing..." />
```

### LoadingIndicator (inline)
```typescript
import { LoadingIndicator } from '@/components/LoadingOverlay';

if (loading) return <LoadingIndicator size="large" />;
```

## Configuration

### API Base URL
```typescript
// config/index.ts
export const API_BASE_URL = "http://localhost:3000/api";
```

### Test Credentials
```typescript
import { TEST_CREDENTIALS } from '@/config';

TEST_CREDENTIALS.admin.email      // "admin@autograder.com"
TEST_CREDENTIALS.admin.password   // "admin123"
TEST_CREDENTIALS.lecturer.email   // "lecturer1@autograder.com"
TEST_CREDENTIALS.student.email    // "student1@autograder.com"
```

## Common Patterns

### Fetch and Display
```typescript
export function CoursesList() {
  const { token } = useAuth();
  const { data: courses, loading, error } = useAsync(
    () => lecturerAPI.getCourses(token!)
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={courses}
      renderItem={({ item }) => <CourseCard course={item} />}
    />
  );
}
```

### Submit Form
```typescript
export function CreateCourseForm() {
  const { token } = useAuth();
  const { execute, loading, error } = useAsyncMutation(
    (data) => lecturerAPI.createCourse(data, token!)
  );

  const handleSubmit = async (formData) => {
    try {
      await execute(formData);
      Alert.alert("Success", "Course created");
    } catch (err) {
      Alert.alert("Error", error);
    }
  };

  return <Form onSubmit={handleSubmit} loading={loading} />;
}
```

### Grade Student
```typescript
export function GradingScreen() {
  const { token, user } = useAuth();
  const { execute: grade, loading } = useAsyncMutation(
    (q: number, sheet: any) =>
      gradingAPI.gradeQuestion(q, user!.id, sheet, token!)
  );

  const handleGradeStudent = async () => {
    try {
      const result = await grade(questionId, answerSheetFile);
      // result: { grade: {...}, grading_result: {...} }
      displayGradingResult(result.grading_result);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Button onPress={handleGradeStudent} disabled={loading}>
      {loading ? "Grading..." : "Grade"}
    </Button>
  );
}
```

## Error Handling

All API errors return:
```json
{
  "detail": "Error message"
}
```

Catch and handle:
```typescript
try {
  const result = await apiCall();
} catch (err) {
  const message = err.message;  // "Error message"
  console.error(message);
}
```

## Request Headers

All authenticated requests include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

(Automatically added by `apiCall` helper)

## File Uploads

For uploading PDFs or images:
```typescript
const formData = new FormData();
formData.append("question_id", questionId);
formData.append("student_id", studentId);
formData.append("answer_sheet", { uri, type: "image/jpeg", name: "answer.jpg" });

// Use gradingAPI.gradeQuestion which handles this
```

## Response Format Examples

### Login Response
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "lecturer@autograder.com",
    "full_name": "Dr. John Okello",
    "role": "lecturer",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00"
  }
}
```

### Courses Response
```json
[
  {
    "id": 1,
    "code": "CS101",
    "title": "Introduction to Programming",
    "description": "Learn programming basics",
    "lecturer_id": 2,
    "created_at": "2024-01-15T10:00:00",
    "units": [
      {
        "id": 1,
        "course_id": 1,
        "title": "Variables and Data Types",
        "description": "...",
        "order": 1,
        "created_at": "2024-01-15T10:00:00"
      }
    ]
  }
]
```

### Grade Response
```json
{
  "id": 1,
  "student_id": 3,
  "question_id": 1,
  "marks_awarded": 8,
  "marks_available": 10,
  "percentage": 80.0,
  "grade_letter": "A",
  "feedback": "Good work",
  "marked_at": "2024-01-15T10:00:00",
  "grading_result": {
    "questions": [...],
    "total_marks_awarded": 8,
    "total_marks_available": 10,
    "percentage": 80.0,
    "grade": "A",
    "summary": "..."
  }
}
```

## Debug Checklist

- [ ] Backend running: `docker-compose logs auto-grader`
- [ ] API URL correct in `config/index.ts`
- [ ] Token in SecureStore: Check via React Native Debugger
- [ ] Headers correct: `Authorization: Bearer <token>`
- [ ] Response format matches expected schema
- [ ] Loading states show while fetching
- [ ] Error messages display to user
- [ ] Role-based access working (401/403 errors)

## Useful Commands

```bash
# Backend logs
docker-compose logs -f auto-grader

# Database logs
docker-compose logs -f postgres

# Reset database
docker-compose down && docker volume rm auto-grader_postgres_data && docker-compose up

# Test API
curl -X GET http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login -d '{"email":"...","password":"..."}'

# Frontend dev
yarn start
yarn ios
yarn android
yarn web
```

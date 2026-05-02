# AutoGrader - Full Stack Setup Guide

## Project Structure

```
AutoGrader/
├── /home/wat/Projects/BackendProjects/auto-grader/     # FastAPI Backend
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # SQLAlchemy setup
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── auth.py                 # JWT authentication & authorization
│   ├── seed.py                 # Database seeding
│   ├── routes/                 # API endpoint routers
│   │   ├── auth.py             # /api/auth/* endpoints
│   │   ├── admin.py            # /api/admin/* endpoints
│   │   ├── lecturer.py         # /api/lecturer/* endpoints
│   │   ├── student.py          # /api/student/* endpoints
│   │   └── grading.py          # /api/grade endpoint
│   ├── docker-compose.yml      # PostgreSQL + FastAPI containers
│   ├── requirements.txt        # Python dependencies
│   └── AGENTS.md              # Backend documentation
│
└── /home/wat/Projects/Projects Backup/Frontend Projects/AutoGrader/autograder/  # React Native Frontend
    ├── app/                    # Expo Router file-based routing
    │   ├── (auth)/login.tsx    # Login screen
    │   ├── (admin)/            # Admin dashboard & screens
    │   ├── (lecturer)/         # Lecturer dashboard & screens
    │   └── (student)/          # Student dashboard (to be implemented)
    ├── context/AuthContext.tsx # Global auth state
    ├── services/api.ts         # API client with all endpoints
    ├── hooks/use-async.ts      # Data fetching hooks
    ├── components/LoadingOverlay.tsx  # Loading UI components
    ├── config/index.ts         # Configuration & test credentials
    ├── INTEGRATION_GUIDE.md    # Frontend integration guide
    └── AGENTS.md              # Frontend documentation
```

## Backend Setup

### Prerequisites
- Docker & Docker Compose installed
- PostgreSQL running in Docker
- Python 3.8+ (if running locally)

### Quick Start with Docker

```bash
cd /home/wat/Projects/BackendProjects/auto-grader

# Build and start containers
docker-compose up --build

# Output should show:
# auto-grader  | ✅ Backend started successfully
# postgres     | database system is ready to accept connections
```

The backend will be available at `http://localhost:3000/api`

### Configuration

Edit `.env` if needed:
```env
GEMINI_API_KEY=your_google_genai_api_key_here
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/auto_grader
SECRET_KEY=your-super-secret-key-change-in-production
```

### Database Seeding

The database is seeded automatically on first startup with:

**Test Users:**
- Admin: `admin@autograder.com` / `admin123`
- Lecturer 1: `lecturer1@autograder.com` / `lecturer123`
- Lecturer 2: `lecturer2@autograder.com` / `lecturer123`
- 5 Students: `student1@autograder.com` to `student5@autograder.com` / `student123`

**Sample Data:**
- 2 Courses (CS101, MATH101)
- 4 Course Units
- 3 Questions with marking guides

To reset the database and re-seed:
```bash
# Stop containers
docker-compose down

# Remove volume
docker volume rm auto-grader_postgres_data

# Start again
docker-compose up --build
```

## Frontend Setup

### Prerequisites
- Node.js 18+
- Yarn or npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or Expo Go on physical device)

### Installation

```bash
cd "/home/wat/Projects/Projects Backup/Frontend Projects/AutoGrader/autograder"

# Install dependencies
yarn install

# Or with npm
npm install
```

### Configuration

Edit `config/index.ts` to set the correct API URL:

```typescript
// For local development with Docker
export const API_BASE_URL = "http://localhost:3000/api";

// For Android emulator
export const API_BASE_URL = "http://10.0.2.2:3000/api";

// For iOS simulator
export const API_BASE_URL = "http://127.0.0.1:3000/api";

// For physical device on same WiFi
export const API_BASE_URL = "http://192.168.1.5:3000/api";  // Replace with your IP
```

### Running the App

```bash
# Start Expo dev server
yarn start

# Or directly to a platform
yarn ios      # iOS simulator
yarn android  # Android emulator
yarn web      # Web browser

# Scan QR code with Expo Go on physical device
```

## Full Stack Testing

### 1. Start the Backend
```bash
cd /home/wat/Projects/BackendProjects/auto-grader
docker-compose up --build
# Wait for "✅ Backend started successfully"
```

### 2. Update Frontend Config
```typescript
// In config/index.ts
export const API_BASE_URL = "http://localhost:3000/api";  // Or your device IP
```

### 3. Start the Frontend
```bash
cd "/home/wat/Projects/Projects Backup/Frontend Projects/AutoGrader/autograder"
yarn start
```

### 4. Test Login
Use one of the test credentials:
- Email: `lecturer1@autograder.com`
- Password: `lecturer123`

## API Documentation

### Health Check
```bash
curl http://localhost:3000/api/health
# Response: { "status": "ok", "service": "AutoGrader" }
```

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lecturer1@autograder.com",
    "password": "lecturer123"
  }'

# Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "lecturer1@autograder.com",
    "full_name": "Dr. John Okello",
    "role": "lecturer",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00"
  }
}
```

### Fetch Courses (Lecturer)
```bash
# Get access token first
TOKEN="eyJhbGc..."

# Get courses
curl -X GET http://localhost:3000/api/lecturer/courses \
  -H "Authorization: Bearer $TOKEN"
```

### Grade a Question
```bash
# POST /api/grade with multipart form data
curl -X POST http://localhost:3000/api/grade \
  -H "Authorization: Bearer $TOKEN" \
  -F "question_id=1" \
  -F "student_id=3" \
  -F "answer_sheet=@answer_sheet.jpg"
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in docker-compose.yml
# Or kill process: lsof -i :3000
```

**Database connection error:**
```bash
# Wait for PostgreSQL to be ready
docker-compose logs postgres

# Or reset database
docker-compose down
docker volume rm auto-grader_postgres_data
docker-compose up --build
```

**Gemini API errors:**
```bash
# Check API key in .env
# Verify it's a valid Google Generative AI key
```

### Frontend Issues

**Cannot connect to backend:**
- Check backend is running: `docker-compose logs auto-grader`
- Verify API_BASE_URL in `config/index.ts`
- On Android emulator: Use `10.0.2.2` instead of `localhost`
- On physical device: Use your machine's IP address

**Login fails:**
- Check backend logs: `docker-compose logs auto-grader`
- Verify test credentials are correct
- Check database seeded: `docker-compose logs auto-grader | grep "Database seeded"`

**Loading spinner hangs:**
- Check network tab in React Native Debugger
- Verify token is being sent in Authorization header
- Check backend logs for errors

## Development Workflow

### Making Backend Changes
1. Edit file in `routes/` or other modules
2. Backend auto-reloads in Docker (`--reload` flag)
3. Test endpoint with curl or Postman
4. Commit changes: `git add . && git commit -m "..."`

### Making Frontend Changes
1. Edit `.tsx` or `.ts` files
2. Frontend auto-reloads (Expo dev client)
3. Test navigation and data flow
4. Commit changes: `git add . && git commit -m "..."`

### Adding New Endpoints
1. Create route handler in `routes/`
2. Add Pydantic schema in `schemas.py`
3. Add API client method in `services/api.ts`
4. Use in screen with `useAsync` hook
5. Add loading/error UI

### Adding New Screens
1. Create file in `app/(role)/screen.tsx`
2. Import `useAuth` and API functions
3. Use `useAsync` for data fetching
4. Add `LoadingOverlay` during loading
5. Test with all roles

## Key Files to Know

### Backend
- **main.py** - Entry point, router setup, lifespan events
- **models.py** - Database schema (entities)
- **schemas.py** - API request/response validation
- **auth.py** - JWT token, password hashing, role checking
- **routes/** - All API endpoints organized by domain

### Frontend
- **context/AuthContext.tsx** - Global auth state & login
- **services/api.ts** - All API endpoints as functions
- **hooks/use-async.ts** - Data fetching hook with loading state
- **components/LoadingOverlay.tsx** - Loading UI
- **config/index.ts** - Configuration & test credentials

## Next Steps

1. ✅ Backend is built and running
2. ✅ Frontend is connected to backend
3. Update each screen to fetch real data:
   - [ ] Admin dashboard
   - [ ] Lecturer dashboard
   - [ ] Student dashboard
   - [ ] Grading screens
4. Add error handling and edge cases
5. Test on physical devices
6. Deploy to production

## Support

For issues or questions:
1. Check AGENTS.md in backend or frontend folders
2. Check INTEGRATION_GUIDE.md in frontend
3. Review logs: `docker-compose logs`
4. Check API response format matches schema

Good luck! 🚀

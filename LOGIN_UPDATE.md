# Login System Update

## Overview
The login system has been updated to work with the new backend session-based authentication system. The frontend now properly integrates with the backend's Prisma-based user management system.

## Key Changes

### 1. Updated User Structure
- **Backend**: Uses Prisma schema with `UserRole`, `UserType`, and `CurrentJobStatus` enums
- **Frontend**: Updated types to match backend structure
- **Session-based**: Authentication now uses server-side sessions instead of JWT tokens

### 2. New User Roles
The system now supports the following user roles (from `UserRole` enum):
- `VISITOR` - Basic access, limited features
- `JOBSEEKER` - Job seekers looking for opportunities
- `MANNING_AGENCY` - Maritime agencies
- `SUPERADMIN` - System administrators
- `EXHIBITOR` - Business exhibitors
- `SPONSOR` - Event sponsors

### 3. Role-Based Routing
After successful login, users are redirected based on their role:
- `SUPERADMIN` → `/admin`
- `EXHIBITOR` or `SPONSOR` → `/owner`
- `JOBSEEKER` or `MANNING_AGENCY` → `/dashboard`
- `VISITOR` → `/dashboard` (with limited access)

## Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3200
NEXT_PUBLIC_USE_DUMMY_DATA=false
```

### Backend Setup
Ensure the backend is running on port 3200 with the following:
- PostgreSQL database with Prisma schema
- Session middleware configured
- CORS enabled for frontend origin

## Usage

### Basic Login
```typescript
import { login } from '@/service/authservice';

const result = await login(email, password);
if (result.user) {
  // User is authenticated
  console.log('User role:', result.user.role);
}
```

### Authentication Context
```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, loading, logoutUser } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Route Protection
```typescript
import { AdminGuard, OwnerGuard, AuthenticatedGuard } from '@/service/authMiddleware';

// Protect admin routes
<AdminGuard>
  <AdminDashboard />
</AdminGuard>

// Protect owner routes
<OwnerGuard>
  <OwnerDashboard />
</OwnerGuard>

// Protect any authenticated route
<AuthenticatedGuard>
  <UserDashboard />
</AuthenticatedGuard>
```

## Testing

### Backend Testing
Run the backend test suite:
```bash
cd portal-backend
node test-api.js
```

### Frontend Testing
The frontend includes dummy data for testing. Set `NEXT_PUBLIC_USE_DUMMY_DATA=true` to use dummy authentication.

### Test Users (Backend Seed Data)
These are the actual test users from the backend seed file:

#### SuperAdmin
- **Email**: `superadmin@maritime.com`
- **Password**: `test123`
- **Role**: `SUPERADMIN`
- **Redirects to**: `/admin`

#### Manning Agencies
- **Email**: `info@globalcrews.com`
- **Password**: `test123`
- **Role**: `MANNING_AGENCY`
- **Redirects to**: `/dashboard`

- **Email**: `hr@maritimepersonnel.com`
- **Password**: `test123`
- **Role**: `MANNING_AGENCY`
- **Redirects to**: `/dashboard`

#### Job Seekers
- **Email**: `captain.anderson@email.com`
- **Password**: `test123`
- **Role**: `JOBSEEKER`
- **Redirects to**: `/dashboard`

- **Email**: `engineer.sarah@email.com`
- **Password**: `test123`
- **Role**: `JOBSEEKER`
- **Redirects to**: `/dashboard`

#### Exhibitor
- **Email**: `contact@marinetech.com`
- **Password**: `test123`
- **Role**: `EXHIBITOR`
- **Redirects to**: `/owner`

#### Sponsor
- **Email**: `partnerships@oceanfreight.com`
- **Password**: `test123`
- **Role**: `SPONSOR`
- **Redirects to**: `/owner`

## Security Features

1. **Session-based Authentication**: Secure server-side sessions
2. **Role-based Access Control**: Granular permissions based on user roles
3. **CORS Protection**: Properly configured for frontend-backend communication
4. **Password Hashing**: Backend uses bcrypt for password security
5. **Account Status**: Support for active/inactive account status

## Migration Notes

### From JWT to Sessions
- Removed JWT token handling
- Added session cookie management
- Updated authentication checks to use session validation

### Type Updates
- Updated `User` interface to match Prisma schema
- Added `SessionUser` interface for backend responses
- Updated enums to match backend definitions

### Component Updates
- Login component now handles new user structure
- Added loading states and error handling
- Integrated with auth context for state management

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend origin
2. **Session Not Persisting**: Check cookie settings and domain configuration
3. **Role-based Access Denied**: Verify user has correct role in database
4. **Login Fails**: Check backend logs for authentication errors

### Debug Mode
Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will log authentication attempts and session checks to the console. 
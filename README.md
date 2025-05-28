# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        "react-x": reactX,
        "react-dom": reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs["recommended-typescript"].rules,
        ...reactDom.configs.recommended.rules,
    },
});
```

# Anscer Fleet Management System

A modern React application with TypeScript and Vite for fleet management, featuring a robust authentication system integrated with a Hono backend.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with your Hono backend
- **Protected Routes**: Role-based access control
- **Real-time API Integration**: Connected to backend user management
- **Modern UI**: Built with shadcn/ui components
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Setup

### Prerequisites

- Node.js (v18 or higher)
- Your Hono backend server running
- Database with user accounts

### Installation

1. **Clone and install dependencies:**

    ```bash
    npm install
    ```

2. **Configure environment variables:**
   Create a `.env.local` file:

    ```env
    VITE_API_BASE_URL=http://localhost:5005/api
    ```

3. **Start the development server:**

    ```bash
    npm run dev
    ```

4. **Access the application:**
   Open [http://localhost:3001](http://localhost:3001)

## 🔐 Authentication

The authentication system connects to your Hono backend:

### Login

- Navigate to `/login`
- Enter your email and password
- System validates against your backend `/users/auth` endpoint
- JWT token is stored securely
- User data is persisted in localStorage

### Protected Routes

- All routes except `/login` require authentication
- Role-based access control is available
- Automatic redirect to login if not authenticated

### API Integration

- All API calls include JWT token automatically
- Handles token expiration gracefully
- Comprehensive error handling

## 📋 Usage Examples

### Test Authentication

1. Ensure your backend server is running
2. Create a test user in your database
3. Try logging in with those credentials
4. Explore the AuthExample component at `/auth-example`

### Adding Protected Routes

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

function MyPage() {
    return (
        <ProtectedRoute>
            <YourComponent />
        </ProtectedRoute>
    );
}
```

### Role-Based Protection

```tsx
import { RoleProtectedRoute } from "@/components/ProtectedRoute";

function AdminPage() {
    return (
        <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminComponent />
        </RoleProtectedRoute>
    );
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthExample.tsx      # Authentication demo
│   ├── Login.tsx           # Login form
│   ├── ProtectedRoute.tsx  # Route protection
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── useAuth.ts          # Authentication hook
├── services/
│   ├── api.ts              # API configuration
│   ├── auth.ts             # Authentication API
│   └── users.ts            # User management API
└── routes/                 # TanStack Router routes
```

## 🔧 Backend Requirements

Your Hono backend should provide these endpoints:

- `POST /api/users/auth` - User authentication
- `GET /api/users` - Get users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `POST /api/users` - Create user (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

## 📚 Documentation

- [Complete Authentication Guide](./docs/authentication-guide.md)
- [API Integration Examples](./src/components/AuthExample.tsx)
- [Component Documentation](./src/components/ui/)

## 🚨 Important Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure your backend to allow requests from your frontend domain
4. **Token Security**: JWT tokens are stored in localStorage (consider httpOnly cookies for production)

## 🧪 Testing

Visit these routes to test functionality:

- `/login` - Authentication flow
- `/auth-example` - See authentication in action
- `/configure/user` - User management (requires login)

## 🔍 Troubleshooting

**Common Issues:**

- **Network Error**: Check if backend server is running
- **CORS Error**: Configure backend CORS settings
- **Login Failed**: Verify user credentials in database
- **401 Errors**: Check JWT token validity

**Debug Steps:**

1. Check browser Network tab for API calls
2. Verify backend server logs
3. Check console for error messages
4. Confirm environment variables are loaded

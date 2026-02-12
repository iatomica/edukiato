# Authentication API Documentation

Base URL: `http://localhost:3000/api`

## 1. Login
Authenticates a user and returns a JWT token.

*   **Endpoint:** `POST /auth/login`
*   **Access:** Public
*   **Body:**
    ```json
    {
      "email": "admin@artis.edu",
      "password": "password"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "a0eebc99...",
        "email": "admin@artis.edu",
        "full_name": "Alex Rivera",
        "role": "ADMIN",
        "avatar": "..."
      }
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    {
      "statusCode": 401,
      "message": "Incorrect email or password.",
      "error": "Unauthorized"
    }
    ```

## 2. Get Profile (Me)
Retrieves the currently authenticated user's profile.

*   **Endpoint:** `GET /auth/me`
*   **Access:** Private (Requires Bearer Token)
*   **Headers:** `Authorization: Bearer <access_token>`
*   **Success Response (200 OK):**
    ```json
    {
      "userId": "a0eebc99...",
      "email": "admin@artis.edu",
      "role": "ADMIN"
    }
    ```

## 3. Register User
Creates a new user (Teacher or Student).

*   **Endpoint:** `POST /auth/register`
*   **Access:** Private (ADMIN only)
*   **Body:**
    ```json
    {
      "email": "newuser@artis.edu",
      "password": "securepassword",
      "full_name": "Jane Doe",
      "role": "TEACHER"
    }
    ```

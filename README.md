# Express Socket.io MongoDB Application

This project is a real-time web application built with Express.js, Socket.io, MongoDB, and TypeScript. It supports encrypted JWT authentication, wallet management, messaging, and call history features.

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone [<repository-url>](https://github.com/patrickowor/MyWallet.git)
   cd MyWallet
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.

4. **Start the server:**
   ```sh
   npm start
   ```
   The server will run on the port specified in your `.env` file (default: 3000).

## API Endpoints

All endpoints are prefixed with `/api/`. Import [`api_documentation_file.yaml`](api_documentation_file.yaml) into Postman or Insomnia for ready-to-use requests.

### **Auth**
- `POST /api/signup`  
  Create a new user account.
- `POST /api/login`  
  Login with email or phone number. Returns an **encrypted JWT** token.
- `GET /api/profile`  
  Get user profile (requires Bearer token).
- `PUT /api/profile`  
  Update user profile (requires Bearer token).

### **Wallet**
- `POST /api/wallet/create`  
  Initiate wallet creation (requires Bearer token).
- `PATCH /api/wallet/create`  
  Validate OTP for wallet creation (requires Bearer token).
- `GET /api/wallet/balance`  
  Get wallet balance/info (requires Bearer token).

### **Messaging & Calls**
- `GET /api/chat/history/:phone_number/`  
  Get chat history with a user (requires Bearer token).
- `GET /api/call/history`  
  Get call history (requires Bearer token).
- `POST /api/call/start`  
  Start a call with a user (requires Bearer token).
- `POST /api/call/end`  
  End an ongoing call (requires Bearer token).

## JWT Authentication

- **Note:** JWT tokens are encrypted before being sent to clients.  
- Always use the encrypted token as the Bearer token for API requests and as the `auth.token` for socket connections.

## WebSocket Testing

To test real-time messaging via Socket.io:

1. Run the socket test script in two terminals:
   ```sh
   npm run test-socket
   ```
2. Use two different user account tokens (from login) as credentials.
3. Follow the prompts to send and receive messages.

## API Testing

- Import [`api_documentation_file.yaml`](api_documentation_file.yaml) into Postman or Insomnia.
- Use the provided endpoints and sample requests to test all features.

## Assumptions Made

- Users are uniquely identified by email and phone number.
- JWT tokens are encrypted using AES before being sent to clients.
- Wallet creation and OTP validation are mocked unless live OnePipe credentials are provided.
- All endpoints require authentication except signup and login.
- Phone numbers must be in international format (e.g., `+234...`).

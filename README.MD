# QuickDelivery

## Project Description
QuickDelivery is a full-stack delivery management system designed to streamline the process of placing, tracking, and managing deliveries. The application features user authentication, delivery tracking, OTP verification for secure operations, and an intuitive dashboard for users to manage their deliveries efficiently.

## Features
- User registration and login with authentication
- OTP (One-Time Password) verification for secure actions
- Place new delivery requests with detailed information
- View and manage deliveries through a user-friendly dashboard
- Real-time delivery status updates
- Feedback prompt for delivery experience
- Responsive and modern UI built with React
- Stripe payment integration for secure payment processing
- LocationIQ API integration for delivery and pickup location suggestions with longitude and latitude support

## Technologies Used
### Frontend
- React with JSX
- Vite as the build tool
- CSS for styling
- Various React components for modular UI
- Stripe.js and @stripe/react-stripe-js for payment processing
- LocationIQ API for geocoding and location suggestions

### Backend
- Node.js with Express framework
- MongoDB for database management
- RESTful API design
- JWT-based authentication
- OTP generation and verification
- Cloudinary integration for media management
- Stripe API for payment intent creation and management

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB instance running (local or cloud)
- Stripe account with publishable and secret keys
- LocationIQ API key

### Setup Frontend
```bash
cd client
npm install
npm run dev
```

### Setup Backend
```bash
cd server
npm install
npm start
```

## Usage
- Access the frontend at `http://localhost:3000` (or the port specified by Vite)
- Register a new user or login with existing credentials
- Use the dashboard to place and track deliveries
- OTP verification will be prompted for sensitive actions
- Provide feedback on deliveries through the feedback prompt
- Make payments securely via Stripe integration
- Use location suggestions powered by LocationIQ API when entering delivery and pickup locations

## Folder Structure
```
/client          # React frontend source code
  /public       # Static assets
  /src
    /components # Reusable React components
    /pages      # Application pages (dashboard, profile, auth, delivery)
    /stores     # State management stores
/server          # Node.js backend source code
  /controllers  # Route controllers handling business logic
  /models       # Mongoose models for database schemas
  /routes       # Express route definitions
  /middlewares  # Express middlewares (e.g., authentication)
  /utils        # Utility functions (e.g., cost calculation, cloudinary)
  /DB           # Database connection setup

# GoForMe - Hyperlocal On-Demand Task Platform

GoForMe is a mobile platform that connects individuals needing help with daily errands ("Requesters") to vetted local community members ("Helpers") who can complete those tasks for a fee.

## 🎯 Project Overview

### Vision
To build a world where no one feels isolated by daily challenges, making assistance accessible, reliable, and just a tap away.

### Mission
To empower individuals by providing a safe and efficient platform for requesting and fulfilling everyday tasks. We support the elderly, persons with disabilities, busy families, and those in isolation, while creating meaningful micro-earning opportunities for students, freelancers, and the unemployed.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- React Native development environment set up
- iOS Simulator (for Mac) or Android Emulator
- Git

### Project Structure

```
/workspace/
├── E-Hub/                      # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utility functions
│   ├── uploads/              # File uploads directory
│   ├── .env.example          # Environment variables example
│   ├── index.js              # Main server file
│   └── package.json
│
└── GoForMeMobile/            # Mobile App (React Native)
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── screens/         # App screens
    │   ├── navigation/      # Navigation configuration
    │   ├── services/        # API services
    │   ├── hooks/           # Custom hooks
    │   ├── store/           # State management
    │   ├── types/           # TypeScript definitions
    │   ├── constants/       # App constants
    │   └── assets/          # Images, fonts, etc.
    ├── ios/                 # iOS specific files
    ├── android/             # Android specific files
    └── package.json
```

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd E-Hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - API keys for services (Twilio, Google Maps, etc.)

5. Start MongoDB:
   ```bash
   mongod
   ```

6. Run the backend server:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile app directory:
   ```bash
   cd GoForMeMobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS pods (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```

4. Start Metro bundler:
   ```bash
   npx react-native start
   ```

5. Run the app:
   - For iOS:
     ```bash
     npx react-native run-ios
     ```
   - For Android:
     ```bash
     npx react-native run-android
     ```

## 📱 Features

### For Requesters
- **Easy Task Creation**: Post tasks by category (Shopping, Pharmacy, Pickup/Delivery)
- **Real-time Tracking**: Track your Helper's location in real-time
- **Secure Communication**: In-app chat with voice notes and photo sharing
- **Flexible Payment**: Pay via cash or digital methods
- **Rating System**: Rate and review Helpers

### For Helpers
- **Nearby Tasks**: View and accept tasks in your area
- **Flexible Schedule**: Work when you want
- **Earnings Dashboard**: Track your earnings
- **Verification Badge**: Build trust with ID verification
- **Vehicle Options**: Specify your mode of transportation

### Accessibility Features
- **High Contrast Mode**: For better visibility
- **Large Fonts**: Adjustable text sizes
- **Voice Commands**: Core functions accessible via voice
- **Screen Reader Support**: Full accessibility compliance

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS protection
- Helmet.js for security headers

## 🔧 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to existing account
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/verify-phone` - Verify phone number with OTP

### Task Endpoints (Coming Soon)

- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get user's tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id/accept` - Accept a task
- `PUT /api/tasks/:id/status` - Update task status

## 🧪 Testing

### Backend Testing
```bash
cd E-Hub
npm test
```

### Mobile App Testing
```bash
cd GoForMeMobile
npm test
```

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Google Cloud Platform

### Mobile App Deployment
- **iOS**: Deploy through App Store Connect
- **Android**: Deploy through Google Play Console

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Backend Development
- Mobile App Development
- UI/UX Design
- Quality Assurance

## 📞 Support

For support, email support@goforme.com or join our Slack channel.

## 🔮 Future Roadmap

- [ ] Volunteer Mode for free community help
- [ ] Video calling for complex task clarification
- [ ] B2B integration for businesses
- [ ] Advanced gamification features
- [ ] Multi-language support
- [ ] International expansion

## 🙏 Acknowledgments

- React Native community
- Node.js and Express.js teams
- All open-source contributors

---

**Note**: This is a development version. Make sure to update all API keys and secrets before deploying to production.
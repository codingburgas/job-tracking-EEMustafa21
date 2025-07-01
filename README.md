# JobPortal - Full Stack Application

A modern, professional job portal application built with Angular frontend and C# ASP.NET Core backend with SQLite database. Features a beautiful, responsive design with glassmorphism effects and smooth animations.

## 🚀 Features

### 👤 User Features
- **User Registration & Authentication** - Secure JWT-based authentication
- **Browse Job Listings** - View all active job postings with detailed descriptions
- **Job Applications** - Apply for jobs with one-click application system
- **Application Tracking** - Monitor application status and history
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🔧 Admin Features
- **Admin Dashboard** - Comprehensive overview with statistics and analytics
- **Job Management** - Create, edit, delete, and manage job postings
- **Application Management** - Review and update application statuses
- **User Management** - View and manage user accounts
- **Real-time Updates** - Live status updates and notifications

### 🎨 Design Features
- **Modern UI/UX** - Apple-level design aesthetics with attention to detail
- **Glassmorphism Effects** - Beautiful translucent cards with backdrop blur
- **Smooth Animations** - Micro-interactions and hover effects
- **Dark/Light Themes** - Professional color schemes
- **Responsive Layout** - Mobile-first design approach

## 🏗️ Architecture

```
JobPortal/
├── 📁 API/                          # C# Backend (ASP.NET Core 8)
│   ├── 📁 Controllers/              # API Controllers
│   ├── 📁 Services/                 # Business Logic Layer
│   ├── 📁 Models/                   # Entity Models
│   ├── 📁 DTOs/                     # Data Transfer Objects
│   ├── 📁 Data/                     # Database Context
│   └── 📄 Program.cs                # Application Entry Point
├── 📁 WEB/                          # Angular Frontend Host
│   └── 📁 ClientApp/                # Angular 18 Application
│       ├── 📁 src/
│       │   ├── 📁 app/
│       │   │   ├── 📁 core/         # Core Services & Guards
│       │   │   ├── 📁 features/     # Feature Modules
│       │   │   └── 📁 shared/       # Shared Components
│       │   └── 📁 environments/     # Environment Configuration
│       └── 📄 package.json
└── 📄 JobPortal.sln                 # Visual Studio Solution
```

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 8
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **Security**: BCrypt password hashing
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture with DI

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Modern CSS with Custom Properties
- **State Management**: RxJS Observables
- **HTTP Client**: Angular HTTP with Interceptors
- **Routing**: Angular Router with Guards

### Development Tools
- **IDE**: JetBrains Rider / Visual Studio
- **Package Manager**: npm
- **Build Tool**: Angular CLI
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **JetBrains Rider** or **Visual Studio** - [Download Rider](https://www.jetbrains.com/rider/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobPortal
   ```

2. **Open in JetBrains Rider**
   ```bash
   # Open the solution file
   rider JobPortal.sln
   ```

3. **Start the Backend API**
   ```bash
   cd API
   dotnet restore
   dotnet run
   ```
   The API will be available at `https://localhost:7001`

4. **Start the Frontend Application**
   ```bash
   cd WEB/ClientApp
   npm install
   npm start
   ```
   The Angular app will be available at `http://localhost:4200`

### 🎯 Quick Start
The application includes sample data and a default admin account:
- **Admin Username**: `admin`
- **Admin Password**: `admin`

## 📊 Database Schema

The application uses SQLite with the following entities:

### Users Table
- `Id` (Primary Key)
- `FirstName`, `MiddleName`, `LastName`
- `Username` (Unique)
- `PasswordHash`
- `Role` (USER/ADMIN)
- `CreatedAt`

### Jobs Table
- `Id` (Primary Key)
- `Title`, `CompanyName`
- `Description`
- `DatePosted`
- `IsActive`

### Applications Table
- `Id` (Primary Key)
- `UserId` (Foreign Key)
- `JobId` (Foreign Key)
- `Status` (Submitted/Selected for Interview/Rejected)
- `AppliedAt`

## 🔌 API Endpoints

### Authentication
```http
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
```

### Jobs
```http
GET    /api/jobs              # Get all jobs (with optional activeOnly filter)
GET    /api/jobs/{id}         # Get job by ID
POST   /api/jobs              # Create job (Admin only)
PUT    /api/jobs/{id}         # Update job (Admin only)
DELETE /api/jobs/{id}         # Delete job (Admin only)
```

### Applications
```http
POST /api/applications/apply/{jobId}        # Apply for job
GET  /api/applications/my-applications      # Get user's applications
GET  /api/applications/check/{jobId}        # Check if user applied
GET  /api/applications/all                  # Get all applications (Admin only)
PUT  /api/applications/{id}/status          # Update application status (Admin only)
```

## 🔒 Security Features

- **JWT Token Authentication** - Secure stateless authentication
- **Password Hashing** - BCrypt with salt for password security
- **Role-based Authorization** - User and Admin role separation
- **CORS Configuration** - Secure cross-origin resource sharing
- **Input Validation** - Server-side validation with data annotations
- **Route Guards** - Frontend route protection

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Gray Scale**: 50-900 variants

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Line Heights**: 150% for body, 120% for headings

### Components
- **Glassmorphism Cards** - Translucent backgrounds with backdrop blur
- **Modern Buttons** - Gradient backgrounds with hover animations
- **Form Controls** - Clean inputs with focus states
- **Navigation** - Sticky header with smooth transitions

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Backend tests
cd API
dotnet test

# Frontend tests
cd WEB/ClientApp
npm test
```

## 📦 Deployment

### Backend Deployment
```bash
cd API
dotnet publish -c Release -o ./publish
```

### Frontend Deployment
```bash
cd WEB/ClientApp
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Microsoft for .NET and Entity Framework
- Inter font family by Rasmus Andersson
- Pexels for stock photography
- The open-source community

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/jobportal/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainers

---

<div align="center">
  <strong>Built with ❤️ using Angular & .NET</strong>
</div>

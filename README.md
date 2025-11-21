# 🔧 ServiceFinder

> A modern, full-stack service marketplace application where users can discover local service providers and service providers can advertise their businesses.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Component Documentation](#component-documentation)
- [Firebase Services](#firebase-services)
- [Custom Hooks](#custom-hooks)
- [Utilities](#utilities)
- [Security Rules](#security-rules)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)


---

## 🎯 Overview

**ServiceFinder** is a React-based web application that connects service providers with customers. The platform allows:

- **Users (Guests)**: Browse and search for local services
- **Authenticated Users**: Contact service providers, rate services, and post their own service listings
- **Service Providers**: Create and manage their service profiles with images, descriptions, and contact information

Built with modern web technologies including React, Firebase, and Tailwind CSS, ServiceFinder provides a fast, responsive, and user-friendly experience across all devices.

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** via Firebase Auth
- Secure user registration and login
- Password reset functionality
- Protected routes and actions
- Persistent authentication state
- User profile management

### 🏪 Service Management
- **Browse Services**: View all available services without authentication
- **Search & Filter**: Real-time search by name, category, city, or description
- **Category Filtering**: Filter services by industry (Plumbing, Electrical, etc.)
- **Add Services**: Authenticated users can post their services
- **Image Upload**: Upload service images to Firebase Storage
- **Service Details**: View comprehensive service information including:
  - Service name and description
  - Category and location
  - Contact information (phone & email)
  - Service rating
  - Service provider details

### ⭐ Rating System
- Rate services from 1-5 stars
- Visual star rating display
- Only authenticated users can rate
- Real-time rating updates

### 🎨 User Interface
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Grid/List Views**: Toggle between different service display modes
- **Dark/Light Mode Ready**: Clean, modern UI with Tailwind CSS
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

### 🔍 Search & Discovery
- Real-time search across all service fields
- Category-based filtering
- City-based filtering
- Sort by: Newest, Rating (High/Low), Name (A-Z)
- Service count display

### 📱 Mobile-First Design
- Collapsible sidebar navigation
- Touch-friendly interface
- Responsive image handling
- Mobile-optimized forms

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI Library
- **Vite 5.0.8** - Build Tool & Dev Server
- **Tailwind CSS 3.3.6** - Utility-First CSS Framework
- **Lucide React 0.294.0** - Icon Library
- **React Router DOM 6.20.0** - Routing (optional)

### Backend & Services
- **Firebase 10.7.1**
  - **Authentication** - User management
  - **Firestore** - NoSQL database
  - **Storage** - Image hosting
  - **Analytics** - Usage tracking

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
servicefinder/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Top navigation bar
│   │   │   └── Sidebar.jsx          # Category sidebar
│   │   ├── services/
│   │   │   ├── ServiceCard.jsx      # Service display card
│   │   │   ├── ServiceList.jsx      # Service grid/list view
│   │   │   ├── AddServiceModal.jsx  # Add service form
│   │   │   └── RateServiceModal.jsx # Rating modal
│   │   ├── Auth/
│   │   │   ├── AuthProvider.jsx     # Auth context provider
│   │   │   ├── AuthModal.jsx        # Auth modal wrapper
│   │   │   ├── SignInForm.jsx       # Sign in form
│   │   │   └── SignUpForm.jsx       # Sign up form
│   │   └── common/
│   │       ├── SearchBar.jsx        # Search input component
│   │       ├── CategoryFilter.jsx   # Category filter buttons
│   │       └── LoadingSpinner.jsx   # Loading indicator
│   ├── firebase/
│   │   ├── firebaseConfig.js        # Firebase initialization
│   │   └── firebaseServices.js      # Firebase service functions
│   ├── hooks/
│   │   └── useServices.js           # Custom hooks for services
│   ├── utils/
│   │   ├── validators.js            # Input validation functions
│   │   └── helpers.js               # Utility functions
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # App entry point
│   └── index.css                     # Global styles
├── .env                               # Environment variables (not committed)
├── .gitignore                         # Git ignore rules
├── index.html                         # HTML entry point
├── package.json                       # Dependencies & scripts
├── postcss.config.js                  # PostCSS configuration
├── tailwind.config.js                 # Tailwind configuration
├── vite.config.js                     # Vite configuration
└── README.md                          # This file
```

---

## 📋 Prerequisites


- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **Git** (for version control)
- **Firebase Account** (free tier works)
- **Code Editor** (VS Code recommended)


---

## 🏃 Running the Application

### Development URL


Access at: `https://bogusservices.netlify.app`

---

## 📖 Usage Guide

### For Users (Non-Authenticated)

1. **Browse Services**
   - View all available services on the homepage
   - Scroll through service cards

2. **Search Services**
   - Use the search bar to find specific services
   - Search by name, category, city, or description

3. **Filter by Category**
   - Click sidebar categories to filter services
   - Available categories: Plumbing, Electrical, Carpentry, etc.

4. **View Service Details**
   - Each card shows:
     - Service name & description
     - Location and rating
     - Contact information
     - Service category

### For Authenticated Users

1. **Sign Up / Sign In**
   - Click "Sign In" button in header
   - Choose "Create Account" or "Sign In"
   - Fill in required information

2. **Add Your Service**
   - Click "Add Service" in sidebar
   - Fill in service details:
     - Service name
     - Category
     - Description
     - Phone & email
     - City
   - Upload service image (optional)
   - Click "Add Service"

3. **Contact Service Providers**
   - Click "Contact" on any service card
   - View phone number and email
   - Reach out directly

4. **Rate Services**
   - Click the star icon on service cards
   - Select rating from 1-5 stars
   - Submit your rating

5. **Manage Account**
   - Click user icon in header
   - Logout when needed

---

## 🧩 Component Documentation

### Layout Components

#### `Header.jsx`
- Top navigation bar
- User authentication status
- Menu toggle for mobile
- Logout functionality

**Props:**
- `onMenuToggle`: Function to toggle sidebar
- `onAuthClick`: Function to open auth modal

#### `Sidebar.jsx`
- Category filtering
- "Add Service" button
- Mobile-responsive drawer

**Props:**
- `isOpen`: Boolean for mobile visibility
- `onClose`: Function to close sidebar
- `onAddService`: Function to open add service modal
- `currentUser`: Current user object
- `selectedCategory`: Active category
- `onFilterChange`: Function to change category

### Service Components

#### `ServiceCard.jsx`
- Displays individual service
- Shows rating, location, contact info
- Contact and rate buttons

**Props:**
- `service`: Service object
- `onContact`: Contact handler
- `onRate`: Rating handler
- `currentUser`: Current user object

#### `ServiceList.jsx`
- Grid/list view toggle
- Service sorting
- Empty state handling

**Props:**
- `services`: Array of services
- `loading`: Loading state
- `onContact`: Contact handler
- `onRate`: Rating handler

#### `AddServiceModal.jsx`
- Form to add new service
- Image upload functionality
- Form validation

**Props:**
- `isOpen`: Boolean to show/hide modal
- `onClose`: Function to close modal
- `onServiceAdded`: Callback after adding service

#### `RateServiceModal.jsx`
- Star rating interface
- Submit rating to Firebase

**Props:**
- `isOpen`: Boolean to show/hide modal
- `onClose`: Function to close modal
- `service`: Service to rate
- `onRated`: Callback after rating

### Auth Components

#### `AuthProvider.jsx`
- Context provider for authentication
- Manages user state
- Provides auth methods

**Exports:**
- `useAuth()`: Hook to access auth context

#### `AuthModal.jsx`
- Modal wrapper for auth forms
- Switches between sign in/up

**Props:**
- `isOpen`: Boolean to show/hide modal
- `onClose`: Function to close modal

#### `SignInForm.jsx`
- Email/password sign in form
- Form validation
- Error handling

**Props:**
- `onSuccess`: Callback after successful sign in
- `onSwitchToSignUp`: Switch to sign up form
- `onForgotPassword`: Forgot password handler

#### `SignUpForm.jsx`
- User registration form
- Password strength indicator
- Form validation

**Props:**
- `onSuccess`: Callback after successful sign up
- `onSwitchToSignIn`: Switch to sign in form



---

## 🔒 Security Rules

### Important Security Considerations

1. **Authentication Required**
   - Users must be signed in to add services
   - Users must be signed in to contact providers
   - Users must be signed in to rate services

2. **Data Validation**
   - All inputs are validated client-side
   - Firebase rules provide server-side validation
   - Image uploads limited to 5MB
   - Only image files accepted

3. **User Privacy**
   - Users can only edit their own services
   - Email addresses are visible (by design)
   - No sensitive data stored

4. **Rate Limiting**
   - Implement rate limiting on production
   - Consider adding CAPTCHA for sign up

---


---

#### No Image Uploading
- Need Funding for proper server

---

## 🤝 Contributing

I welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add YourFeature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use functional components with hooks
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR

---

## 👥 Author

- **Bogus** - [MyGitHub](https://github.com/BogusDrac)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for backend infrastructure
- Tailwind CSS for styling system
- Lucide for beautiful icons
- The open source community


---

## 🗺️ Roadmap

### Planned Features

- [ ] Advanced search with filters
- [ ] Service booking system
- [ ] Payment integration
- [ ] Review system (not just ratings)
- [ ] Service provider dashboard
- [ ] Email notifications
- [ ] Social media integration
- [ ] Service categories management
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Mobile app (React Native)

---

## 📊 Project Stats

- **Lines of Code:** ~3,000+
- **Components:** 15+
- **Custom Hooks:** 10+
- **Utility Functions:** 20+
- **Firebase Collections:** 2 (services, users)

---

Made with ❤️ by Bogus :)

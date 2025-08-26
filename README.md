# Personal Task Management Application

## Project Description
Full-stack web application for personal task management that allows any user to register, authenticate, and manage their tasks (create, edit, delete) in a simple, secure way from any device.

## Sprint Scope

### Sprint 1: Task Creation, Registration and Login
- ✅ Registration, login, logout and password recovery
- ✅ Create and list tasks (title, detail, date/time, status)
- ✅ Frontend on Vercel with initial menu, 3 usability heuristics
- ✅ Backend on Render (GET/POST)
- ✅ MongoDB database (users + tasks)
- ✅ Video + user testing report

### Sprint 2: User and Task Editing
- ⏳ Editable user profile
- ⏳ Task editing
- ⏳ Frontend with menu + 'About us', 6 heuristics
- ⏳ Backend with PUT
- ⏳ Database with editing capabilities
- ⏳ Videos + reports S1 and S2

### Sprint 3: Complete User and Task Management
- ⏳ Account and task deletion
- ⏳ Footer with site map
- ⏳ Frontend with 10 heuristics and footer
- ⏳ Backend with DELETE
- ⏳ Database with deletion capabilities
- ⏳ Videos + reports S1-S3

## Technical Requirements

### Frontend
- **Framework**: Vite.js
- **Technologies**: HTML5, CSS3, Pure JavaScript
- **API**: Backend consumption via Fetch API (GET, POST, PUT, DELETE by sprint)
- **Design**: Responsive design
- **Standards**: Environment variables, code in English, clean style, JSDoc

### Backend
- **Runtime**: Node.js + Express (JavaScript)
- **Deployment**: Render
- **Standards**: Environment variables, clean style, JSDoc

### Database
- **Service**: MongoDB Atlas
- **Collections**: 
  - `users` - User information
  - `tasks` - User tasks

### DevOps & Management
- **Planning**: Taiga (sprint planning and closure)
- **Version Control**: GitHub + Git Workflow
  - Branch per team member
  - Small commits
  - Pull requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd pi-miniproject-1

# Install dependencies (when available)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
# Start development server
npm run dev

# Start backend server
npm run server
```

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📁 Project Structure
```
pi-miniproject-1/
├── frontend/           # Vite.js frontend application
├── backend/            # Node.js + Express backend
├── docs/              # Documentation and reports
├── .env.example       # Environment variables template
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## 🤝 Contributing
1. Create a feature branch from main
2. Make small, focused commits
3. Create a pull request for review
4. Follow code style guidelines (JSDoc, clean code)

## 📝 License
This project is for educational purposes as part of university coursework.

## 👥 Team
- Project development as part of Proyecto Integrador 1
- University course: Proyecto Integrador 1

---

**Status**: 🚧 In Development - Sprint 1

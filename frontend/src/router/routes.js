import NotFound from '../pages/NotFound'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import TasksList from '../pages/tasks/List'
import TaskCreate from '../pages/tasks/CreateEdit'
import Profile from '../pages/Profile'
import ProfileEdit from '../pages/ProfileEdit'
import About from '../pages/About'
import Welcome from '../pages/Welcome'   // 👈 nuevo import

export default [
  { path: '/', component: Welcome, auth: false }, // 👈 nueva ruta de bienvenida
  { path: '/login', component: Login, auth: false },
  { path: '/signup', component: Signup, auth: false },
  { path: '/forgot-password', component: ForgotPassword, auth: false },
  { path: '/reset-password', component: ResetPassword, auth: false },
  { path: '/reset', component: ResetPassword, auth: false },
  { path: '/tasks', component: TasksList, auth: true },
  { path: '/tasks/new', component: TaskCreate, auth: true },
  { path: '/profile', component: Profile, auth: true },
  { path: '/profile/edit', component: ProfileEdit, auth: true },
  { path: '/about', component: About, auth: true },
  { path: '*', component: NotFound, auth: false },
]

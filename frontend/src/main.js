console.log('main.js cargado');

import { Login } from './pages/Login.js';
import './style.css';

console.log('Importaciones completadas');

const app = document.getElementById('app');
console.log('Elemento app:', app);

if (app) {
  app.innerHTML = '';
  const loginComponent = Login();
  console.log('Componente login creado:', loginComponent);
  app.appendChild(loginComponent);
  console.log('Componente agregado al DOM');
} else {
  console.error('No se encontró el elemento con id "app"');
}
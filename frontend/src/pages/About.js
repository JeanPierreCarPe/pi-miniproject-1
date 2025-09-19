/**
 * About page component - Information about the TaskFlow application
 * @returns {HTMLElement} The about page element
 */
export default function About() {
  const div = document.createElement('div')
  div.className = 'container'
  
  div.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Sobre TaskFlow</h1>
        <p>Conoce más sobre nuestra aplicación de gestión de tareas</p>
      </div>
    </div>
    
    <div class="about-container">
      <div class="about-hero">
        <div class="hero-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <h2>Organiza tu vida con TaskFlow</h2>
        <p class="hero-description">
          TaskFlow es tu compañero perfecto para organizar el día a día. 
          Diseñado pensando en ti, te ayuda a mantener tus tareas organizadas, 
          cumplir con tus objetivos y ser más productivo de manera sencilla e intuitiva.
        </p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-columns"></i>
          </div>
          <h3>Organización Visual</h3>
          <p>Mantén tus tareas organizadas en tres columnas: Por Hacer, En Progreso y Completadas. ¡Es súper fácil de entender!</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <h3>Planifica tu Tiempo</h3>
          <p>Asigna fechas y horarios a tus tareas para que nunca se te olvide nada importante.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3>Funciona en Todos Lados</h3>
          <p>Úsalo en tu computadora, tablet o celular. Siempre se ve perfecto.</p>
        </div>
      </div>

      <div class="team-section">
        <h3>Conoce al Equipo Bugbusters</h3>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <i class="fas fa-crown"></i>
            </div>
            <div class="member-info">
              <h4>Jean Pierre Cardenas</h4>
              <p class="member-role">Product Owner</p>
            </div>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <i class="fas fa-database"></i>
            </div>
            <div class="member-info">
              <h4>John Freidy Lubrido</h4>
              <p class="member-role">Bases de Datos</p>
            </div>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <i class="fas fa-paint-brush"></i>
            </div>
            <div class="member-info">
              <h4>Laura Valentina Arbeláez</h4>
              <p class="member-role">Frontend</p>
            </div>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="member-info">
              <h4>Juan David Olaya</h4>
              <p class="member-role">Pruebas</p>
            </div>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <i class="fas fa-server"></i>
            </div>
            <div class="member-info">
              <h4>Cristin Daniel Guaza</h4>
              <p class="member-role">Backend</p>
            </div>
          </div>
        </div>

        <div class="team-philosophy">
          <div class="philosophy-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <p class="philosophy-text">
            Juntos transformamos los bugs en oportunidades 🚀✨
          </p>
        </div>
      </div>
    </div>

    <style>
      .about-container {
        background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
        border-radius: 24px;
        box-shadow: 0 12px 32px rgba(0,0,0,.08);
        padding: 40px;
        border: 1px solid rgba(0,0,0,.06);
        animation: fadeIn 0.6s ease;
        position: relative;
        overflow: hidden;
      }

      .about-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #FFD700, var(--cafe-principal));
      }

      .about-hero {
        text-align: center;
        margin-bottom: 60px;
        padding-bottom: 40px;
        border-bottom: 2px solid rgba(160, 82, 45, 0.1);
      }

      .hero-icon {
        width: 120px;
        height: 120px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 60px;
        box-shadow: 0 8px 24px rgba(160, 82, 45, 0.3);
        border: 4px solid rgba(255,255,255,0.9);
        position: relative;
      }

      .hero-icon::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: linear-gradient(45deg, #FFD700, var(--cafe-principal));
        z-index: -1;
      }

      .about-hero h2 {
        font-size: 36px;
        font-weight: 800;
        color: var(--cafe-principal);
        margin: 0 0 16px 0;
        background: linear-gradient(135deg, var(--cafe-principal), #D2B48C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-description {
        font-size: 18px;
        color: var(--gris-medio);
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 60px;
      }

      .feature-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,246,243,0.9));
        border-radius: 20px;
        padding: 32px 24px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0,0,0,.06);
        border: 1px solid rgba(160, 82, 45, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #D2B48C);
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0,0,0,.12);
      }

      .feature-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        border-radius: 20px;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 36px;
        box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
      }

      .feature-card h3 {
        font-size: 22px;
        font-weight: 700;
        color: var(--cafe-principal);
        margin: 0 0 12px 0;
      }

      .feature-card p {
        font-size: 16px;
        color: var(--gris-medio);
        line-height: 1.5;
        margin: 0;
      }

      .team-intro {
        font-size: 18px;
        color: var(--gris-medio);
        line-height: 1.6;
        text-align: center;
        margin-bottom: 40px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }

      .team-member {
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,246,243,0.9));
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 6px 20px rgba(0,0,0,.06);
        border: 1px solid rgba(160, 82, 45, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .team-member::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #D2B48C);
      }

      .team-member:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0,0,0,.12);
      }

      .member-avatar {
        width: 80px;
        height: 80px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 32px;
        box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
      }

      .member-info h4 {
        font-size: 20px;
        font-weight: 700;
        color: var(--cafe-principal);
        margin: 0 0 8px 0;
      }

      .member-role {
        font-size: 14px;
        font-weight: 600;
        color: var(--gris-medio);
        margin: 0 0 12px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .member-description {
        font-size: 15px;
        color: var(--gris-medio);
        line-height: 1.5;
        margin: 0;
      }

      .team-philosophy {
        text-align: center;
        padding: 32px;
        background: linear-gradient(135deg, rgba(160, 82, 45, 0.05), rgba(139, 69, 19, 0.05));
        border-radius: 20px;
        border: 2px solid rgba(160, 82, 45, 0.1);
        margin-top: 40px;
      }

      .philosophy-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 28px;
        box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
      }

      .philosophy-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--cafe-principal);
        margin: 0;
        font-style: italic;
      }

      .team-section {
        text-align: center;
      }

      .team-section h3 {
        font-size: 28px;
        font-weight: 700;
        color: var(--cafe-principal);
        margin: 0 0 32px 0;
      }

      .team-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        padding: 32px;
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,246,243,0.9));
        border-radius: 20px;
        border: 1px solid rgba(160, 82, 45, 0.1);
        box-shadow: 0 6px 20px rgba(0,0,0,.06);
      }

      .team-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 36px;
        box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
        flex-shrink: 0;
      }

      .team-details h4 {
        font-size: 24px;
        font-weight: 700;
        color: var(--cafe-principal);
        margin: 0 0 8px 0;
      }

      .team-details p {
        font-size: 16px;
        color: var(--gris-medio);
        margin: 0 0 4px 0;
      }

      .version {
        font-weight: 600;
        color: var(--cafe-principal) !important;
      }

      @media (max-width: 768px) {
        .about-container {
          padding: 24px;
          border-radius: 20px;
        }

        .about-hero {
          margin-bottom: 40px;
          padding-bottom: 24px;
        }

        .hero-icon {
          width: 100px;
          height: 100px;
          font-size: 48px;
        }

        .about-hero h2 {
          font-size: 28px;
        }

        .hero-description {
          font-size: 16px;
        }

        .features-grid {
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 40px;
        }

        .feature-card {
          padding: 24px 20px;
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          font-size: 28px;
        }

        .feature-card h3 {
          font-size: 20px;
        }

        .team-section {
          margin-bottom: 40px;
        }

        .team-section h3 {
          font-size: 24px;
        }

        .team-intro {
          font-size: 16px;
          margin-bottom: 32px;
        }

        .team-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .team-member {
          padding: 20px;
        }

        .member-avatar {
          width: 64px;
          height: 64px;
          font-size: 28px;
        }

        .member-info h4 {
          font-size: 18px;
        }

        .member-role {
          font-size: 13px;
        }

        .member-description {
          font-size: 14px;
        }

        .team-philosophy {
          padding: 24px;
          margin-top: 32px;
        }

        .philosophy-icon {
          width: 50px;
          height: 50px;
          font-size: 24px;
        }

        .philosophy-text {
          font-size: 16px;
        }
      }

      @media (max-width: 480px) {
        .about-container {
          padding: 20px;
        }

        .hero-icon {
          width: 80px;
          height: 80px;
          font-size: 40px;
        }

        .about-hero h2 {
          font-size: 24px;
        }

        .hero-description {
          font-size: 14px;
        }

        .feature-card {
          padding: 20px 16px;
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          font-size: 24px;
        }

        .feature-card h3 {
          font-size: 18px;
        }

        .feature-card p {
          font-size: 14px;
        }

        .team-member {
          padding: 16px;
        }

        .member-avatar {
          width: 56px;
          height: 56px;
          font-size: 24px;
        }

        .member-info h4 {
          font-size: 16px;
        }

        .member-role {
          font-size: 12px;
        }

        .member-description {
          font-size: 13px;
        }

        .team-philosophy {
          padding: 20px;
        }

        .philosophy-icon {
          width: 44px;
          height: 44px;
          font-size: 20px;
        }

        .philosophy-text {
          font-size: 14px;
        }
      }
    </style>
  `
  
  return div
}

document.addEventListener("DOMContentLoaded", () => {
  const navType = document.body.dataset.nav || "default";

  const brand = () => `
    <a class="navbar-brand d-flex align-items-center text-white fw-bold" href="Home.html">
      <img src="../Assets/Logo1_SinFondo.png" alt="Logo SeniorCare" class="Glogo me-2">
      <span class="brand-name">SeniorCare</span>
    </a>
  `;

  const navIcons = `
    <button class="btn btn-link p-0 text-white" type="button" aria-label="Ajustes">
      <img src="../Assets/ajuste.png" class="nav-icon" alt="Ajustes">
    </button>

    <div class="dropdown">
      <button class="btn btn-link p-0 text-white dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="../Assets/notificacion.png" class="nav-icon" alt="Notificaciones">
      </button>
      <ul class="dropdown-menu dropdown-menu-end p-2" style="min-width: 250px;">
        <li><strong>🔔 Notificaciones</strong></li>
        <li><hr class="dropdown-divider"></li>
        <li><span class="dropdown-item-text">📬 Mensaje nuevo de Juan</span></li>
        <li><span class="dropdown-item-text">🔔 Tu reserva fue confirmada</span></li>
        <li><span class="dropdown-item-text">📅 Evento mañana a las 10:00 hs</span></li>
      </ul>
    </div>

    <div class="dropdown">
      <button class="btn btn-link p-0 text-white dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="../Assets/usuario.png" class="nav-icon" alt="Perfil">
      </button>
      <ul class="dropdown-menu dropdown-menu-end p-2" style="min-width: 200px;">
        <li><strong>👤 Perfil</strong></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="/perfil">Ver perfil</a></li>
        <li><a class="dropdown-item" href="/configuracion">Configuración</a></li>
        <li><a class="dropdown-item text-danger" href="/cerrar-sesion">Cerrar sesión</a></li>
      </ul>
    </div>
  `;

  const defaultNavbar = `
    <nav class="navbar navbar-expand-lg navbar-dark Gnavbar">
      <div class="container align-items-center">
        ${brand()}
        <div class="d-lg-none ms-auto d-flex align-items-center gap-3 nav-icons">
          ${navIcons}
        </div>
        <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse mt-3 mt-lg-0" id="mainNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-3">
            <li class="nav-item"><a class="nav-link text-white fw-semibold" href="Home.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link text-white" href="CareRequest.html">Solicitudes</a></li>
            <li class="nav-item"><a class="nav-link text-white" href="CareRequestResults.html">Cuidadores</a></li>
            <li class="nav-item"><a class="nav-link text-white" href="LandingPage.html">Nosotros</a></li>
            <li class="nav-item"><a class="nav-link text-white" href="TermAndConditions.html">Preguntas frecuentes</a></li>
          </ul>
          <div class="nav-icons d-none d-lg-flex align-items-center gap-3 ms-lg-3">
            ${navIcons}
          </div>
        </div>
      </div>
    </nav>
  `;

  const landingNavbar = `
    <nav class="navbar navbar-dark Gnavbar">
      <div class="container align-items-center">
        ${brand()}
        <div class="ms-auto d-flex gap-2 flex-wrap">
          <a class="btn btn-outline-light" href="Login.html">Ingresar</a>
          <a class="btn btn-light text-primary fw-semibold" href="Register.html">Registrarse</a>
        </div>
      </div>
    </nav>
  `;

  const registerNavbar = `
    <nav class="navbar navbar-dark Gnavbar">
      <div class="container align-items-center">
        ${brand()}
      </div>
    </nav>
  `;

  const navbarTemplate =
    navType === "landing" ? landingNavbar : navType === "register" ? registerNavbar : defaultNavbar;

  const footerTemplate = `
    <footer id="footerGlobal" class="footer mt-auto">
      <div class="footer-content">
        <div class="contact-info">
          <p class="mb-1 fw-semibold">CONTACTOS:</p>
          <p class="mb-0">
            <a href="#">Instagram</a> |
            <a href="#">Facebook</a> |
            <a href="mailto:soporte@seniorcare.com.ar">Mail</a>
          </p>
        </div>
        <div class="rights">
          <p class="mb-0">&copy; 2025 SeniorCare. Todos los derechos reservados</p>
        </div>
        <div class="text-end">
          <a href="#" data-terms-trigger="true" class="text-white small" data-bs-toggle="modal" data-bs-target="#modalTerminos">Terminos y privacidad</a>
        </div>
      </div>
    </footer>

    <div class="modal fade" id="modalTerminos" tabindex="-1" aria-labelledby="modalTerminosLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTerminosLabel">Terminos y Condiciones de Uso - SeniorCare</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body" id="terminosContent" style="color: #000;"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cerrar" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll("nav.navbar").forEach((nav) => nav.remove());
  document.body.insertAdjacentHTML("afterbegin", navbarTemplate.trim());

  document.querySelectorAll("footer").forEach((footer) => footer.remove());
  const modalExistente = document.getElementById("modalTerminos");
  if (modalExistente) modalExistente.remove();

  document.body.insertAdjacentHTML("beforeend", footerTemplate.trim());

  const setupTermsModal = () => {
    const terminosContent = document.getElementById("terminosContent");
    const modalElement = document.getElementById("modalTerminos");
    const triggers = document.querySelectorAll("[data-terms-trigger]");

    if (!terminosContent || !modalElement || triggers.length === 0) return;

    const terminosHTML = `
      <p><strong>Ultima actualizacion:</strong> Noviembre 2025</p>
      <p>Bienvenido a <strong>SeniorCare</strong>, una plataforma desarrollada por <strong>SeniorCare Developers</strong>.
      Al acceder o utilizar nuestros servicios, usted acepta estos Terminos y nuestra Politica de Privacidad.</p>
      <h5>1. Generalidades</h5>
      <p>SeniorCare facilita la conexion entre cuidadores y familias como intermediario tecnologico.</p>
      <h5>2. Uso del Servicio</h5>
      <p>El servicio esta disponible para personas mayores de 18 anos. Cada usuario debe proteger sus credenciales.</p>
      <h5>3. Derechos de la Compania</h5>
      <p>Podemos modificar funciones con aviso previo de 60 dias o suspender cuentas por incumplimientos.</p>
      <h5>4. Descripcion del Servicio</h5>
      <p>Permite crear perfiles, publicar solicitudes y gestionar contactos con autenticacion segura.</p>
      <h5>5. Costo</h5>
      <p>El servicio es gratuito. Si se agregan tarifas, se notificara con 60 dias de antelacion.</p>
      <h5>6. Propiedad Intelectual</h5>
      <p>Todo el software, disenos y logotipos estan protegidos por la ley vigente.</p>
      <h5>7. Privacidad</h5>
      <p>Los datos se almacenan con altos estandares de seguridad. Consulte la Politica de Privacidad.</p>
      <h5>8. Responsabilidad</h5>
      <p>SeniorCare no es responsable por acuerdos entre usuarios fuera de la plataforma.</p>
      <h5>9. Jurisdiccion</h5>
      <p>Regido por las leyes de la Republica Argentina. Disputas en tribunales de Cordoba.</p>
      <h5>10. Contacto</h5>
      <p>soporte@seniorcare.com.ar</p>
    `;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    const handleOpen = (event) => {
      event.preventDefault();
      terminosContent.innerHTML = terminosHTML;
      modal.show();
    };

    triggers.forEach((trigger) => trigger.addEventListener("click", handleOpen));
  };

  setupTermsModal();
});

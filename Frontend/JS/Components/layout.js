document.addEventListener("DOMContentLoaded", () => {
  const navType = document.body.dataset.nav || "default";

  const brand = () => {
    const currentPage = window.location.pathname;

    const landingRoutes = ["LandingPage.html", "Register.html", "Login.html"];

    // Landing, Register y Login redirigen a LandingPage; el resto a Home
    const targetPage = landingRoutes.some(page => currentPage.includes(page))
      ? "LandingPage.html"
      : "Home.html";

    return `
      <a class="navbar-brand d-flex align-items-center text-white fw-bold" href="${targetPage}">
        <img src="../Assets/Logo1_SinFondo.png" alt="Logo SeniorCare" class="Glogo me-2">
        <span class="brand-name">SeniorCare</span>
      </a>
    `;
  };


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
            <li class="nav-item"><a class="nav-link text-white" href="AboutUs.html">Nosotros</a></li>
            <li class="nav-item"><a class="nav-link text-white" href="Faq.html">Preguntas frecuentes</a></li>
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
      <p>Estos Terminos y Condiciones (los "Terminos") regulan el acceso y uso de la plataforma <strong>SeniorCare</strong>, operada por SeniorCare Developers. Al registrarse, navegar o utilizar cualquiera de nuestros servicios usted declara haber leido, comprendido y aceptado plenamente lo aqui dispuesto, asi como la Politica de Privacidad vigente.</p>
      <h5>1. Definiciones</h5>
      <p>"Plataforma" refiere al ecosistema digital de SeniorCare; "Usuarios" a toda persona que crea una cuenta, ya sea solicitante o cuidador; "Servicios" a las funcionalidades ofrecidas por la plataforma para vincular ambas partes y gestionar la relacion asistencial.</p>
      <h5>2. Alcance del servicio</h5>
      <p>SeniorCare actua como intermediario tecnologico para facilitar la conexion entre familias y cuidadores independientes. No es un prestador medico ni sustituye indicaciones profesionales. Toda decision final sobre contrataciones recae en los usuarios.</p>
      <h5>3. Registro y obligaciones</h5>
      <p>El registro esta disponible para personas mayores de 18 anos con capacidad legal. Cada cuenta es personal e intransferible y los usuarios son responsables de la veracidad de la informacion aportada y de mantener la confidencialidad de sus credenciales.</p>
      <h5>4. Uso permitido y conductas prohibidas</h5>
      <p>Se debe utilizar la plataforma conforme a la ley aplicable. Queda prohibido difundir contenidos ilicitos, vulnerar derechos de terceros, realizar ingenieria inversa, utilizar bots o emplear los datos obtenidos para fines distintos a la asistencia declarada.</p>
      <h5>5. Solicitudes y seleccion de cuidadores</h5>
      <p>Las familias pueden crear solicitudes detallando necesidades, horarios y condiciones particulares. SeniorCare ofrece sugerencias basadas en los perfiles disponibles, pero la ultima decision y validacion contractual pertenece a la familia y al cuidador involucrado.</p>
      <h5>6. Honorarios, pagos y facturacion</h5>
      <p>El uso basico de la plataforma es gratuito; no obstante, pueden existir cargos por servicios premium, gestiones administrativas o pasarelas de pago. Toda tarifa sera informada antes de su aplicacion y podra abonarse mediante los metodos habilitados en la app.</p>
      <h5>7. Cancelaciones y reembolsos</h5>
      <p>Las cancelaciones con mas de 12 horas de anticipacion no generan cargos. Si la cancelacion es tardia, SeniorCare podra retener los importes necesarios para cubrir la reserva del cuidador. Los reembolsos se procesan a traves del mismo metodo de pago utilizado.</p>
      <h5>8. Seguridad y confidencialidad</h5>
      <p>Mantenemos protocolos tecnicos y organizacionales para proteger la informacion sensible; sin embargo, ningun entorno es infalible. Los usuarios se comprometen a manejar con reserva los datos personales a los que accedan dentro de la plataforma.</p>
      <h5>9. Propiedad intelectual</h5>
      <p>Todo el software, disenos, textos, marcas y logotipos son propiedad de SeniorCare o de sus licenciantes. No se concede licencia alguna salvo la necesaria para utilizar los servicios en los terminos descritos.</p>
      <h5>10. Datos personales y privacidad</h5>
      <p>El tratamiento de los datos se realiza conforme a la Politica de Privacidad, que describe finalidades, bases legales, medidas de seguridad y derechos de los titulares. Al usar la plataforma usted autoriza el procesamiento de sus datos en los terminos alli previstos.</p>
      <h5>11. Comunicaciones y soporte</h5>
      <p>Podemos enviarle notificaciones por correo electronico, SMS o dentro de la app respecto al estado de sus solicitudes, cambios contractuales o material informativo. Los canales oficiales de soporte se indican en la plataforma.</p>
      <h5>12. Limitacion de responsabilidad</h5>
      <p>SeniorCare no garantiza la idoneidad final de cada cuidador ni asume responsabilidad por acuerdos celebrados fuera de la plataforma. El servicio se ofrece "tal como es" y la responsabilidad total frente a cualquier reclamacion se limita al monto efectivamente abonado por el usuario en los ultimos doce meses.</p>
      <h5>13. Modificaciones y terminacion</h5>
      <p>Podemos modificar estos Terminos notificandolo con al menos 30 dias de anticipacion. El uso continuado despues de ese plazo implica la aceptacion de los cambios. Asimismo, podremos suspender o cancelar cuentas ante incumplimientos o riesgos operativos.</p>
      <h5>14. Ley aplicable y jurisdiccion</h5>
      <p>Estos Terminos se rigen por las leyes de la Republica Argentina. Toda controversia se resolvera ante los tribunales ordinarios de la Ciudad de Cordoba, renunciando las partes a cualquier otro fuero que pudiera corresponder.</p>
      <h5>15. Contacto</h5>
      <p>Para consultas legales o solicitudes relacionadas con estos Terminos escriba a <a href="mailto:soporte@seniorcare.com.ar">soporte@seniorcare.com.ar</a>.</p>
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

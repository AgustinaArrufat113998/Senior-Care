document.addEventListener("DOMContentLoaded", () => {
  const linkTerminos = document.getElementById("linkTerminos");
  const terminosContent = document.getElementById("terminosContent");

  const terminosHTML = `
    <p><strong>Última actualización:</strong> Noviembre 2025</p>
    <p>Bienvenido a <strong>SeniorCare</strong>, una plataforma desarrollada por <strong>SeniorCare Developers</strong> (“nosotros” o “la Compañía”). 
    Al acceder o utilizar nuestros servicios, usted acepta los presentes Términos y Condiciones y nuestra Política de Privacidad.</p>

    <h5>1. Generalidades</h5>
    <p>SeniorCare facilita la conexión entre cuidadores y personas que requieren asistencia. Actuamos como intermediarios tecnológicos, sin proveer directamente los servicios de cuidado.</p>

    <h5>2. Uso del Servicio</h5>
    <p>El uso de SeniorCare está permitido a personas mayores de 18 años. Cada usuario debe mantener la confidencialidad de sus credenciales de acceso y no compartirlas con terceros.</p>

    <h5>3. Derechos de la Compañía</h5>
    <p>Podemos modificar o suspender funciones del servicio notificando con al menos 60 días de anticipación. También podremos cancelar cuentas por incumplimiento de estos Términos.</p>

    <h5>4. Descripción del Servicio</h5>
    <p>Permite crear perfiles de cuidadores, publicar solicitudes de cuidado y gestionar contactos entre usuarios de manera segura mediante autenticación JWT.</p>

    <h5>5. Costo</h5>
    <p>Actualmente, el servicio es gratuito. En caso de introducir tarifas, se notificará con al menos 60 días de antelación.</p>

    <h5>6. Propiedad Intelectual</h5>
    <p>Todo el software, diseño y logotipos de SeniorCare están protegidos por la Ley 11.723 de Propiedad Intelectual de la República Argentina.</p>

    <h5>7. Privacidad y Datos Personales</h5>
    <p>Los datos de los usuarios se procesan y almacenan bajo altos estándares de seguridad. Consulte la <strong>Política de Privacidad</strong> para más información.</p>

    <h5>8. Responsabilidad</h5>
    <p>SeniorCare no se responsabiliza por acuerdos, tratos o interacciones entre usuarios fuera de la plataforma.</p>

    <h5>9. Jurisdicción</h5>
    <p>Estos Términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los tribunales ordinarios de la Ciudad de Córdoba.</p>

    <h5>10. Contacto</h5>
    <p>📧 soporte@seniorcare.com.ar</p>
  `;

  linkTerminos.addEventListener("click", (e) => {
    e.preventDefault();
    terminosContent.innerHTML = terminosHTML;
    const modal = new bootstrap.Modal(document.getElementById("modalTerminos"));
    modal.show();
  });
});

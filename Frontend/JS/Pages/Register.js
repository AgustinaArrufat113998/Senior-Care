document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const dni = document.getElementById("dni").value;
  const telefono = document.getElementById("telefono").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const sexo = document.getElementById("sexo").value;

  if (password !== confirmPassword) {
    document.getElementById("msg").innerText = "⚠️ Las contraseñas no coinciden";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nombre,
        email,
        password,
        dni,
        phone: telefono,
        birthDate: fechaNacimiento,
        gender: sexo
      })
    });

    if (response.ok) {
      alert("✅ Usuario registrado con éxito. Ahora puede iniciar sesión.");
      window.location.href = "login.html";
    } else {
      document.getElementById("msg").innerText = "⚠️ Error al registrar usuario";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("msg").innerText = "⚠️ No se pudo conectar con la API";
  }
});

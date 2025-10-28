const paisSelect = document.getElementById("pais");
const provinciaSelect = document.getElementById("provincia");
const msg = document.getElementById("msg");

async function cargarPaises() {
  try {
    const response = await fetch("http://localhost:8080/api/countries");
    if (!response.ok) throw new Error("Error al cargar países");
    const paises = await response.json();

    paisSelect.innerHTML = '<option value="" disabled selected>Seleccione país</option>';
    paises.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      paisSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    paisSelect.innerHTML = '<option disabled>Error al cargar países</option>';
  }
}

async function cargarProvincias(idPais) {
  try {
    provinciaSelect.disabled = true;
    provinciaSelect.innerHTML = '<option value="" disabled selected>Cargando...</option>';

    const response = await fetch(`http://localhost:8080/api/provinces/by-country/${idPais}`);
    if (!response.ok) throw new Error("Error al cargar provincias");

    const provincias = await response.json();
    provinciaSelect.innerHTML = '<option value="" disabled selected>Seleccione provincia</option>';

    provincias.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      provinciaSelect.appendChild(option);
    });

    provinciaSelect.disabled = false;
  } catch (error) {
    console.error(error);
    provinciaSelect.innerHTML = '<option disabled>Error al cargar provincias</option>';
  }
}

paisSelect.addEventListener("change", e => {
  const idPais = e.target.value;
  if (idPais) cargarProvincias(idPais);
});

// Cargar países al iniciar
document.addEventListener("DOMContentLoaded", cargarPaises);

// Envío del formulario
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const dni = document.getElementById("dni").value;
  const telefono = document.getElementById("telefono").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const sexo = document.getElementById("sexo").value;

  const calle = document.getElementById("calle").value;
  const nroCasa = document.getElementById("nroCasa").value;
  const piso = document.getElementById("piso").value;
  const depto = document.getElementById("depto").value;
  const provincia = provinciaSelect.value;
  const pais = paisSelect.value;

  if (password !== confirmPassword) {
    msg.innerText = "⚠️ Las contraseñas no coinciden";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nombre,
        lastName: apellido,
        username: username,
        email: email,
        password: password,
        dni: dni,
        phone: telefono,
        birthDate: fechaNacimiento,
        gender: sexo,
        address: {
          street: calle,
          houseNumber: nroCasa,
          floor: piso || null,
          apartment: depto || null,
          provinceId: provincia,
          countryId: pais
        }
      })
    });

    if (response.ok) {
      alert("✅ Usuario registrado con éxito. Ahora puede iniciar sesión.");
      window.location.href = "login.html";
    } else {
      msg.innerText = "⚠️ Error al registrar usuario";
    }
  } catch (err) {
    console.error(err);
    msg.innerText = "⚠️ No se pudo conectar con la API";
  }
});

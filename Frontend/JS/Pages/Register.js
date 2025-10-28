const paisSelect = document.getElementById("pais");
const provinciaSelect = document.getElementById("provincia");
const msg = document.getElementById("msg");

import { registerUser, getCountries, getProvincesByCountry } from "../Api/userApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  const paisSelect = document.getElementById("pais");
  const provinciaSelect = document.getElementById("provincia");

  // 🔹 Cargar países
  const countries = await getCountries();
  paisSelect.innerHTML = '<option value="">Seleccione país</option>';
  countries.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    paisSelect.appendChild(option);
  });

  // 🔹 Cuando el usuario seleccione un país → cargar provincias
  paisSelect.addEventListener("change", async () => {
    provinciaSelect.disabled = true;
    provinciaSelect.innerHTML = '<option>Cargando...</option>';
    console.log("País seleccionado:", paisSelect.value);
    const provinces = await getProvincesByCountry(paisSelect.value);
    provinciaSelect.innerHTML = '<option value="">Seleccione provincia</option>';
    provinces.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      provinciaSelect.appendChild(option);
    });
    provinciaSelect.disabled = false;
  });
});

// paisSelect.addEventListener("change", e => {
//   const idPais = e.target.value;
//   if (idPais) cargarProvincias(idPais);
// });

// Envío del formulario
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar contraseñas
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  

  if (password !== confirmPassword) {
    msg.innerText = "⚠️ Las contraseñas no coinciden";
    return;
  }

  const userData = {
    name: document.getElementById("nombre").value,
    lastName: document.getElementById("apellido").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    dni: document.getElementById("dni").value,
    phone: document.getElementById("telefono").value,
    birthDate: document.getElementById("fechaNacimiento").value,
    gender: document.getElementById("sexo").value,
    address: {
      street: document.getElementById("calle").value,
      houseNumber: document.getElementById("nroCasa").value,
      floor: document.getElementById("piso").value || null,
      apartment: document.getElementById("depto").value || null,
      provinceId: document.getElementById("provincia").value,
      countryId: document.getElementById("pais").value
    }};

  const response = await registerUser(userData);
  if (response.ok) {
    alert("✅ Usuario registrado con éxito");
    window.location.href = "login.html";
  } else {
    alert("⚠️ Error al registrar usuario");
  }
});

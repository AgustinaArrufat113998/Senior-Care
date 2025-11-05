
import { registerUser, createStreet, createAddress } from "../Api/userApi.js";
import {getCountries, getProvincesByCountry, getGender} from "../Api/userApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  const paisSelect = document.getElementById("pais");
  const provinciaSelect = document.getElementById("provincia");
  const sexoSelect = document.getElementById("sexo");

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

  // 🔹 Cargar géneros
  const gender = await getGender();
  sexoSelect.innerHTML = '<option value="">Seleccione sexo</option>';
  gender.forEach(g => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = g.description;
    sexoSelect.appendChild(option);
  });
});

// Envío del formulario
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar contraseñas
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const edad = Number(document.getElementById("edad").value);        
  const obraSocial = document.getElementById("obraSocial").value;     
  const msg = document.getElementById("msg");    
  

  if (password !== confirmPassword) {
    msg.innerText = "⚠️ Las contraseñas no coinciden";
    return;
  }

  // Validar edad
  if (edad < 18 || edad > 130 || isNaN(edad)) {
  showToast("⚠️ La edad debe ser entre 18 y 130 años", true);
  return;
  }
  // Validar obra social
  if (!obraSocial) {
    showToast("⚠️ Seleccione una obra social", true);
    return;
  }

  try {
  // === 1️⃣ Create Street ===
    const streetName = document.getElementById("calle").value;
    const cityId = document.getElementById("provincia").value;
    const street = await createStreet(streetName, cityId);

    // === 2️⃣ Create Address ===
    const address = await createAddress(
      document.getElementById("nroCasa").value,
      document.getElementById("piso").value || null,
      document.getElementById("depto").value || null,
      street.id
    );

    // === 3️⃣ Create User ===

    // Fecha de nacimiento en formato ISO
    const birthDateInput = document.getElementById("fechaNacimiento").value;
    const birthDate = new Date(birthDateInput).toISOString();

    const userData = {
      name: document.getElementById("nombre").value,
      surname: document.getElementById("apellido").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      dni: document.getElementById("dni").value,
      phone: document.getElementById("telefono").value,
      birthDate: birthDate,
      genderId: Number(document.getElementById("sexo").value),
      edad: Number(document.getElementById("edad").value),
      obraSocial: document.getElementById("obraSocial").value,
      addressId: address.id 
    };
    
    console.log("Datos del usuario a registrar:", userData);

    // Convertir y validar IDs
    userData.genderId = Number(userData.genderId);
    userData.addressId = Number(userData.addressId);

    if (!userData.genderId || isNaN(userData.genderId)) {
      showToast("⚠️ Debe seleccionar un sexo válido", true);
      return;
    }
    if (!userData.addressId || isNaN(userData.addressId)) {
      showToast("⚠️ Error al obtener dirección del usuario", true);
      return;
    }

    const response = await registerUser(userData);
    
    if (response && response.ok) {
      showToast("✅ Usuario registrado con éxito");
      setTimeout(() => {
        window.location.href = "../../Html/login.html";
      }, 3000); 
    } else {
      showToast("⚠️ Error al registrar usuario");
    }
  } 
  catch (error) {
    console.error("Error durante el registro:", error);
    showToast("❌ " + (error.message || "error inesperado"), true);
  }

});

console.log("SexoId: ", document.getElementById("sexo").value);

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.toggle("error", isError);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000); // se oculta a los 5 segundos
}

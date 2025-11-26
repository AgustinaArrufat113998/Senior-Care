import { registerUser, createStreet, createAddress } from "../Api/userApi.js";
import { getCountries, getProvincesByCountry, getGender } from "../Api/userApi.js";

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

// === Envío del formulario ===
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    await Swal.fire({
      icon: "warning",
      title: "Las contraseñas no coinciden",
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

  try {
    // === 1️⃣ Crear calle ===
    const streetName = document.getElementById("calle").value;
    const cityId = document.getElementById("provincia").value;
    const street = await createStreet(streetName, cityId);

    // === 2️⃣ Crear dirección ===
    const number = document.getElementById("nroCasa").value;
    const floor = document.getElementById("piso").value;
    const apartment = document.getElementById("depto").value;
    const streetId = street.id;
    const address = await createAddress(number, floor, apartment, streetId);

    // === 3️⃣ Crear usuario ===
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
      addressId: address.id 
    };

    // Validaciones básicas
    if (!userData.genderId || isNaN(userData.genderId)) {
      await Swal.fire({
        icon: "error",
        title: "Debe seleccionar un sexo válido",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (!userData.addressId || isNaN(userData.addressId)) {
      await Swal.fire({
        icon: "error",
        title: "Error al obtener dirección del usuario",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    const response = await registerUser(userData);

    if (!response) {
      throw new Error("No se recibió respuesta del servidor al registrar el usuario");
    }
    // 🚀 Éxito: esperar antes de redirigir
    await Swal.fire({
      icon: "success",
      title: "Usuario registrado con éxito 🎉",
      text: "Serás redirigido al inicio de sesión...",
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    window.location.href = "Login.html";
    
  } catch (error) {
    console.error("Error durante el registro:", error);
    await Swal.fire({
      icon: "error",
      title: "❌ " + (error.message || "Error inesperado"),
      text: "No se pudo completar el registro. Intenta nuevamente.",
      timer: 3000,
      showConfirmButton: true
    });
  }
});

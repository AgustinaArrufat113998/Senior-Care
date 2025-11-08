// js/api/http.js
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("jwtToken");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
  }

  return res;
}

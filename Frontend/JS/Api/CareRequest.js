const CARE_REQUEST_SERVICE_URL = "http://localhost:8083";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || `Error ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getDiseases() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/diseases`);
}

export function getMedications() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/medications`);
}

export function getAllergies() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/allergies`);
}

export function getConditions() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/conditions`);
}

export function createCareRequest(payload) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/add`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAllCareRequests() {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/all`, {
    method: "GET",
  });
}

export function getCareRequest(id) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/${id}`, {
    method: "GET",
  });
}

export function updateCareRequest(id, payload) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getCareRequestsByStatus(status) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/all`, {
    method: "GET",
  }).then((list = []) => {
    if (!status) return list;
    return list.filter((item) => (item?.status || "").toUpperCase() === status.toUpperCase());
  });
}

export function getCareRequestStatus(id) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/status/${id}`, {
    method: "GET",
  });
}

export function updateCareRequestStatus(id, status) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/status/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function assignCarerToRequest(requestId, carerId) {
  return requestJson(`${CARE_REQUEST_SERVICE_URL}/care-requests/assign/${requestId}`, {
    method: "PUT",
    body: JSON.stringify({ carerId }),
  });
}

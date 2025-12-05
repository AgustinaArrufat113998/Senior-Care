document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-family-form');
    const cancelButton = document.getElementById('cancel-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const formData = {
            name: document.getElementById('name').value,
            dni: document.getElementById('dni').value,
            birthdate: document.getElementById('birthdate').value,
            relationship: document.getElementById('relationship').value,
            observations: document.getElementById('observations').value,
            phone: document.getElementById('familyPhone').value,
            email: document.getElementById('familyEmail').value || null
        };

        if (!formData.name || !formData.dni || !formData.birthdate || !formData.relationship || !formData.phone) {
            console.error("VALIDACIÓN FALLIDA: Por favor, completa todos los campos obligatorios.");
            return;
        }

        console.log("POST /api/family -> Enviando datos del nuevo familiar:", formData);
 
        setTimeout(() => {
            console.log("RESPUESTA: ¡Familiar agregado exitosamente!");
            form.reset(); 
        }, 800);
    });

    cancelButton.addEventListener('click', () => {
        console.log("[ACCIÓN] Cancelar. Volviendo a la lista de familia.");
    });
});
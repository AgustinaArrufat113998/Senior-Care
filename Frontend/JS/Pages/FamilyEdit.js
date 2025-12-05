document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-family-form');
    const cancelButton = document.getElementById('cancel-edit-btn');

    const familyIdToEdit = '123'; 
    
    const mockFamilyData = {
        id: familyIdToEdit,
        name: 'Juan Martin',
        dni: '11.111.111', 
        birthdate: '2025-12-04', 
        relationship: 'abuelo/a', 
        observations: 'Alergia'
    };


    const loadFormData = (data) => {
        document.getElementById('name-edit').value = data.name;
        document.getElementById('dni-edit').value = data.dni;
        document.getElementById('birthdate-edit').value = data.birthdate;
        document.getElementById('relationship-edit').value = data.relationship;
        document.getElementById('observations-edit').value = data.observations;

        console.log(`[DATA LOAD] Datos del familiar ID ${data.id} cargados.`);
    };

    loadFormData(mockFamilyData);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedFormData = {
            id: familyIdToEdit,
            name: document.getElementById('name-edit').value,
            dni: document.getElementById('dni-edit').value, 
            birthdate: document.getElementById('birthdate-edit').value,
            relationship: document.getElementById('relationship-edit').value,
            observations: document.getElementById('observations-edit').value,
        };

        if (!updatedFormData.name || !updatedFormData.birthdate || !updatedFormData.relationship) {
            console.error("VALIDACIÓN FALLIDA: Completa los campos obligatorios.");
            return;
        }

        console.log(`PUT /api/family/${updatedFormData.id} -> Enviando datos actualizados:`, updatedFormData);
        
        setTimeout(() => {
            console.log("RESPUESTA: ¡Familiar actualizado exitosamente!");
        }, 800);
    });

    cancelButton.addEventListener('click', () => {
        console.log("[ACCIÓN] Edición cancelada. Volviendo a la lista.");
    });
});
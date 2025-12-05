document.addEventListener('DOMContentLoaded', () => {
    // Simulacion
    let familyMembers = [
        { id: '1', name: 'Juan Pérez', relationship: 'Abuelo/a', dni: '12.345.678' },
        { id: '2', name: 'María López', relationship: 'Hijo/a', dni: '45.678.901' },
        { id: '3', name: 'Carlos Sanz', relationship: 'Hijo/a', dni: '48.901.234' },
        { id: '4', name: 'Juan Martin', relationship: 'Abuelo/a', dni: '11.111.111' }
    ];

    const familyList = document.getElementById('family-list');
    const addButton = document.getElementById('add-family-btn');

    const renderFamilyList = () => {
        familyList.innerHTML = ''; 

        if (familyMembers.length === 0) {
            familyList.innerHTML = `
                <p style="text-align: center; color: #7f8c8d; padding: 20px; border: 1px dashed #bdc3c7; border-radius: 10px;">
                    Aún no tienes familiares registrados.
                </p>
            `;
            return;
        }

        familyMembers.forEach(member => {
            const item = document.createElement('div');
            item.className = 'family-item'; 
            item.dataset.id = member.id;
            
            item.innerHTML = `
                <div class="family-info">
                    <h4>${member.name}</h4>
                    <p>Parentesco: ${member.relationship} | DNI: ${member.dni}</p>
                </div>
                <div class="family-actions">
                    <button class="btn-outline-custom edit-btn" data-id="${member.id}" title="Editar" onclick="window.location.href='FamilyEdit.html'">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-cancel delete-btn" data-id="${member.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            familyList.appendChild(item);
        });
        
        attachActionListeners();
    };

    const attachActionListeners = () => {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(`[ACCIÓN] Navegando a: editar_family.html?id=${id}`);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                //debe ser un modal UI
                if (confirm(`¿Confirmas la eliminación del familiar con ID ${id}?`)) {
                    deleteFamilyMember(id);
                }
            });
        });
    };
    
    const deleteFamilyMember = (id) => {
        console.log(`[API CALL] DELETE /api/family/${id} - Eliminando...`);
        familyMembers = familyMembers.filter(member => member.id !== id);
        console.log(`[SUCCESS] Familiar ID ${id} eliminado.`);
        renderFamilyList(); 
    };
    
    addButton.addEventListener('click', () => {
        console.log("[ACCIÓN] Navegando a: add_family.html");
    });

    renderFamilyList();
});
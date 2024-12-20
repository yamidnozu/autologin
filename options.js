// options.js

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const usersTableBody = document.querySelector('#users-table tbody');
    const cancelEditBtn = document.getElementById('cancel-edit');
  
    // Cargar y mostrar usuarios existentes
    loadUsers();
  
    // Manejar el envío del formulario
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const apodo = document.getElementById('apodo').value.trim();
      const documentType = document.getElementById('documentType').value;
      const documentNumber = document.getElementById('documentNumber').value.trim();
      const user = document.getElementById('user').value.trim();
      const password = document.getElementById('password').value.trim();
      const userIndex = document.getElementById('user-index').value;
  
      if (!apodo || !documentType || !documentNumber || !user || !password) {
        alert('Por favor, completa todos los campos.');
        return;
      }
  
      const newUser = {
        apodo,
        documentType,
        documentNumber,
        user,
        password
      };
  
      // Obtener usuarios existentes
      chrome.storage.local.get(['--extension--users'], (result) => {
        const users = result['--extension--users'] || [];
  
        if (userIndex === '') {
          // Agregar nuevo usuario
          // Verificar si el apodo o usuario ya existen
          const duplicateApodo = users.some(u => u.apodo === apodo);
          const duplicateUser = users.some(u => u.user === user);
  
          if (duplicateApodo) {
            if (!confirm('Ya existe un usuario con este Apodo. ¿Deseas continuar?')) {
              return;
            }
          }
  
          if (duplicateUser) {
            if (!confirm('Ya existe un usuario con este Nombre de Usuario. ¿Deseas continuar?')) {
              return;
            }
          }
  
          users.push(newUser);
          console.log('Nuevo usuario agregado.');
        } else {
          // Actualizar usuario existente
          const index = parseInt(userIndex, 10);
          if (!isNaN(index) && index >= 0 && index < users.length) {
            users[index] = newUser;
            console.log(`Usuario en el índice ${index} actualizado.`);
          } else {
            console.error('Índice de usuario inválido.');
            return;
          }
        }
  
        // Guardar en el almacenamiento
        chrome.storage.local.set({ '--extension--users': users }, () => {
          console.log('Usuarios almacenados.');
          // Reiniciar el formulario
          userForm.reset();
          document.getElementById('user-index').value = '';
          // Reset buttons
          userForm.querySelector('button[type="submit"]').textContent = 'Agregar Usuario';
          cancelEditBtn.style.display = 'none';
          // Recargar la lista de usuarios
          loadUsers();
        });
      });
    });
  
    // Manejar el botón de cancelar edición
    cancelEditBtn.addEventListener('click', () => {
      userForm.reset();
      document.getElementById('user-index').value = '';
      userForm.querySelector('button[type="submit"]').textContent = 'Agregar Usuario';
      cancelEditBtn.style.display = 'none';
    });
  
    // Función para cargar y mostrar usuarios
    function loadUsers() {
      chrome.storage.local.get(['--extension--users'], (result) => {
        const users = result['--extension--users'] || [];
        // Limpiar la tabla
        usersTableBody.innerHTML = '';
        // Llenar la tabla
        users.forEach((user, index) => {
          const row = document.createElement('tr');
  
          const apodoCell = document.createElement('td');
          apodoCell.textContent = user.apodo;
          row.appendChild(apodoCell);
  
          const docTypeCell = document.createElement('td');
          docTypeCell.textContent = getDocumentTypeFullName(user.documentType);
          row.appendChild(docTypeCell);
  
          const docNumberCell = document.createElement('td');
          docNumberCell.textContent = user.documentNumber;
          row.appendChild(docNumberCell);
  
          const userCell = document.createElement('td');
          userCell.textContent = user.user;
          row.appendChild(userCell);
  
          const passwordCell = document.createElement('td');
          passwordCell.textContent = user.password;
          row.appendChild(passwordCell);
  
          const actionsCell = document.createElement('td');
  
          // Botón de Editar
          const editBtn = document.createElement('button');
          editBtn.textContent = 'Editar';
          editBtn.classList.add('action-btn', 'edit-btn');
          editBtn.addEventListener('click', () => {
            editUser(index);
          });
          actionsCell.appendChild(editBtn);
  
          // Botón de Eliminar
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Eliminar';
          deleteBtn.classList.add('action-btn', 'delete-btn');
          deleteBtn.addEventListener('click', () => {
            deleteUser(index);
          });
          actionsCell.appendChild(deleteBtn);
  
          row.appendChild(actionsCell);
  
          usersTableBody.appendChild(row);
        });
      });
    }
  
    // Función para editar un usuario
    function editUser(index) {
      chrome.storage.local.get(['--extension--users'], (result) => {
        const users = result['--extension--users'] || [];
        if (index >= 0 && index < users.length) {
          const user = users[index];
          document.getElementById('apodo').value = user.apodo;
          document.getElementById('documentType').value = user.documentType;
          document.getElementById('documentNumber').value = user.documentNumber;
          document.getElementById('user').value = user.user;
          document.getElementById('password').value = user.password;
          document.getElementById('user-index').value = index;
          userForm.querySelector('button[type="submit"]').textContent = 'Actualizar Usuario';
          cancelEditBtn.style.display = 'inline-block';
          console.log(`Editando usuario en el índice ${index}.`);
        } else {
          console.error('Índice de usuario inválido para editar.');
        }
      });
    }
  
    // Función para eliminar un usuario
    function deleteUser(index) {
      if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        chrome.storage.local.get(['--extension--users'], (result) => {
          const users = result['--extension--users'] || [];
          if (index >= 0 && index < users.length) {
            const removedUser = users.splice(index, 1)[0];
            chrome.storage.local.set({ '--extension--users': users }, () => {
              console.log(`Usuario '${removedUser.apodo}' eliminado.`);
              loadUsers();
            });
          } else {
            console.error('Índice de usuario inválido para eliminar.');
          }
        });
      }
    }
  
    // Función para obtener el nombre completo del tipo de documento
    function getDocumentTypeFullName(abbreviation) {
      const types = {
        'NIT': 'NIT',
        'CC': 'Cédula de Ciudadanía',
        'CE': 'Cédula de Extranjería',
        'PAS': 'Pasaporte',
        'PNN': 'ID Extranjero Persona Natural',
        'PJN': 'ID Extranjero Persona Jurídica',
        'FC': 'Fideicomiso',
        'CD': 'Carné Diplomático',
        'TI': 'Tarjeta de Identidad',
        'RC': 'Registro Civil'
      };
      return types[abbreviation] || abbreviation;
    }
  });
  
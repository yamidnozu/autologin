// background.js

const DEFAULT_USERS = [
    {
      apodo: 'pricing51',
      documentType: 'CC',
      documentNumber: '2024021902',
      user: 'pricing51',
      password: 'pricingPASSWORD05#',
    },
    {
      apodo: 'pricing05',
      documentType: 'CC',
      documentNumber: '1998233207',
      user: 'pricing05',
      password: 'pricingPASSWORD05#',
    },
    {
      apodo: 'pricing52',
      documentType: 'CC',
      documentNumber: '1998233677',
      user: 'pricing52',
      password: 'pricingPASSWORD05#',
    },
    {
      apodo: 'filiales07',
      documentType: 'CC',
      documentNumber: '2024021906',
      user: 'filiales07',
      password: 'ABCD12345#ed2#',
    },
    {
      apodo: 'pricing57',
      documentType: 'CC',
      documentNumber: '1998233207',
      user: 'pricing57',
      password: 'pricingPASSWORD05#',
    }
  ];
  
  // Inicializar usuarios por defecto al instalar la extensión
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['--extension--users'], (result) => {
      if (!result['--extension--users']) {
        chrome.storage.local.set({ '--extension--users': DEFAULT_USERS }, () => {
          console.log('Usuarios por defecto han sido establecidos.');
        });
      }
    });
  
    createContextMenu();
  });
  
  // Función para crear el menú contextual
  function createContextMenu() {
    // Eliminar todos los menús existentes para evitar duplicados
    chrome.contextMenus.removeAll(() => {
      // Crear el menú principal
      chrome.contextMenus.create({
        id: 'iniciar-sesion-con',
        title: 'Iniciar sesión con:',
        contexts: ['page'],
        documentUrlPatterns: [
          'https://canalnegocios-qa.apps.ambientesbc.com/*',
          'http://localhost:9000/*'
        ]
      }, () => {
        // Después de crear el menú principal, crear los submenús con los usuarios
        chrome.storage.local.get(['--extension--users'], (result) => {
          const users = result['--extension--users'] || [];
          users.forEach((user, index) => {
            chrome.contextMenus.create({
              id: `user-${index}`,
              parentId: 'iniciar-sesion-con',
              title: user.apodo,
              contexts: ['page'],
              documentUrlPatterns: [
                'https://canalnegocios-qa.apps.ambientesbc.com/*',
                'http://localhost:9000/*'
              ]
            });
          });
          console.log('Menús contextuales de usuarios creados.');
        });
      });
    });
  }
  
  // Escuchar cambios en el almacenamiento para actualizar los menús contextuales
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes['--extension--users']) {
      createContextMenu();
    }
  });
  
  // Manejar los clics en el menú contextual
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith('user-')) {
      const userIndex = parseInt(info.menuItemId.split('-')[1], 10);
      chrome.storage.local.get(['--extension--users'], (result) => {
        const users = result['--extension--users'] || [];
        const selectedUser = users[userIndex];
        if (selectedUser && tab.id) {
          console.log(`Usuario seleccionado: ${selectedUser.apodo}`);
          chrome.tabs.sendMessage(tab.id, { action: 'login', user: selectedUser }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error al enviar mensaje al content script:', chrome.runtime.lastError);
            } else {
              console.log('Mensaje enviado al content script.');
            }
          });
        }
      });
    }
  });
  
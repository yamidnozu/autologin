// background.js

const DEFAULT_USERS = [
  {
    apodo: 'pricing51 (⚡ Token: SI, Privilegio: Ejecutor directo, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing51',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing05 (⚠️ adicional)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing05',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing52 (⚡ Token: SI, Privilegio: Aprobador, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing52',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'filiales07 (⭕ adicional)',
    documentType: 'CC',
    documentNumber: '2024021906',
    user: 'filiales07',
    password: 'ABCD12345#ed2',
  },
  {
    apodo: 'pricing57 (⭕ adicional)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing57',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing53 (⚡ Token: SI, Privilegio: Aprobador, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing53',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing54 (⚡ Token: SI, Privilegio: Preparador, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing54',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing55 (⚡ Token: SI, Privilegio: Preparador, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing55',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing56 (⚡ Token: SI, Privilegio: Consulta, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1998233207',
    user: 'pricing56',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing08 (⚡ Token: SI, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1998055570',
    user: 'pricing08',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing09 (⚡ Token: SI, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273730',
    user: 'pricing09',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing00 (⚡ Token: SI, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273731',
    user: 'pricing00',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing50 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273727',
    user: 'pricing50',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing60 (⚡ Token: SI, Privilegio: Ejecutor directo, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1928273732',
    user: 'pricing60',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing61 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273728',
    user: 'pricing61',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing65 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273734',
    user: 'pricing65',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing63 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273738',
    user: 'pricing63',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing64 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Esencial)',
    documentType: 'CC',
    documentNumber: '1928273736',
    user: 'pricing64',
    password: 'pricingPASSWORD05#',
  },
  {
    apodo: 'pricing66 (⚡ Token: NO, Privilegio: Ejecutor directo, Plan: Plus)',
    documentType: 'CC',
    documentNumber: '1928273735',
    user: 'pricing66',
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
        // Después de crear el menú principal, crear los submenús

        // **1. Crear el submenú "Gestionar usuarios" como el primer elemento**
        chrome.contextMenus.create({
          id: 'manage-users',
          parentId: 'iniciar-sesion-con',
          title: 'Gestionar usuarios',
          contexts: ['page'],
          documentUrlPatterns: [
            'https://canalnegocios-qa.apps.ambientesbc.com/*',
            'http://localhost:9000/*'
          ]
        }, () => {
          // **2. Crear los submenús de usuarios después de "Gestionar usuarios"**
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
    if (info.menuItemId === 'manage-users') {
      // **3. Abrir la página de opciones cuando se hace clic en "Gestionar usuarios"**
      chrome.runtime.openOptionsPage();
    } else if (info.menuItemId.startsWith('user-')) {
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

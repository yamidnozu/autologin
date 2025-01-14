chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'login' && request.user) {
    const user = request.user;
    console.log(`Recibido comando de inicio de sesión para el usuario: ${user.apodo}`);
    const currentPath = window.location.pathname;
    const loginPath = '/ingreso/empresa';

    if (currentPath === loginPath) {
      performLogin(user);
    } else {
      console.log('No estás en la página de login. Redirigiendo...');
      // Guardar el usuario para iniciar sesión después de la redirección
      chrome.storage.local.set({ '--extension--pending-login': user }, () => {
        console.log('Usuario para login guardado en storage.');
        // Determinar la URL de redireccionamiento
        let loginUrl = '';
        if (window.location.origin.includes('localhost:9000')) {
          loginUrl = 'http://localhost:9000/ingreso/empresa';
        } else if (window.location.origin.includes('canalnegocios-qa.apps.ambientesbc.com')) {
          loginUrl = 'https://canalnegocios-qa.apps.ambientesbc.com/ingreso/empresa';
        }

        if (loginUrl) {
          window.location.href = loginUrl;
        } else {
          console.error('No se pudo determinar la URL de login.');
        }
      });
    }
    sendResponse({ status: 'Login process initiated' });
  }
});

// Al cargar la página, verificar si hay un login pendiente
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['--extension--pending-login'], (result) => {
    const user = result['--extension--pending-login'];
    if (user) {
      console.log(`Login pendiente para el usuario: ${user.apodo}`);
      // Realizar el login
      performLogin(user);
      // Limpiar la marca de login pendiente
      chrome.storage.local.remove(['--extension--pending-login'], () => {
        console.log('Login pendiente eliminado del storage.');
      });
    }
  });
});

// Función para esperar la existencia de un elemento en el DOM
function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      obs.disconnect();
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

// Función para realizar los pasos de inicio de sesión
function performLogin(user) {
  console.log('Iniciando proceso de inicio de sesión...');

  // Paso 1: Expandir el menú desplegable
  const expandMenu = () => {
    waitForElement(".bc-input-select-v2-combobox", (menu) => {
      menu.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      console.log("Menú desplegable expandido.");
    });
  };

  // Paso 2: Seleccionar el tipo de documento
  const selectDocumentType = () => {
    waitForElement(`.bc-float-menu-option[data-value='${user.documentType}']`, (docTypeElement) => {
      if (docTypeElement) {
        docTypeElement.click();
        console.log(`Tipo de documento '${user.documentType}' seleccionado.`);
      } else {
        console.error(`Elemento para tipo de documento '${user.documentType}' no encontrado.`);
      }
    });
  };

  // Paso 3: Agregar el número de documento
  const fillDocumentNumber = () => {
    waitForElement("input[formcontrolname='companyDocumentNumber']", (inputField) => {
      if (inputField) {
        inputField.value = user.documentNumber;
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
        console.log(`Número de documento '${user.documentNumber}' ingresado.`);
      } else {
        console.error("Campo 'companyDocumentNumber' no encontrado.");
      }
    });
  };

  // Paso 4: Esperar que el botón 'Continuar' se habilite y hacer clic
  const waitForButtonAndClick = () => {
    waitForElement("#bc-mf_authentication-bc_login_company-bc_button_primary-continue", (button) => {
      if (button) {
        if (!button.disabled) {
          button.click();
          console.log("Botón 'Continuar' clickeado.");
          waitForRouteChange();
        } else {
          console.log("Botón 'Continuar' está deshabilitado. Reintentando en 500ms...");
          setTimeout(waitForButtonAndClick, 500);
        }
      } else {
        console.error("Botón 'Continuar' no encontrado.");
      }
    });
  };

  // Paso 5: Esperar que cambie la ruta
  const waitForRouteChange = () => {
    const interval = setInterval(() => {
      const titleElement = document.querySelector("h5#titleLogin");
      const successElement = document.querySelector("#svnMenuV2");
      const errorInput = document.querySelector("input.bc-input-error[formcontrolname='user']");

      if (successElement) {
        clearInterval(interval);
        console.log("Acceso exitoso: elemento #svnMenuV2 encontrado.");
      
      } else if (errorInput) {
        clearInterval(interval);
        console.log("Fallo al ingresar: error en el campo 'Usuario'. Redirigiendo...");
      
        window.location.href = (window.location.origin.includes('localhost:9000')) ? 
          'http://localhost:9000/ingreso/empresa' : 
          'https://canalnegocios-qa.apps.ambientesbc.com/ingreso/empresa';
      } else if (titleElement && titleElement.textContent.includes("Iniciar sesión")) {
        clearInterval(interval);
        console.log("Ruta cambiada correctamente. Procediendo al formulario de inicio de sesión.");
        interactWithLogin(user);
      }
    }, 500);
  };

  // Paso 6: Completar el formulario de inicio de sesión e ingresar
  const interactWithLogin = (user) => {
    // Esperar y llenar el campo de usuario
    waitForElement("input[formcontrolname='user']", (userInput) => {
      if (userInput) {
        userInput.value = user.user;
        userInput.dispatchEvent(new Event("input", { bubbles: true }));
        console.log(`Usuario '${user.user}' ingresado.`);
      } else {
        console.error("Campo de usuario no encontrado.");
      }
    });

    // Esperar y llenar el campo de contraseña
    waitForElement("input[formcontrolname='password']", (passwordInput) => {
      if (passwordInput) {
        passwordInput.value = user.password;
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
        console.log(`Password ingresado.`);
      } else {
        console.error("Campo de contraseña no encontrado.");
      }
    });

    // Esperar que el botón 'Ingresar' se habilite y hacer clic
    const waitForLoginButton = () => {
      waitForElement("#bc-mf_authentication-bc_login_migrate-bc_button_primary-login", (loginButton) => {
        if (loginButton) {
          if (!loginButton.disabled) {
            setTimeout(() => {
              loginButton.click();
              console.log("Botón 'Ingresar' clickeado.");
              waitForSuccessOrError();
            }, 1000);
          } else {
            console.log("Botón 'Ingresar' está deshabilitado. Reintentando en 500ms...");
            setTimeout(waitForLoginButton, 500);
          }
        } else {
          console.error("Botón 'Ingresar' no encontrado.");
        }
      });
    };

    waitForLoginButton();
  };

  // Paso 7: Verificar éxito o error después del intento de inicio de sesión
  const waitForSuccessOrError = () => {
    const interval = setInterval(() => {
      const successElement = document.querySelector("#svnMenuV2");
      const errorInput = document.querySelector("input.bc-input-error[formcontrolname='user']");

      if (successElement) {
        clearInterval(interval);
        console.log("Acceso exitoso: elemento #svnMenuV2 encontrado.");
        
      } else if (errorInput) {
        clearInterval(interval);
        console.log("Fallo al ingresar: error en el campo 'Usuario'. Redirigiendo...");
        
        window.location.href = (window.location.origin.includes('localhost:9000')) ? 
          'http://localhost:9000/ingreso/empresa' : 
          'https://canalnegocios-qa.apps.ambientesbc.com/ingreso/empresa';
      }
    }, 500);
  };

  // Ejecutar los pasos secuencialmente con retrasos para asegurar la correcta ejecución
  expandMenu();
  setTimeout(selectDocumentType, 100);
  setTimeout(fillDocumentNumber, 200);
  setTimeout(waitForButtonAndClick, 300);
}

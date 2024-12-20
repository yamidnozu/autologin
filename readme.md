# Auto Login Extension

Una extensión para automatizar el proceso de inicio de sesión en sitios específicos. Compatible con Google Chrome y Microsoft Edge.

## Características

- Inicio de sesión rápido mediante menú contextual
- Gestión de múltiples usuarios
- Compatibilidad con diferentes tipos de documentos
- Interfaz intuitiva para administrar usuarios
- Compatible con Chrome y Edge

## Instalación

### Google Chrome

1. Clona este repositorio:
```bash
git clone https://github.com/yamidnozu/autologin.git
```

2. Abre Chrome y navega a `chrome://extensions/`

3. Activa el "Modo desarrollador" en la esquina superior derecha

4. Haz clic en "Cargar descomprimida" y selecciona la carpeta del proyecto clonado

### Microsoft Edge

1. Clona este repositorio:
```bash
git clone https://github.com/yamidnozu/autologin.git
```

2. Abre Edge y navega a `edge://extensions/`

3. Activa el "Modo desarrollador" usando el switch en el lado izquierdo

4. Haz clic en "Cargar descomprimida" y selecciona la carpeta del proyecto clonado

### Verificación de Instalación

1. Verifica que la extensión aparezca en la barra de herramientas del navegador
2. Si no la ves, haz clic en el ícono de extensiones (puzzle) y fija la extensión a la barra

## Uso

### Inicio de Sesión Rápido

1. Navega a cualquiera de los sitios soportados:
   - https://canalnegocios-qa.apps.ambientesbc.com/
   - http://localhost:9000/

2. Haz clic derecho en cualquier parte de la página

3. Selecciona "Iniciar sesión con:" y elige el usuario deseado del menú desplegable

### Gestión de Usuarios

1. Accede a la configuración de la extensión de dos formas:
   - Haz clic derecho > "Iniciar sesión con:" > "Gestionar usuarios"
   - O desde el navegador:
     * Chrome: menú de extensiones > Auto Login Extension > ícono de configuración
     * Edge: menú de extensiones > Auto Login Extension > ícono de configuración

2. En la página de gestión puedes:
   - Agregar nuevos usuarios
   - Editar usuarios existentes
   - Eliminar usuarios
   - Ver todos los usuarios registrados

#### Agregar/Editar Usuario

Para agregar un nuevo usuario o editar uno existente, necesitarás proporcionar:

- Apodo: Un nombre corto para identificar al usuario
- Tipo de documento: (CC, NIT, CE, etc.)
- Número de documento
- Usuario
- Contraseña

## Sitios Compatibles

La extensión funciona en:
- https://canalnegocios-qa.apps.ambientesbc.com/
- http://localhost:9000/

## Estructura del Proyecto

```
├── background.js    - Manejo de eventos y menú contextual
├── content.js       - Lógica de automatización de login
├── manifest.json    - Configuración de la extensión
├── options.html     - Interfaz de gestión de usuarios
└── options.js       - Lógica de gestión de usuarios
```

## Solución de Problemas Comunes

### Chrome
- Si la extensión no aparece, verifica que el "Modo desarrollador" esté activado
- Si los cambios no se reflejan, usa el botón "Actualizar" en chrome://extensions/

### Edge
- Si la extensión no carga, verifica que todos los archivos estén en la carpeta correcta
- Para recargar la extensión, usa el botón "Recargar" en edge://extensions/

## Seguridad

- Las credenciales se almacenan localmente en el navegador
- Solo funciona en los dominios especificados
- No se envían datos a servidores externos
- La extensión funciona igual de segura tanto en Chrome como en Edge

## Versión

Versión actual: 1.1

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu función: `git checkout -b feature/nueva-funcion`
3. Commit tus cambios: `git commit -am 'Agrega nueva función'`
4. Push a la rama: `git push origin feature/nueva-funcion`
5. Crea un Pull Request
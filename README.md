# Javier Velardez | Web para GitHub Pages

Sitio estático listo para subir al repositorio. No necesita instalación ni compilación.

## Publicar

1. Descomprimir el ZIP.
2. Subir su contenido al repositorio: `index.html`, `styles.css`, `app.js`, la carpeta `assets/` y los archivos que acompañan la web. `index.html` debe quedar en la raíz del repositorio, no dentro de una carpeta adicional.
3. En el repositorio, entrar en **Settings > Pages**.
4. En **Source**, elegir **Deploy from a branch**.
5. Seleccionar la rama donde se cargaron los archivos, normalmente **main**, y la carpeta **/(root)**. Guardar.
6. Revisar el despliegue y abrir la URL que GitHub muestre como publicada. Todavía no se conoce esa URL porque falta el repositorio de destino.

GitHub Pages está disponible con GitHub Free en repositorios públicos. Verificar las opciones del plan si se elige un repositorio privado.

## Dominio

Cuando Javier tenga el dominio, configurarlo en **Settings > Pages > Custom domain** y cargar los registros DNS indicados por GitHub. Configurar HTTPS cuando esté disponible. No se incluye un archivo CNAME con un dominio inventado.

Cuando tengamos la dirección definitiva, agregar a `index.html` la URL canónica y la imagen de vista previa con sus direcciones absolutas finales.

## Contacto y calendario

El correo actual es `vconstructivo@gmail.com`, tomado del CV aportado. Javier debe confirmar que quiere usarlo como canal comercial.

Horarios de Argentina: lunes a viernes de 10 a 12 h para teléfono o videollamada, de 16 a 19 h para entrevistas, reuniones y visitas, y sábados de 9 a 12 h por acuerdo previo. Domingos sin atención.

El calendario permite proponer una fecha de lunes a sábado y adapta las franjas al tipo de encuentro. El formulario prepara un mensaje y da la opción de abrir el correo del visitante para enviarlo. No confirma una visita, no verifica disponibilidad y no guarda datos en un servidor.

Para conectar una agenda real, agregar el enlace HTTPS de reservas de Javier en `bookingUrl`, dentro de `SITE_CONFIG` en `app.js`. El sitio mostrará el acceso a esa agenda.

## Identidad e imágenes

La web utiliza la identidad visual preparada para Javier y su retrato aportado para la presentación profesional. La imagen arquitectónica está identificada como ilustrativa. La estructura funciona tanto en la ruta de un proyecto de GitHub Pages como en un dominio propio mediante archivos y enlaces relativos.

## Documentación oficial

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages

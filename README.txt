# COMPUGUED — Catálogo digital V1.0

## Archivos
- `index.html`: estructura y contenido.
- `styles.css`: identidad visual y diseño responsive.
- `app.js`: catálogo, filtros, WhatsApp y panel de administración de demostración.

## Cómo probar
1. Descarga y descomprime el paquete.
2. Mantén los tres archivos en la misma carpeta.
3. Abre `index.html` en un navegador moderno. Para una experiencia más fiable, utiliza VS Code con la extensión Live Server.
4. Para abrir el panel, pulsa el pequeño engranaje en la esquina inferior izquierda.
5. Contraseña temporal de demostración: `Compugued2026!`.

## Personalización inicial
En `app.js`, modifica el objeto `CONFIG`:
- `whatsapp`: número comercial con código de país, solo dígitos (ej. 519XXXXXXXX).
- `facebook` e `instagram`: enlaces oficiales.
- `demoAdminPassword`: contraseña temporal local para probar el prototipo.

Los productos iniciales son ficticios y sirven como muestra. Edita o elimina desde el panel.

## Limitaciones importantes de esta V1
Esta entrega es un prototipo frontend funcional, no una tienda desplegable con administración multiusuario:
- Los productos y ajustes se guardan en `localStorage` del navegador donde se hicieron los cambios.
- Los cambios no se sincronizan con otros dispositivos ni con otros visitantes.
- La contraseña del panel está en JavaScript y puede ser inspeccionada. No es autenticación segura.
- Las imágenes se agregan mediante URL pública; no hay carga real de archivos al servidor.
- No hay inventario real, pagos, pedidos persistentes ni base de datos central.
- Los datos y precios de muestra no representan ofertas reales.

**No publiques este prototipo como sistema de administración seguro ni introduzcas datos privados.**

## Antes de publicar
La siguiente etapa técnica debe conectar:
1. Backend y base de datos (por ejemplo Supabase).
2. Autenticación real de administradores.
3. Políticas de autorización en servidor/base de datos (RLS).
4. Almacenamiento de imágenes.
5. Dominio, hosting, HTTPS y copias de seguridad.
6. Validación de precios, disponibilidad, garantía y condiciones comerciales.

La estructura está preparada para evolucionar, pero estas integraciones requieren una fase adicional.

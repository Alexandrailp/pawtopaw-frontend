# PawtoPaw 🐾 - Frontend

Proyecto final desarrollado como una Single Page Application (SPA) que conecta a dueños de mascotas con productos y servicios de cuidadores (*petsitters*).

---

## 🛠️ Tecnologías

- **React 19** + **Vite**
- **React Router DOM v7** (Enrutamiento del lado del cliente)
- **Tailwind CSS** & **Bootstrap** (Diseño responsivo)
- **Context API** (Gestión de estado global)

---

## 🚀 Instalación y Ejecución

Sigue estos pasos en tu terminal para levantar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Alexandrailp/pawtopaw-frontend.git
```

### 2. Entrar a la carpeta del proyecto
```bash
cd pawtopaw-frontend
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar el servidor local
```bash
npm run dev
```

### 5. Abrir la aplicación
Visita en tu navegador: **[http://localhost:5173](http://localhost:5173)**

---

## 📍 Rutas Principales para Evaluar

- **Inicio (`/`):**
  - Carrusel interactivo en el hero.
  - Accesos rápidos en la barra superior (🛍️ filtra productos y 🐕 filtra petsitters con desplazamiento automático).
  - Filtro lateral por categorías (*Todos*, *Productos*, *Petsitter*) y menú para ordenar por precio o popularidad.
- **Autenticación:**
  - Inicio de Sesión (`/login`)
  - Registro (`/registro`)
- **Gestión de Perfil:**
  - Ver Perfil (`/perfil`)
  - Editar Perfil (`/editar-perfil`)
- **Publicaciones:**
  - Crear Publicación (`/crear-publicacion`)
  - Detalle de la Publicación (`/publicacion/:id`)
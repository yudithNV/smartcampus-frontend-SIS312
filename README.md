# SmartCampus - Frontend 🚀

Este es el repositorio del entorno de desarrollo para el frontend del proyecto SmartCampus.


#  Estructura de carpetas recomendada

Crear una carpeta principal llamada `SmartCampus` y dentro colocar ambos repositorios:

```plaintext
SmartCampus/
│
├── frontend/
│   └── Frontend-SmartCampus/
│
├── backend/
│   └── Backend-SmartCampus/
│
└── docker-compose.yml
```

---

# Clonar los repositorios

## Clonar frontend

Ubicarse dentro de la carpeta `frontend/` y ejecutar:

```sh
git clone https://github.com/yudithNV/Frontend-SmartCampus.git
```

---

## Clonar backend

Ubicarse dentro de la carpeta `backend/` y ejecutar:

```sh
git clone https://github.com/yudithNV/Backend-SmartCampus.git
```

---

# Crear el archivo docker-compose.yml

En la carpeta principal `SmartCampus/`, crear un archivo llamado:

```plaintext
docker-compose.yml
```

Y pegar el siguiente contenido:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend/Backend-SmartCampus
      dockerfile: Dockerfile
    container_name: smartcampus-backend
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:6543/postgres?prepareThreshold=0
      - SPRING_DATASOURCE_USERNAME=postgres.edcbvfneafpkzufeabpg
      - SPRING_DATASOURCE_PASSWORD=SmartCampusUCB1223
      - JWT_SECRET=SmartCampusUCBSecretKeyForJWT2024VerySecureAndLongEnoughKey123456789
      - SUPABASE_URL=https://edcbvfneafpkzufeabpg.supabase.co
      - SUPABASE_SERVICE_ROLE_KEY=TU_SUPABASE_SERVICE_ROLE_KEY
      - SPRING_MAIL_USERNAME=TU_CORREO
      - SPRING_MAIL_PASSWORD=TU_PASSWORD
    networks:
      - smartcampus-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend/Frontend-SmartCampus
      dockerfile: Dockerfile
    container_name: smartcampus-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    networks:
      - smartcampus-network
    restart: unless-stopped

networks:
  smartcampus-network:
    driver: bridge
```

---

#  Comandos Docker

## Construir las imágenes

```sh
docker-compose build
```

---

## Levantar todos los servicios

```sh
docker-compose up -d
```

---

## Ver logs de los contenedores

```sh
docker-compose logs -f
```

---

## Verificar contenedores activos

```sh
docker ps
```

---

# Gestión de contenedores

## Detener solo el backend

```sh
docker stop smartcampus-backend
```

---

## Verificar contenedores activos

```sh
docker ps
```

---

## Detener el frontend

```sh
docker stop smartcampus-frontend
```

---

## Iniciar nuevamente el backend

```sh
docker start smartcampus-backend
```

---

## Verificar nuevamente los contenedores

```sh
docker ps
```

---

# URLs del sistema

## Frontend

```plaintext
http://localhost:5173
```

## Backend

```plaintext
http://localhost:8081
# 🌤️ WeatherWise - Backend

The **WeatherWise Backend** is a Node.js and Express-based server that handles:
- User authentication and login
- PostgreSQL database connection and queries
- Routes for saving and retrieving cities

## 🛠️ Tech Stack
- Node.js
- Express
- PostgreSQL
- `pg` npm module for database access
- CORS / body-parser

## 📁 Folder Structure
```
backend/
├── db.js         # PostgreSQL connection pool setup
├── index.js      # Main server and route handlers
```

## 🔧 Setup Instructions
1. Navigate to the `backend` folder:
   ```bash
   cd react_app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (if used) and set DB credentials:
   ```env
   DB_USER=youruser
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=weatherwise
   ```

4. Run the server:
   ```bash
   node index.js
   ```

## 🔌 API Endpoints
- `POST /login` — Authenticate user
- `POST /register` — Register user
- `POST /addCity` — Save city for user
- `GET /cities?username=...` — Get saved cities

## 👨‍💻 Developer Info
**Name**: Jison Joseph Sebastian  
📬 [Contact me](https://myporfolio-1o1h.onrender.com/contact)
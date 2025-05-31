
# 🌦️ WhetherWise

WhetherWise is a full-stack weather dashboard application that allows users to:
- Create an account and log in
- Add and save cities to their dashboard
- View real-time weather data fetched from the OpenWeatherMap API

---

## 🧱 Project Structure

```
WHETHERWISE/
├── react_app/
│   ├── backend/
│   │   ├── db.js                 # Database connection using PostgreSQL
│   │   ├── index.js              # Express server setup and API routes
│   │   ├── package.json          # Backend dependencies and scripts
│   ├── frontend/
│   │   ├── build/                # Production build (auto-generated)
│   │   ├── node_modules/         # Frontend dependencies
│   │   ├── public/               # Static files
│   │   ├── src/
│   │   │   ├── components/       # React components (Login, Dashboard, Profile, etc.)
│   │   │   ├── styles/           # CSS files for styling (e.g., login.css, dashboard.css)
│   │   │   ├── App.js            # Root React component
│   │   │   ├── index.js          # Entry point for React app
│   │   │   ├── index.css         # Global styles
│   ├── package.json              # Frontend dependencies and scripts
│   ├── README.md                 # Project documentation
```

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure login using PostgreSQL for storing credentials
  - Unique city list per user

- ☁️ **Weather Dashboard**
  - Search bar for adding cities
  - Displays temperature, weather icon, and description
  - Connects to OpenWeatherMap API

- 📦 **Backend**
  - Express.js server with RESTful API routes
  - PostgreSQL database connection

- 🎨 **Frontend**
  - Built using React.js
  - Responsive UI
  - CSS modularized in `styles/` folder

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/nosij-playz/WeatherWise.git
cd WhetherWise/react_app
```

### 2. Setup PostgreSQL

Create a database and update your `backend/db.js` connection string.

```sql
CREATE DATABASE whetherwise;
```

Create tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) REFERENCES users(username),
  city_name VARCHAR(255) NOT NULL
);
```

### 3. Install Dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

---

## 🧪 Running the App

### Start Backend
```bash
cd backend
node index.js
```

### Start Frontend
```bash
cd ../frontend
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in `backend/`:

```
PORT=5000
DATABASE_URL=postgres://youruser:yourpassword@localhost:5432/whetherwise
```

In `frontend/src`, for weather API:

```
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

---

## 📌 Technologies Used

- React.js
- Node.js + Express
- PostgreSQL
- OpenWeatherMap API
- CSS Modules

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---



## 👨‍💻 Developer

Developed by **Jison Joseph Sebastian**

For queries and suggestions, feel free to reach out via my portfolio contact page:

🔗 [Contact Me](https://myporfolio-1o1h.onrender.com/contact)

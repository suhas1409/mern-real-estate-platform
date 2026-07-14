# 🏠 Real Estate Platform

A full-stack real estate web application built using the MERN stack that allows users to browse, search, save, and manage property listings. The platform also includes real-time messaging between property owners and interested users.

## ✨ Features

- User registration and login
- JWT-based authentication
- Create property listings
- Update property listings
- Delete property listings
- Search and filter properties
- Filter by city, property type, price, and bedrooms
- Save and remove favorite properties
- Dedicated favorites page
- Real-time chat between users and property owners
- Real-time message notifications
- Property image uploads using Cloudinary
- Interactive property maps using Leaflet
- Responsive design for desktop, tablet, and mobile devices
- User profile management

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- JavaScript
- SCSS
- Axios
- Zustand
- React Quill
- React Leaflet
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Prisma ORM
- MongoDB
- JWT Authentication
- bcrypt

### Real-Time Communication

- Socket.IO

### Cloud Services

- MongoDB Atlas
- Cloudinary

## 📁 Project Structure

```text
mern-real-estate-platform/
│
├── api/                    # Express.js backend
│   ├── controller/
│   ├── lib/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   └── app.js
│
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── routes/
│
├── socket/                 # Socket.IO server
│   └── app.js
│
└── README.md

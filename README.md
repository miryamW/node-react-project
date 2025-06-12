# Service Provider Business Management Web App

A full-stack web application for managing a private service provider business (e.g., psychologist, cosmetician).  
Built with **React (TypeScript)** for the frontend and **Node.js (TypeScript)** with **Express** for the backend.

## ✨ Features

### 👤 User Interface
- Homepage with general information and promotional content about the business.
- Book an appointment with the following details:
  - Service type
  - Date and time
  - Note to the business owner
  - Customer name
  - Customer phone number
- Appointment requests are added to the admin's appointment list.
- Users cannot cancel appointments directly — they must message the business owner.
- Optional: Send general messages to the business owner.

### 🔐 Admin Interface (`/admin`)
Accessible only with a valid username and password.

Includes the following management pages:
- **Business Info**: Address, contact methods, etc.
- **Services**: Define service types with description, price, and duration.
- **Appointments**: View, add, edit, or delete scheduled appointments.
- **Customers**: View list of clients who booked appointments.
- **Messages** *(optional upgrade)*: View and respond to messages from users.

## 🛠 Tech Stack

### Frontend
- React with TypeScript
- React Router
- Axios (for API calls)

### Backend
- Node.js with Express (TypeScript)
- JWT Authentication
- MongoDB (via Mongoose) or any other database (configurable)




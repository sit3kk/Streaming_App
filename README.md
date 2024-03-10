# 🎥 Streaming App Overview

The Streaming App provides a versatile platform that enables users to create thematic rooms, broadcast video content and chatting.

## 🛠 Technologies Used

### Backend
- **Language:** Python 🐍
- **Framework:** Django 🌟

### Frontend
- **Languages:** JavaScript (TypeScript) 📜
- **Framework:** React ⚛️
- **Styling:** Tailwind CSS 🌬️

### Database
- **Type:** SQLite 📁

### Streaming Module
- **Technology:** WebRTC 📡
- **SFU Server:** [Ion-SFU](https://github.com/ionorg/ion-sfu) 🚀

### Deployment
- **Containerization:** Docker 🐳
- **Web Server:** Nginx ✳️

## Key Features

### 🔒 Authentication
Utilizes Django's built-in authentication for session management and CSRF protection, ensuring a secure user experience.

- Secure User Identification
- Protection Against CSRF Attacks
- Customizable Authentication Flow

<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/33ce8a5b-fe31-47c1-ad75-b04ff17036de" style="width: 700px;">

### 🚪 Private Rooms
Allows users to create password-protected rooms with custom tokens for added security and privacy.

<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/a7c42976-0bea-494f-8682-563e7cb59585" style="width: 700px;">

### 🔐 Security Tokens
Implements various tokens for enhanced security, including CSRF, SessionId, and RoomId.

<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/c1368e79-49cb-469c-b968-f85534e76e14" style="width: 700px;">
<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/15d1755a-2d2d-4f55-91d7-e1391593288b" style="width: 700px;">

### 🌐 WebRTC with SFU Server
Employs the SFU server model for efficient, low-latency broadcasting.

<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/37f40559-4536-426c-8e9b-efed01f6048f" style="width: 700px;">

### ☎️ Django Channels
This Django feature has been used to let sending messages between users, checking online watchers and following count of users live in each stream. 

<p align="left">
  <img src="https://github.com/sit3kk/Streaming_App/assets/69002597/05ae3925-a030-47b6-88b7-8a38d40be856" alt="Screenshot from 2024-03-10 14-29-54" style="height: 860px;">
  <img src="https://github.com/sit3kk/Streaming_App/assets/69002597/38a65092-3c7d-499d-872e-2456c343bd5a" alt="Screenshot from 2024-03-10 14-29-25" style="height: 860px;">
</p>

### 📄 Architecture Overview
Illustrates the app's network architecture and communication flow.

<img src="https://github.com/sit3kk/Streaming_App/assets/69002597/9295f6ef-6edf-4e96-ba9b-ecc4d8efb18f" alt="Screenshot from 2024-03-10 14-29-25" style="width: 700px;">

## Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sit3kk/Streaming_App.git
   
2. **Backend**
    ```bash
   cd Streaming_App
   sudo docker-compose up --build

3. **Frontend**
    ```bash
   cd Streaming_App/reactapp
   yarn start

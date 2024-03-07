# 🎥 Streaming App

The **Streaming App** offers a robust platform for users to **broadcast video and audio content** in a one-to-many relationship. This document outlines the technologies used in the development of both the backend and frontend of the application, as well as the database, streaming module, deployment strategy, and authentication methods.

## 🛠 Technologies Used

### Backend
- **Language:** Python 🐍
- **Framework:** Django 🌟


### Frontend
- **Languages:** JavaScript (TypeScript) 📜
- **Framework:** React ⚛️
- **Styling:** Tailwind CSS 🌬️

### Database
- **Database:** SQLite 📁


### Streaming Module
- **Technology:** WebRTC 📡
- **SFU Server:** [Ion-SFU](https://github.com/ionorg/ion-sfu) 🚀

### Deployment
- **Containerization:** Docker 🐳


## 🌟 Features

## 🔒 Authentication

Authentication within the Streaming App is handled through Django's built-in authentication system, utilizing sessions for securely managing user sessions and access control. This approach ensures that user data and access tokens are securely handled, providing a reliable and secure user experience.

Django's session-based authentication system allows for the easy management of user sessions and authentication states across the application. It enables the application to identify returning users and customize user experiences based on their authentication status.

### Session-Based Authentication Features:
- **Secure User Identification:** Ensures that user sessions are securely managed and users are correctly identified during their interactions with the app.
- **Protection Against CSRF Attacks:** Utilizes CSRF tokens to protect against Cross-Site Request Forgery, enhancing the security of user data and interactions.
- **Customizable Authentication Flow:** Allows for the customization of the authentication process, including login, logout, and password management, to suit the specific needs of the application and its users.

![Session Authentication](https://github.com/sit3kk/Streaming_App/assets/69002597/33ce8a5b-fe31-47c1-ad75-b04ff17036de)

This secure and flexible authentication system is a key component of the Streaming App, ensuring that users can safely access and interact with the platform.




### Private Rooms 

- Users can create private rooms protected by passwords.
- Access to these rooms is controlled through custom tokens, enhancing security and privacy.

![Private Rooms](https://github.com/sit3kk/Streaming_App/assets/69002597/a7c42976-0bea-494f-8682-563e7cb59585)

### Security Tokens 🔐
- The application implements CSRF, SessionId, and RoomId tokens for enhanced security measures.
- These tokens ensure that communication and access are securely managed, protecting against unauthorized access and cross-site request forgery attacks.

![CSRF, SessionId, and RoomId Tokens](https://github.com/sit3kk/Streaming_App/assets/69002597/c1368e79-49cb-469c-b968-f85534e76e14)
![Room Tokens](https://github.com/sit3kk/Streaming_App/assets/69002597/15d1755a-2d2d-4f55-91d7-e1391593288b)

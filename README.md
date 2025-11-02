# APSIT Alumni Connect

A complete, full-stack social and professional networking platform built from scratch for the students and alumni of APSIT. This application provides a secure, role-based environment for connecting, sharing opportunities, and building a community.

**Live Demo:** [Link to your deployed site] *(I will add this later when I deploy it!)*

---

## ✨ Key Features

This platform is built with a secure backend API and a dynamic React frontend.

* **Secure Authentication:** Full user registration and login system using JSON Web Tokens (JWT).
* **Role-Based Access:** Three distinct roles (Student, Alumni, Admin) with different permissions.
* **Real-time Form Validation:** Secure password strength rules (uppercase, lowercase, number, special character) and name validation (no numbers) that check as you type.
* **Modern Profile System:** Users can view and edit their profiles, including adding/removing skills, work experience, and education history from a sleek, modern UI.
* **Interactive Alumni Network:**
    * Search for other students and alumni by name, branch, or role.
    * Clear visual distinction between Student and Alumni users.
    * Send, cancel, accept, or reject connection requests with a "smart" button system.
* **Job Board:**
    * Alumni can post new job opportunities.
    * All users can view and filter available jobs.
    * Admins can delete any job posting.
* **Events System:**
    * Alumni can create new events.
    * All users can see and register for upcoming events.
    * A "smart" button shows "Registered" if the user has already signed up.
    * Admins can delete any event.
* **Admin Dashboard:**
    * A secure, private dashboard for `ROLE_ADMIN` users only.
    * View platform statistics (total users, jobs, events) with interactive charts.
    * Search, view, and permanently delete any user from the database.
    * A complete workflow to review and approve/reject student-to-alumni verification requests.

---

## 🚀 Tech Stack

### Backend (Java Spring Boot)
* **Framework:** Spring Boot
* **Security:** Spring Security 6, JSON Web Tokens (JWT)
* **Database:** Spring Data JPA, Hibernate, MySQL
* **API:** Spring Web (RESTful APIs)
* **Build Tool:** Maven

### Frontend (React)
* **Framework:** React 18 (with Hooks)
* **Routing:** React Router DOM
* **State Management:** React Context API (for Auth)
* **API Client:** Axios
* **Charting:** Recharts
* **UI Libraries:** React Icons, React Slick (Carousel)

---

## 🖥️ How to Run Locally

### Prerequisites
* Java JDK 17+
* MySQL Server
* Node.js & npm

### 1. Backend Setup (`apsit-connect`)

1.  **Create Database:**
    * Log in to MySQL and create a new database:
        ```sql
        CREATE DATABASE apsit_alumni_db;
        ```
2.  **Configure Properties:**
    * Go to `apsit-connect/src/main/resources/application.properties`.
    * Update `spring.datasource.username` and `spring.datasource.password` to match your MySQL credentials.
3.  **Run the Backend:**
    * Open a terminal inside the `apsit-connect` folder.
    * Run the command:
        ```bash
        mvn clean spring-boot:run
        ```
    * The backend will start on `http://localhost:8080`.

### 2. Frontend Setup (`frontend`)

1.  **Install Dependencies:**
    * Open a *second* terminal inside the `frontend` folder.
    * Run the command:
        ```bash
        npm install
        ```
2.  **Run the Frontend:**
    * In the same terminal, run:
        ```bash
        npm start
        ```
    * Your browser will automatically open to `http://localhost:3000`.

### 3. Sample Users

You can use the provided SQL scripts or register new users. The master password for all sample users is `Password123!`.

* **Admin:** `admin@apsit.com`
* **Alumni:** `priya.sharma@gmail.com`, `rohan.gupta@yahoo.com`, `karan.jain@gmail.com`
* **Students:** `aarav.singh@apsit.edu.in`, `bhavesh.jalalbisht@apsit.edu.in`

Tournament Creation Application

A full-stack web application for creating tournaments, allowing user registration with profile picture upload, email confirmation, and CRUD operations on user data.

Prerequisites





Node.js



MySQL



Git



Email account with SMTP support (e.g., Gmail with App Password)

Installation





Clone the repository:

git clone <repository-url>
cd tournament-app



Install dependencies:

npm install



Set up MySQL:





Create a database named tournament_app.



Run the following SQL commands:

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



Create a .env file with:

DB_HOST=localhost
DB_USER=root
DB_PASS=your-mysql-password
DB_NAME=tournament_app
EMAIL_USER=your-email
EMAIL_PASS=your-email-password



Create an uploads folder:

mkdir uploads



Install Nodemon globally:

npm install -g nodemon

Running the Application





Start the server:

nodemon server.js



Open http://localhost:5000 in your browser.

Testing APIs





Use Thunder Client (VS Code extension) or Postman to test:





POST /api/users/register - Register a user (form-data: name, email, phone, profile_picture)



GET /api/users - Get all users



PUT /api/users/:id - Update a user



DELETE /api/users/:id - Delete a user



POST /api/tournaments - Create a tournament (JSON: user_id, name)



GET /api/tournaments - Get all tournaments

Features





User registration with profile picture upload using Multer



Email confirmation using Nodemailer



CRUD operations on user data stored in MySQL



Basic tournament creation and listing



Frontend styled with TailwindCSS (CDN)

Troubleshooting





MySQL Access Denied Error:





Ensure MySQL is running: mysql -u root -p



Verify .env file contains correct credentials.



Ensure the tournament_app database and tables are created.



Test connection by hardcoding credentials in server.js temporarily.



Email Sending Issues:





Verify EMAIL_USER and EMAIL_PASS in .env.



For Gmail, use an App Password (generated via Google Account Security).



For non-Gmail emails, use correct SMTP settings (e.g., host and port).
Hello Money - Expenses Tracker
Overview
Hello Money is a modern web application designed to help users track their expenses with ease. Built with React for a dynamic front-end, Prisma for seamless database management, JavaScript for core functionality, and Tailwind CSS for responsive and elegant styling, this app provides an intuitive interface for managing personal finances.
Features

Expense Tracking: Add, edit, and delete expenses with categories and dates.
Dashboard: Visualize spending patterns with summaries and charts.
User Authentication: Secure login and registration for personalized tracking.
Responsive Design: Optimized for both desktop and mobile devices.
Database Integration: Store and retrieve expense data efficiently with Prisma.

Tech Stack

Frontend: React, JavaScript, Tailwind CSS
Backend: Prisma (ORM for database interactions)
Database: Configurable (PostgreSQL, SQLite)
Other Tools: Node.js, npm

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v16 or higher)
npm (v8 or higher)
A database compatible with Prisma (e.g., PostgreSQL, MySQL, or SQLite)
Git

Installation

Clone the Repository:
git clone https://github.com/your-username/hello-money.git
cd hello-money


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory and configure your database connection. Example:
DATABASE_URL="postgresql://user:password@localhost:5432/hellomoney?schema=public"


Set Up Prisma:

Initialize the database schema:npx prisma migrate dev --name init


Generate Prisma client:npx prisma generate




Run the Application:
npm start


Usage

Sign Up/Login: Create an account or log in to access the dashboard.
Add Expenses: Use the form to input expense details (amount, category, date).
View Dashboard: Check spending summaries and visual charts.
Manage Expenses: Edit or delete existing expenses as needed.

Development

Tailwind CSS: Customize styles in src/styles/tailwind.css or directly in JSX using Tailwind's utility classes.
Prisma: Update the database schema in prisma/schema.prisma and run npx prisma migrate dev to apply changes.
React Components: Build reusable components in src/components/ for modularity.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Contributors
* STD24145 : rfi33
* STD24205 : N0mena
* STD24206 : MiotyRenala

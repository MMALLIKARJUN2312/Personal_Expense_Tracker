# Personal Expense Tracker API

A RESTful API to manage personal financial records, allowing users to track income, expenses, retrieve past transactions, and get summaries. This project is built using **Node.js** with **Express.js** for the backend and **SQLite** for data storage.

---

## Table of Contents

1. [Objective](#objective)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Technologies Used](#technologies-used)
5. [Installation and Setup](#installation-and-setup)
6. [Database Setup](#database-setup)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
   - [Register a user](#1-register-a-user)
   - [Authenticate a user](#2-authenticate-a-user)
   - [Create a Transaction](#3-create-a-transaction)
   - [Get All Transactions](#4-get-all-transactions)
   - [Get Transaction by ID](#5-get-transaction-by-id)
   - [Update a Transaction](#6-update-a-transaction)
   - [Delete a Transaction](#7-delete-a-transaction)
   - [Get Transaction Summary](#8-get-transaction-summary)
   - [Get Monthly Report](#9-get-monthly-report)
9. [Postman Screenshots](#postman-screenshots)
10. [Usage](#usage)
11. [Error Handling](#error-handling)
12. [Bonus Features](#bonus-features)

---

## Objective

The purpose of this project is to develop an API that allows users to manage their personal financial records, including tracking income, expenses, and generating financial summaries.

---

## Features

- Add, update, delete, and retrieve transactions (income or expense).
- Retrieve summaries of total income, and expenses.
- SQLite database for simplicity and fast setup.

---

## Requirements

- **Node.js**: 16.x or later
- **Express.js**
- **SQLite**: For local database storage

---

## Technologies Used

- **Backend Framework**: [Node.js](https://nodejs.org) with [Express.js](https://expressjs.com/)
- **Database**: SQLite (using [sqlite3](https://www.npmjs.com/package/sqlite3) package)
- **Tools**: [Postman](https://www.postman.com/) for API testing

---

## Installation and Setup

Follow the below instructions in bash to install and set up necessary dependencies

1. Clone the repository:

git clone [https://github.com/MMALLIKARJUN2312/Personal-Expense-Tracker.git](https://github.com/MMALLIKARJUN2312/Personal_Expense_Tracker)
cd personal-expense-tracker
Initialize the project: Initialize a new Node.js project by running:

2. Initialize the project:

npm init -y
This command quickly creates a package.json file with default values:

3.Install dependencies and necessary packages:

npm install express sqlite3 body-parser cors jsonwebtoken bcrypt

4. Install development dependencies: 

npm install nodemon --save
Install nodemon for automatic server restarts during development:

5. Initialize the database: 

node initializeDB.js
Run the script to initialize the SQLite database


6. Run the application: 

npm start
Start the server using nodemon

---

## Database Setup

This project uses SQLite to store data related to transactions and categories. Below are the database tables used:

### 1. Users Table (`users`)
- **id** (INTEGER): Primary key, auto-incremented.
- **type** (TEXT): The name of user.
- **type** (TEXT): The password for the respective user.

### 2. Transactions Table (`transactions`)
- **id** (INTEGER): Primary key, auto-incremented.
- **type** (TEXT): The type of transaction, either "income" or "expense".
- **category** (TEXT): The category of the transaction (e.g., "salary", "rent").
- **amount** (REAL): The amount of the transaction.
- **date** (TEXT): Date of the transaction in `YYYY-MM-DD` format.
- **description** (TEXT): An optional description for the transaction.

---

## Project Structure

personal_expense_tracker/
│
├── backend/
│   ├── config/
│   │   ├── db.js               // Database connection setup
│   │   └── schema.sql          // SQL script to create tables for users and transactions
│   ├── controllers/
│   │   ├── transactionController.js  // Handles all CRUD operations for transactions
│   │   └── userController.js         // Manages user registration, login, and authentication
│   ├── middleware/
│   │   └── authMiddleware.js         // Middleware to protect routes and verify JWT tokens
│   ├── models/
│   │   └── transactionModel.js       // Contains functions to interact with transactions table in the database
│   ├── routes/
│   │   ├── transactionRoutes.js      // Defines API endpoints for transaction-related operations
│   │   └── userRoutes.js             // Defines API endpoints for user-related operations
│   ├── utils/
│   │   └── initDB.js                 // Initializes the database and creates tables using the schema
│   ├── app.js                        // Main application file that sets up and starts the server
│   ├── package.json                  // Contains project metadata and lists dependencies
│   └── .gitignore                    // Lists files/folders to ignore in version control
│
└── README.md                        // Documentation file with setup instructions and API details


---

## API Endpoints

### 1. Register a New User

**Endpoint**: `POST / register`
Description: Registering a new user

Request Body:

json
{"username" : "Arjun", "password" : "Arjun@2312"}

Response Body:

json
{
    "id": 14,
    "message": "User registered successfully"
}

### 2. Authenticate New User

**Endpoint**: `POST / register`
Description: Authenticating a new user

Request Body:

json
{"username" : "Arjun", "password" : "Arjun@2312"}

Response Body:

json
{
    "message": "Login successful",
    "token": <JWT_TOKEN>
}

### 3. Add a New Transaction

**Endpoint**: `POST / add`
Description: Adding a new transaction

Request Body:

json
{
    "type": "expense", 
    "category": "Food",
    "amount": 5000,
    "date": "2024-10-10",
    "description": "Monthly food bill"
}


Response Body:

json
{
    "id": 19,
    "message": "Transaction added successfully"
}

### 4. Retrieve All Transactions

**Endpoint**: `GET / transaction`
Description: Retrieving all transactions

Response Body:

json
[
    {
        "id": 1,
        "userId": 3,
        "type": "income",
        "category": "Salary",
        "amount": 84000,
        "date": "2024-09-29",
        "description": "Monthly salary"
    },
    ......
]

### 5. Get Transaction By ID:

**Endpoint**: `GET / transaction`
Description: Retrieve a transaction by its id

Response Body:

json
{
    "id": 19,
    "userId": 3,
    "type": "expense",
    "category": "Food",
    "amount": 5000,
    "date": "2024-10-10",
    "description": "Monthly food bill"
}

### 6. Update Transaction By ID:

**Endpoint**: `PUT / transaction`
Description: Update a transaction by its id

Request Body:

json
{
    "type": "expense",
    "category": "Health",
    "amount": 1800,
    "date": "2024-10-19",
    "description": "Monthly medical bill"
}

Response Body:

json
{
    "updatedID": "14",
    "message": "Transaction updated successfully"
}

### 7. Delete Transaction By ID:

**Endpoint**: `DELETE / transaction`
Description: Delete a transaction by its id

Response Body:

json
{
    "message": "Transaction deleted successfully"
}

### 8. Transactions Summary:

**Endpoint**: `GET / transaction`
Description: Retrieve a summary of transactions by date or category

Response Body:

json
[
    {
        "type": "expense",
        "total": 52900
    },
    {
        "type": "income",
        "total": 257000
    }
]

### 9. Monthly Report of Transactions:
**Endpoint**: `GET / transaction`
Description: Retrieve monthly report of transactions

Response Body:

json
[
    {
        "month": "2024-10",
        "category": "Commission",
        "total": 88000
    },
    {
        "month": "2024-10",
        "category": "Cooking Gas",
        "total": 900
    },
    .......
]

---

### Usage
To use the Personal Expense Tracker API:

Start the server using the command: npm start
Use Postman or any other API client to send requests to the endpoints defined above
Refer to the provided examples for request bodies and expected responses

---

### Error Handling

The API includes basic error handling to manage common issues:

400 Bad Request: Returned when a request has invalid data, such as an invalid transaction ID.
404 Not Found: Returned when a requested resource (like a transaction by ID) does not exist.
500 Internal Server Error: Returned when there is an error in the database operations.

Example of an error response:

json
{
  "error": "Invalid transaction ID"
}

---

### Bonus Features

User Authentication: Implement user authentication using JSON Web Tokens (JWT) to secure the API. This allows users to register and log in, ensuring their transactions are tied to their accounts.

Pagination: Add pagination to the GET /transactions endpoint to manage large datasets. This can be achieved by using query parameters like page and limit.

Monthly Reports: Create an endpoint to generate reports that summarize spending by category on a monthly basis. This could include total expenses, total income, and net balance for each month.

License
This project is licensed under the MIT License. See the LICENSE file for details.

---

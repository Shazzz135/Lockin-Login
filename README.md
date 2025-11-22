# Lockin-Login

## Purpose
- General practice with MERN (Mongo, Express, React, Node.js)
- Training myself to create/close issues more efficiently
- Studying my a** off

## Project
- Simple Sign Up and Login
- Uses Tailwind CSS
- If successfuly logged in, you get a Cake image

## Rules
- Must use Hooks
- Components less than 200 lines
- Organized and Simplfied folders and files
- 5 Days to Complete (Nov. 19 - Nov. 23)

---

## Personal Log

### Day 1: 
I was already familiar with language and file layout, I started by creating all neccessary files and installing all packages. I installed Tailwind CSS into my codebase for less file crowding. I started designing components like a Card for the AuthPages and splitting up the AuthPages into its Signup and Login components.

### Day 2:
I installed MongoDB Compass and created my backend folder mainly applying the URI variable for my .env file and I used mongoose to connect to my database in db.js.

### Day 3:
Setting up the index.js and users.js, creating a schema for POSTing to the database which takes firstname, lastname, email, password(hashed with bcrypt), count(default at 0), and datecreated. Once I ran the backend and saw "MongoDB connection successfull" message from my log, I intagrated that in my frontend for the SignUp component with redirection to the Home page on success.

### Day 4:
Added api/login to verify the user account is created, checks for email then decrypts password to confirm frontend inputs, once confirmed user is redirected to home page ...

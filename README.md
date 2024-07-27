# Kyakhanahai.com

A MERN Stack Project

## Introduction

Kyakhanahai.com is a website that answers one of the most anxiety-inducing questions in the world, “khaney mai kya banau?” This is a MERN (MongoDB, Express, React, Node.js) Stack project.

You can save all the dishes that you like, and our website will generate a random dish for you from the dishes you saved. There is no limit to generations.

The project includes user authentication and basic CRUD operations for a user profile. You can also order the food through our website on Zomato.

## Features

- User registration & profile creation (signup feature)
- User authentication feature (login feature)
- CRUD operations to save your dishes
- Table to show all your saved dishes
- Random meal generator
- Directly order the generated meal on Zomato
- Seeing nearby restaurants in your locality via Google Maps

## Technologies

- MongoDB (Database)
- Express.js (Backend Framework)
- React.js (Frontend Library)
- Node.js (Runtime Environment)
- Material UI
- Tailwind CSS
- Google Cloud API (Places API & Geocoding API)
- Git & GitHub

## Folder Structure

### API Endpoints

- `/api/signup`: Registers a new user
- `/api/login`: Logs in the user
- `/api/checkAuth`: Checks if the user is authenticated
- `/api/adddish`: Adds a dish to the dish database
- `/api/showdish`: Shows all the dishes of a user
- `/api/deletedish`: Deletes the selected dish from the user database
- `/api/getdish`: Generates a random dish from the dish database
- `/api/getNearbyRestaurants`: Gives information on nearby restaurants to the user’s location
- `/api/logout`: Logs the user out

### Frontend Overview

**Folder: Assets**

**Files:**

- Adddish.js
- App.css
- App.js
- Checkplaces.js
- Firstintrocomp.js
- Footer.js
- Getdish.js
- Hotelcard.js
- index.css
- Login.js
- main.js
- Mainpage.js
- Navbar.js
- Navbarelements.js
- Secondintrocomp.js
- Showdish.js
- Signup.js
- Thirdintrocomp.js

### Backend Overview

**Files:**

- index.js

## Setup Environment Variables

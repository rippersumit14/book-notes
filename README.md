text
# Book Notes

A simple yet powerful web app to track, rate, and take notes on the non-fiction books you've read.  
Covers are automatically fetched from the Open Library API to visually enrich your personal library.

## Features

- Create, Read, Delete books with PostgreSQL persistence  
- Search Open Library API to fetch real book covers dynamically  
- Sort books by Title, Rating, or Date Added  
- Responsive dark theme for a comfortable reading and management experience  
- User-friendly interface built with Express.js, EJS, and styled CSS  
- Structured project with environment variables and modular code

## Tech Stack

- Node.js with Express.js (RESTful server)  
- PostgreSQL for data storage  
- EJS for server-side templating  
- Axios for HTTP requests to Open Library API  
- CSS with dark mode and smooth UI transitions

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed  
- [PostgreSQL](https://www.postgresql.org/) installed and running  
- Git installed for version control

### Installation

1. Clone the repository:

git clone https://github.com/YOUR_USERNAME/book-notes.git
cd book-notes

text

2. Install dependencies:

npm install

text

3. Create a `.env` file at the root with your PostgreSQL credentials:

PGHOST=localhost
PGUSER=your_pg_username
PGPASSWORD=your_pg_password
PGDATABASE=booknotesdb
PGPORT=5432

text

4. Make sure your PostgreSQL database and `books` table are set up:

CREATE TABLE books (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
author VARCHAR(255),
date_read DATE,
rating INTEGER,
notes TEXT,
cover_url VARCHAR(512),
date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

text

### Running the App

Start the server with:

npx nodemon index.js

text

Open your browser and go to [http://localhost:3000](http://localhost:3000)  
You will see a welcome page and can get started tracking your books.

## Project Structure

BookNotes/
├── db/ # PostgreSQL connection setup
├── public/ # Static CSS and assets
├── views/ # EJS templates
├── .env # Environment variables (not committed)
├── index.js # Main Express server and routes
├── package.json
├── README.md
└── ...
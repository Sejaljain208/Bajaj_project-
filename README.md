# Bajaj Project

A full-stack web application for ticket management with a React frontend and Node.js backend.

## Project Structure

```
bajaj-project/
├── backend/                 # Node.js/Express backend
│   ├── controllers/
│   │   └── ticketController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Ticket.js
│   ├── routes/
│   │   └── tickets.js
│   ├── server.js           # Main server file
│   ├── test-db.js          # Database testing utility
│   └── package.json
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── CreateTicketModal.jsx
│   │   │   ├── StatsStrip.jsx
│   │   │   └── TicketCard.jsx
│   │   ├── api/
│   │   │   └── tickets.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
│
├── netlify/               # Netlify Functions
│   └── functions/
│       └── api.js
│
├── .gitignore
├── deskflow.postman_collection.json
├── netlify.toml
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your database configuration:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## Available Scripts

### Backend
- `npm start` - Start the server
- `npm run test-db` - Test database connection

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

The backend provides the following endpoints for ticket management:

- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get a specific ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

Refer to `deskflow.postman_collection.json` for detailed API documentation.

## Features

- **Ticket Management** - Create, read, update, and delete tickets
- **Board View** - Kanban-style board with drag-and-drop support
- **Statistics** - View ticket statistics and metrics
- **Responsive Design** - Works on desktop and mobile devices

## Technologies Used

### Frontend
- React 18
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Error handling middleware

### Deployment
- Netlify Functions
- Netlify Static Hosting

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the configuration for both frontend and backend deployment.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Contact

For questions or issues, please reach out through GitHub issues.

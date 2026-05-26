import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  getStats
} from '../controllers/ticketController.js';

const router = express.Router();

const validateTicket = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('customerEmail')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid customer email'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 with field errors if invalid
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Stats route should be defined BEFORE the GET /:id or status-specific routes to avoid clash
router.get('/stats', getStats);

// Create and Read
router.post('/', validateTicket, createTicket);
router.get('/', getTickets);

// Update status and Delete
router.patch('/:id', updateTicketStatus);
router.delete('/:id', deleteTicket);

export default router;

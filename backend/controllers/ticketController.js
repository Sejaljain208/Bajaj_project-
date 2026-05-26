import Ticket from '../models/Ticket.js';

const SLA_MINUTES = { urgent: 60, high: 240, medium: 1440, low: 4320 };

export const addDerivedFields = (ticket) => {
  if (!ticket) return null;
  const ticketObj = ticket.toObject ? ticket.toObject() : ticket;
  
  const createdAtTime = new Date(ticketObj.createdAt).getTime();
  const status = ticketObj.status;
  const priority = ticketObj.priority;
  
  let ageMinutes = 0;
  if (status === 'resolved' || status === 'closed') {
    const resolvedAtTime = ticketObj.resolvedAt ? new Date(ticketObj.resolvedAt).getTime() : Date.now();
    ageMinutes = Math.floor((resolvedAtTime - createdAtTime) / 60000);
  } else {
    ageMinutes = Math.floor((Date.now() - createdAtTime) / 60000);
  }
  if (ageMinutes < 0) ageMinutes = 0;
  
  const endTime = (status === 'resolved' || status === 'closed') 
    ? (ticketObj.resolvedAt ? new Date(ticketObj.resolvedAt) : new Date())
    : new Date();
  
  const elapsed = (endTime.getTime() - createdAtTime) / 60000;
  const slaTarget = SLA_MINUTES[priority] || 4320;
  const slaBreached = elapsed > slaTarget;
  
  return {
    ...ticketObj,
    id: ticketObj._id ? ticketObj._id.toString() : ticketObj.id,
    ageMinutes,
    slaBreached
  };
};

const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved']
};

// Create a new ticket
export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;
    const ticket = new Ticket({
      subject,
      description,
      customerEmail,
      priority
    });
    
    await ticket.save();
    res.status(201).json(addDerivedFields(ticket));
  } catch (err) {
    next(err);
  }
};

// Get tickets with optional filters
export const getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    let derivedTickets = tickets.map(t => addDerivedFields(t));
    
    if (breached === 'true') {
      derivedTickets = derivedTickets.filter(t => t.slaBreached === true);
    } else if (breached === 'false') {
      derivedTickets = derivedTickets.filter(t => t.slaBreached === false);
    }
    
    res.status(200).json(derivedTickets);
  } catch (err) {
    next(err);
  }
};

// Update ticket status with validation rules
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    
    if (!newStatus) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const oldStatus = ticket.status;
    
    if (oldStatus === newStatus) {
      return res.status(200).json(addDerivedFields(ticket));
    }
    
    const allowed = VALID_TRANSITIONS[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid transition: cannot move from '${oldStatus}' to '${newStatus}'`
      });
    }
    
    // Manage resolvedAt
    if (newStatus === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (oldStatus === 'resolved' && newStatus === 'in_progress') {
      ticket.resolvedAt = null;
    } else if (oldStatus === 'closed' && newStatus === 'resolved') {
      // If moving back to resolved, we keep it resolved, maybe set to now or preserve.
      // Let's set it to new Date() since it becomes resolved again.
      ticket.resolvedAt = new Date();
    }
    
    ticket.status = newStatus;
    await ticket.save();
    
    res.status(200).json(addDerivedFields(ticket));
  } catch (err) {
    next(err);
  }
};

// Delete ticket
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (err) {
    next(err);
  }
};

// Get metrics / stats
export const getStats = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({});
    const derivedTickets = tickets.map(t => addDerivedFields(t));
    
    const byStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    const byPriority = { low: 0, medium: 0, high: 0, urgent: 0 };
    let slaBreachedOpen = 0;
    
    derivedTickets.forEach(t => {
      if (byStatus[t.status] !== undefined) byStatus[t.status]++;
      if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
      if (t.slaBreached && (t.status === 'open' || t.status === 'in_progress')) {
        slaBreachedOpen++;
      }
    });
    
    res.status(200).json({
      byStatus,
      byPriority,
      slaBreachedOpen
    });
  } catch (err) {
    next(err);
  }
};

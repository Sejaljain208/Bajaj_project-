const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

/**
 * Fetch all tickets with optional filter query parameters.
 */
export const fetchTickets = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.priority && filters.priority !== 'all') {
    queryParams.append('priority', filters.priority);
  }
  if (filters.breached) queryParams.append('breached', 'true');

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/tickets${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch tickets');
  }
  return response.json();
};

/**
 * Create a new ticket.
 */
export const createTicket = async (ticketData) => {
  const url = `${API_BASE_URL}/api/tickets`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.errors) {
      // express-validator format
      const err = new Error('Validation failed');
      err.validationErrors = errorData.errors;
      throw err;
    }
    throw new Error(errorData.error || 'Failed to create ticket');
  }
  return response.json();
};

/**
 * Update the status of an existing ticket.
 */
export const updateTicketStatus = async (id, status) => {
  const url = `${API_BASE_URL}/api/tickets/${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update ticket status to ${status}`);
  }
  return response.json();
};

/**
 * Delete a ticket.
 */
export const deleteTicket = async (id) => {
  const url = `${API_BASE_URL}/api/tickets/${id}`;
  const response = await fetch(url, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete ticket');
  }
  return response.json();
};

/**
 * Get ticket statistics.
 */
export const fetchStats = async () => {
  const url = `${API_BASE_URL}/api/tickets/stats`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch statistics');
  }
  return response.json();
};

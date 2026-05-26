import React from 'react';
import Column from './Column';

const Board = ({ tickets, onTicketUpdated, onTicketDeleted, onMoveTicket }) => {
  // Distribute tickets based on status
  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');
  const closedTickets = tickets.filter(t => t.status === 'closed');

  return (
    <div className="board-container">
      <Column
        title="Open"
        status="open"
        tickets={openTickets}
        onTicketUpdated={onTicketUpdated}
        onTicketDeleted={onTicketDeleted}
        onMoveTicket={onMoveTicket}
      />
      
      <Column
        title="In Progress"
        status="in_progress"
        tickets={inProgressTickets}
        onTicketUpdated={onTicketUpdated}
        onTicketDeleted={onTicketDeleted}
        onMoveTicket={onMoveTicket}
      />
      
      <Column
        title="Resolved"
        status="resolved"
        tickets={resolvedTickets}
        onTicketUpdated={onTicketUpdated}
        onTicketDeleted={onTicketDeleted}
        onMoveTicket={onMoveTicket}
      />
      
      <Column
        title="Closed"
        status="closed"
        tickets={closedTickets}
        onTicketUpdated={onTicketUpdated}
        onTicketDeleted={onTicketDeleted}
        onMoveTicket={onMoveTicket}
      />
    </div>
  );
};

export default Board;

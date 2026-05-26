import React, { useState } from 'react';
import TicketCard from './TicketCard';

const Column = ({ title, status, tickets, onTicketUpdated, onTicketDeleted, onMoveTicket }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId && onMoveTicket) {
      onMoveTicket(ticketId, status);
    }
  };

  const getStatusColorClass = () => {
    switch (status) {
      case 'open': return 'open';
      case 'in_progress': return 'in_progress';
      case 'resolved': return 'resolved';
      case 'closed': return 'closed';
      default: return '';
    }
  };

  return (
    <div
      className={`board-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h2 className="column-title">
          <span className={`column-dot ${getStatusColorClass()}`}></span>
          {title}
        </h2>
        <span className="ticket-count-badge">{tickets.length}</span>
      </div>

      <div className="ticket-list">
        {tickets.length === 0 ? (
          <div className="empty-state">
            No tickets here
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onTicketUpdated={onTicketUpdated}
              onTicketDeleted={onTicketDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;

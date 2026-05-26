import React, { useState } from 'react';
import { updateTicketStatus, deleteTicket } from '../api/tickets';

const TicketCard = ({ ticket, onTicketUpdated, onTicketDeleted }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardError, setCardError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const formatAge = (minutes) => {
    if (minutes === undefined || minutes === null) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setCardError('');
    try {
      const updated = await updateTicketStatus(ticket.id, newStatus);
      onTicketUpdated(updated);
    } catch (err) {
      console.error(err);
      setCardError(err.message || 'Transition error');
      setTimeout(() => {
        setCardError('');
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ticket: "${ticket.subject}"?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteTicket(ticket.id);
      onTicketDeleted(ticket.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  // Drag and drop event handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', ticket.id);
    e.dataTransfer.effectAllowed = 'move';
    // Add slightly transparent class
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    e.target.classList.remove('dragging');
  };

  // Render move buttons depending on status
  const renderMoveButtons = () => {
    if (ticket.status === 'open') {
      return (
        <button
          className="btn-action"
          disabled={isUpdating}
          onClick={() => handleStatusChange('in_progress')}
        >
          {isUpdating ? 'Moving...' : 'Start Progress →'}
        </button>
      );
    }
    if (ticket.status === 'in_progress') {
      return (
        <>
          <button
            className="btn-action"
            disabled={isUpdating}
            onClick={() => handleStatusChange('open')}
          >
            ← Reopen
          </button>
          <button
            className="btn-action"
            disabled={isUpdating}
            onClick={() => handleStatusChange('resolved')}
          >
            Resolve →
          </button>
        </>
      );
    }
    if (ticket.status === 'resolved') {
      return (
        <>
          <button
            className="btn-action"
            disabled={isUpdating}
            onClick={() => handleStatusChange('in_progress')}
          >
            ← Re-work
          </button>
          <button
            className="btn-action"
            disabled={isUpdating}
            onClick={() => handleStatusChange('closed')}
          >
            Close Board →
          </button>
        </>
      );
    }
    // 'closed' status has no move buttons
    return null;
  };

  return (
    <div
      className={`ticket-card ${cardError || ticket.flashError ? 'invalid-flash' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {(cardError || ticket.flashError) && (
        <div className="card-error">
          <span>{cardError || ticket.flashError}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h3 className="ticket-subject">{ticket.subject}</h3>
        <p className="ticket-desc">{ticket.description}</p>
      </div>

      <div className="ticket-email">
        <span>📧 {ticket.customerEmail}</span>
      </div>

      <div className="ticket-meta">
        <span className={`priority-badge ${ticket.priority}`}>
          {ticket.priority}
        </span>
        <span className="ticket-age">
          🕒 {formatAge(ticket.ageMinutes)}
        </span>
        {ticket.slaBreached && (
          <span className="sla-warning">
            ⚠ SLA Breached
          </span>
        )}
      </div>

      <div className="card-actions">
        {renderMoveButtons()}
        <button
          className="btn-action btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Ticket"
        >
          {isDeleting ? '...' : '🗑'}
        </button>
      </div>
    </div>
  );
};

export default TicketCard;

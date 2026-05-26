import React, { useState, useEffect } from 'react';
import { fetchTickets, fetchStats, updateTicketStatus } from './api/tickets';
import StatsStrip from './components/StatsStrip';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    byStatus: { open: 0, in_progress: 0, resolved: 0, closed: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    slaBreachedOpen: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [breachedFilter, setBreachedFilter] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial load
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsData, statsData] = await Promise.all([
        fetchTickets(),
        fetchStats()
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load tickets. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch stats only (used to refresh stats strip after updates)
  const refreshStats = async () => {
    try {
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  // Handlers for Ticket Updates
  const handleTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    refreshStats();
  };

  const handleTicketUpdated = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
    refreshStats();
  };

  const handleTicketDeleted = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    refreshStats();
  };

  // Drag and drop movement action handler
  const handleMoveTicket = async (ticketId, newStatus) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    
    const oldStatus = ticket.status;
    if (oldStatus === newStatus) return;

    try {
      const updated = await updateTicketStatus(ticketId, newStatus);
      handleTicketUpdated(updated);
    } catch (err) {
      console.error(err);
      
      // Trigger temporary flash class by injecting temporary error state to the ticket in React State
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, flashError: err.message || 'Invalid Move!' }
            : t
        )
      );
      
      // Snap back error clear after 2 seconds
      setTimeout(() => {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId ? { ...t, flashError: null } : t
          )
        );
      }, 2000);
    }
  };

  // In-memory filtration
  const filteredTickets = tickets.filter((ticket) => {
    const matchesPriority =
      priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesBreached = !breachedFilter || ticket.slaBreached === true;
    return matchesPriority && matchesBreached;
  });

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <h1>DeskFlow</h1>
          <p>Support Ticket Triage Board</p>
        </div>
        <div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + New Ticket
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading DeskFlow Tickets...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h2>Oops! Connection Error</h2>
          <p>{error}</p>
          <button className="btn-retry" onClick={loadData}>
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          <StatsStrip stats={stats} />

          <div className="control-bar">
            <div className="filters">
              <div className="filter-group">
                <span className="filter-label">Filter Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="select-dropdown"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={breachedFilter}
                    onChange={(e) => setBreachedFilter(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Show SLA Breached only
                </label>
              </div>
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>

          <Board
            tickets={filteredTickets}
            onTicketUpdated={handleTicketUpdated}
            onTicketDeleted={handleTicketDeleted}
            onMoveTicket={handleMoveTicket}
          />
        </>
      )}

      {/* Floating Action Button (FAB) */}
      <button 
        className="fab-btn" 
        onClick={() => setIsModalOpen(true)}
        title="Create New Ticket"
      >
        +
      </button>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default App;

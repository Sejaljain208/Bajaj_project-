import React from 'react';

const StatsStrip = ({ stats }) => {
  const { byStatus = {}, byPriority = {}, slaBreachedOpen = 0 } = stats || {};

  return (
    <div className="stats-strip">
      <div className="stat-box open">
        <span className="stat-value">{byStatus.open || 0}</span>
        <span className="stat-label">Open</span>
      </div>
      
      <div className="stat-box in_progress">
        <span className="stat-value">{byStatus.in_progress || 0}</span>
        <span className="stat-label">In Progress</span>
      </div>
      
      <div className="stat-box resolved">
        <span className="stat-value">{byStatus.resolved || 0}</span>
        <span className="stat-label">Resolved</span>
      </div>
      
      <div className="stat-box closed">
        <span className="stat-value">{byStatus.closed || 0}</span>
        <span className="stat-label">Closed</span>
      </div>

      <div className="stat-box breached">
        <span className="stat-value">{slaBreachedOpen || 0}</span>
        <span className="stat-label">SLA Breached</span>
      </div>
    </div>
  );
};

export default StatsStrip;

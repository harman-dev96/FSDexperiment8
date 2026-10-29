
import { Activity } from "lucide-react";

export default function EventLogs({ logs }) {
  return (
    <section className="panel" id="logs">
      <div className="panel-heading">
        <div>
          <h2>Processing Logs</h2>
          <p className="muted">
            Live activity from the event simulation.
          </p>
        </div>
        <span className="pill">
          <Activity size={13} /> {logs.length} entries
        </span>
      </div>

      <div className="log-list">
        {logs.length === 0 ? (
          <p className="empty-state">Waiting for events...</p>
        ) : (
          logs.map((log) => (
            <div className="log-entry" key={log.id}>
              <span className="log-time">{log.time}</span>
              <span className={`log-message ${log.type}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

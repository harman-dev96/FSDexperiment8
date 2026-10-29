
import { Archive } from "lucide-react";

export default function DeadLetterQueue({ events }) {
  return (
    <section className="panel" id="dlq">
      <div className="panel-heading">
        <div>
          <h2>Dead Letter Queue</h2>
          <p className="muted">
            Messages that failed after the retry limit.
          </p>
        </div>
        <span className="pill">
          <Archive size={13} /> {events.length} messages
        </span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Failure Reason</th>
              <th>Attempts</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No failed messages. Simulate a permanent failure.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.reason}</td>
                  <td>{event.attempts}</td>
                  <td>
                    <span className="status-badge failed">
                      In DLQ
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

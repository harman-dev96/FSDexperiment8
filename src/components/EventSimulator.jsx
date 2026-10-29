
import { CheckCircle, RefreshCw, XCircle, Copy } from "lucide-react";

export default function EventSimulator({ onSimulate, disabled }) {
  return (
    <section className="panel" id="simulator">
      <div className="panel-heading">
        <div>
          <h2>Event Simulator</h2>
          <p className="muted">Generate events to test reliability mechanisms.</p>
        </div>
        <span className="pill">DEMO MODE</span>
      </div>

      <div className="simulator-actions">
        <button
          className="primary-btn"
          disabled={disabled}
          onClick={() => onSimulate("success")}
        >
          <CheckCircle size={16} /> Successful Event
        </button>

        <button
          className="warning-btn"
          disabled={disabled}
          onClick={() => onSimulate("retry")}
        >
          <RefreshCw size={16} /> Temporary Failure
        </button>

        <button
          className="danger-btn"
          disabled={disabled}
          onClick={() => onSimulate("failure")}
        >
          <XCircle size={16} /> Permanent Failure
        </button>

        <button
          className="secondary-btn"
          disabled={disabled}
          onClick={() => onSimulate("duplicate")}
        >
          <Copy size={16} /> Duplicate Event
        </button>
      </div>
    </section>
  );
}

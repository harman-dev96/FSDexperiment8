
import { RefreshCw } from "lucide-react";

const steps = [
  { attempt: "Initial", delay: "0s" },
  { attempt: "Retry 1", delay: "1s" },
  { attempt: "Retry 2", delay: "2s" },
  { attempt: "Retry 3", delay: "4s" },
];

export default function RetryMonitor({ retries, status }) {
  return (
    <section className="panel" id="retries">
      <div className="panel-heading">
        <div>
          <h2>Retry Monitor</h2>
          <p className="muted">Exponential backoff visualization</p>
        </div>
        <span className="pill">
          <RefreshCw size={12} /> {retries} attempts
        </span>
      </div>

      <div className="retry-steps">
        {steps.map((step) => (
          <div className="retry-step" key={step.attempt}>
            <span>{step.attempt}</span>
            <strong>{step.delay}</strong>
            <small>Wait time</small>
          </div>
        ))}
      </div>

      <p className="feedback">{status}</p>
    </section>
  );
}

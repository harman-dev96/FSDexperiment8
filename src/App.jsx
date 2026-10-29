
import { useRef, useState } from "react";
import {
  Activity,
  CheckCircle,
  RefreshCw,
  Archive,
  RotateCcw,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import EventSimulator from "./components/EventSimulator";
import RetryMonitor from "./components/RetryMonitor";
import DeadLetterQueue from "./components/DeadLetterQueue";
import EventLogs from "./components/EventLogs";

export default function App() {
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [uniqueCount, setUniqueCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [retryStatus, setRetryStatus] = useState(
    "No retries performed yet."
  );
  const [feedback, setFeedback] = useState(
    "Ready to simulate events."
  );
  const [busy, setBusy] = useState(false);

  const nextId = useRef(1);
  const processedIds = useRef(new Set());
  const duplicateDemoId = useRef(null);
  const runId = useRef(0);

  const successCount = events.filter(
    (event) => event.status === "success"
  ).length;

  const dlqEvents = events.filter(
    (event) => event.status === "dlq"
  );

  function addLog(message, type = "info") {
    setLogs((previous) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        message,
        type,
      },
      ...previous,
    ]);
  }

  function createEvent() {
    const id = `EVT-${String(nextId.current++).padStart(3, "0")}`;

    setEvents((previous) => [
      ...previous,
      { id, status: "processing", attempts: 1 },
    ]);

    return id;
  }

  function markProcessed(id) {
    if (processedIds.current.has(id)) {
      setDuplicateCount((count) => count + 1);
      addLog(`${id}: duplicate detected; processing skipped.`, "error");
      setFeedback(`${id} was rejected as a duplicate.`);
      return false;
    }

    processedIds.current.add(id);
    setUniqueCount((count) => count + 1);
    return true;
  }

  function updateEvent(id, changes) {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === id ? { ...event, ...changes } : event
      )
    );
  }

  async function simulateEvent(type) {
    if (busy) return;

    if (type === "duplicate" && !duplicateDemoId.current) {
      const id = createEvent();
      duplicateDemoId.current = id;

      if (markProcessed(id)) {
        updateEvent(id, { status: "success" });
        addLog(`${id}: initial event processed successfully.`, "success");
        setFeedback("Initial event processed. Click Duplicate Event again.");
      }
      return;
    }

    setBusy(type === "retry");

    let id;

    if (type === "duplicate") {
      id = duplicateDemoId.current;
      setEvents((previous) =>
        previous.map((event) =>
          event.id === id
            ? { ...event, duplicateDeliveries: (event.duplicateDeliveries || 0) + 1 }
            : event
        )
      );
      setFeedback(`Redelivered ${id} for duplicate detection.`);
      markProcessed(id);
      return;
    }

    id = createEvent();

    if (!markProcessed(id)) return;

    if (type === "success") {
      updateEvent(id, { status: "success" });
      addLog(`${id}: processed successfully.`, "success");
      setFeedback(`${id} processed successfully.`);
      return;
    }

    if (type === "failure") {
      setRetryCount((count) => count + 3);

      updateEvent(id, {
        status: "dlq",
        attempts: 4,
        reason: "Simulated processing failure",
      });

      addLog(`${id}: initial attempt failed.`, "error");
      addLog(`${id}: 3 retries exhausted; sent to DLQ.`, "error");
      setRetryStatus(`${id}: retry limit exhausted.`);
      setFeedback(`${id} moved to the Dead Letter Queue.`);
      return;
    }

    // Simulate exponential backoff: 1s, 2s and 4s.
    const currentRun = ++runId.current;

    try {
      for (let attempt = 1; attempt <= 3; attempt++) {
        setRetryCount((count) => count + 1);

        const delay = 2 ** (attempt - 1);

        updateEvent(id, { attempts: attempt + 1 });
        addLog(
          `${id}: attempt ${attempt} failed; retrying in ${delay}s.`,
          "error"
        );

        setRetryStatus(
          `${id}: retry ${attempt}/3 — waiting ${delay}s.`
        );

        await new Promise((resolve) => setTimeout(resolve, delay * 1000));

        if (runId.current !== currentRun) return;
      }

      updateEvent(id, { status: "success", attempts: 4 });
      addLog(`${id}: recovered and processed successfully.`, "success");
      setRetryStatus(`${id}: recovered after 3 retries.`);
      setFeedback(`${id} succeeded after exponential backoff.`);
    } finally {
      if (runId.current === currentRun) {
        setBusy(false);
      }
    }
  }

  function resetDemo() {
    runId.current++;
    setEvents([]);
    setLogs([]);
    setRetryCount(0);
    setUniqueCount(0);
    setDuplicateCount(0);
    setRetryStatus("No retries performed yet.");
    setFeedback("Simulation reset. Ready for new events.");
    setBusy(false);
    nextId.current = 1;
    processedIds.current.clear();
    duplicateDemoId.current = null;
  }

  return (
    <>
      <Sidebar />

      <main className="main-content" id="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">RELIABILITY CENTER / OVERVIEW</p>
            <h1>Event Reliability Dashboard</h1>
            <p className="muted">
              Monitor event processing, retries and failure recovery.
            </p>
          </div>

          <button className="secondary-btn" onClick={resetDemo}>
            <RotateCcw size={15} /> Reset Demo
          </button>
        </header>

        <section className="stats-grid">
          <StatCard
            title="Total Events"
            value={events.length}
            icon={Activity}
            color="violet"
            subtitle="All simulated deliveries"
          />
          <StatCard
            title="Successful"
            value={successCount}
            icon={CheckCircle}
            color="green"
            subtitle="Successfully processed"
          />
          <StatCard
            title="Retry Attempts"
            value={retryCount}
            icon={RefreshCw}
            color="orange"
            subtitle="Additional attempts"
          />
          <StatCard
            title="DLQ Messages"
            value={dlqEvents.length}
            icon={Archive}
            color="red"
            subtitle="Failed after retries"
          />
        </section>

        <EventSimulator onSimulate={simulateEvent} disabled={busy} />

        <div className="two-column">
          <RetryMonitor retries={retryCount} status={retryStatus} />

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Idempotency Monitor</h2>
                <p className="muted">Duplicate event protection</p>
              </div>
              <span className="pill">ACTIVE</span>
            </div>

            <div className="metric-row">
              <span>Unique event IDs accepted</span>
              <strong className="metric-value">{uniqueCount}</strong>
            </div>
            <div className="metric-row">
              <span>Duplicate deliveries blocked</span>
              <strong className="metric-value">{duplicateCount}</strong>
            </div>

            <p className="muted">
              Previously processed event IDs are rejected on redelivery.
            </p>
          </section>
        </div>

        <DeadLetterQueue events={dlqEvents} />
        <EventLogs logs={logs} />

        <p className="muted">
          Frontend simulation only — no live Kafka connection.
        </p>
        <p className="feedback" aria-live="polite">{feedback}</p>
      </main>
    </>
  );
}

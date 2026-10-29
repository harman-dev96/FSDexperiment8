
import {
  Activity,
  Archive,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "Event Simulator", icon: Zap, href: "#simulator" },
  { label: "Retry Monitor", icon: RefreshCw, href: "#retries" },
  { label: "Dead Letter Queue", icon: Archive, href: "#dlq" },
  { label: "Event Logs", icon: Activity, href: "#logs" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a href="#dashboard" className="brand">
        <span className="brand-icon"><ShieldCheck size={23} /></span>
        <span>EventGuard<span className="brand-dot">.</span></span>
      </a>

      <p className="nav-label">MONITORING</p>

      <nav className="nav-links">
        {links.map(({ label, icon: Icon, href }, index) => (
          <a
            href={href}
            key={label}
            className={`nav-link ${index === 0 ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="online-dot" />
        <div>
          <strong>Simulation Mode</strong>
          <p>Frontend demonstration</p>
        </div>
      </div>
    </aside>
  );
}

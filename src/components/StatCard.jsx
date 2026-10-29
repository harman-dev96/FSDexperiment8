
export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className={`stat-icon ${color}`}>
          <Icon size={19} />
        </span>
      </div>

      <h2>{value}</h2>
      <p className="stat-subtitle">{subtitle}</p>
    </article>
  );
}

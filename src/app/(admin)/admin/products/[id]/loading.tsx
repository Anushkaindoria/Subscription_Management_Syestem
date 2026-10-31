export default function Loading() {
  return (
    <div style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <span>Loading...</span>
    </div>
  );
}

import React from "react";

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border, #242E42)", gap: "1rem" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "0.75rem 1rem",
            borderBottom: activeTab === tab.id ? "2px solid #4F46E5" : "none",
            color: activeTab === tab.id ? "#ffffff" : "var(--text-muted, #94A3B8)",
            fontWeight: 600,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

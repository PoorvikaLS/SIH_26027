import { useMemo } from "react";

export default function RailwayMap({ blocks, selectedSection, onSelect }) {
  const sections = useMemo(() => {
    const names = [...new Set(["Mysuru – Bengaluru", "Bengaluru – Hassan", "Mysuru – Hassan", "Bengaluru – Tumakuru", "Hassan – Mangaluru", ...blocks.map((b) => b.section)])];
    return names.map((name) => ({ name, block: blocks.find((b) => b.section === name && b.date === "2026-09-24") }));
  }, [blocks]);
  return <div className="network-map">
    <div className="network-heading"><div><strong>South Western Zone · schematic</strong><small>Section availability and active possessions</small></div><div className="map-legend"><span><i className="available-dot" /> Available</span><span><i className="blocked-dot" /> Blocked</span></div></div>
    <div className="network-lines">
      {sections.map(({ name, block }, i) => <button key={name} onClick={() => onSelect(name)} className={`network-section ${block ? "maintenance" : "available"} ${selectedSection === name ? "selected" : ""}`} style={{ "--line-order": i }}>
        <span className="network-node" /><span className="network-line" /><span className="network-label"><strong>{name}</strong><small>{block ? `Maintenance · ${block.start}–${block.end}` : "Available for operations"}</small></span><span className="network-state">{block ? "BLOCKED" : "OPEN"}</span>
      </button>)}
    </div>
    <div className="critical-assets"><strong>Critical assets</strong><span>● Point Machine PM-72 <b>Critical</b></span><span>● Signal Cabin S-204 <b>Warning</b></span><span>● Track A-17 <b>Inspection due</b></span></div>
  </div>;
}

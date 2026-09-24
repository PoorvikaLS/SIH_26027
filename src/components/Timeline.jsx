import { useMemo } from "react";
import { trains } from "../data/trains";

const startHour = 6;
const hours = Array.from({ length: 19 }, (_, i) => i + startHour);
const position = (time) => {
  const [h, m] = time.split(":").map(Number);
  return ((h + m / 60 - startHour) / 18) * 100;
};
const width = (start, end) => {
  let duration = position(end) - position(start);
  return duration < 0 ? 100 - position(start) : duration;
};

export default function Timeline({ blocks, onSelect, day = "2026-09-24" }) {
  const rows = useMemo(() => {
    const sections = [...new Set([...blocks.map((b) => b.section), ...trains.map((t) => t.section)])];
    return sections.map((section) => ({ section, blocks: blocks.filter((b) => b.section === section), trains: trains.filter((t) => t.section === section) }));
  }, [blocks]);
  return (
    <div className="timeline-scroll">
      <div className="timeline-grid">
        <div className="timeline-head"><div className="timeline-label">SECTION / {day}</div><div className="timeline-hours">{hours.map((h) => <span key={h}>{String(h).padStart(2, "0")}:00</span>)}</div></div>
        {rows.map((row) => <div className="timeline-row" key={row.section}>
          <div className="timeline-label"><strong>{row.section}</strong><small>{row.blocks.length ? `${row.blocks.length} planned block${row.blocks.length === 1 ? "" : "s"}` : "Available"}</small></div>
          <div className="timeline-track">
            {hours.map((h) => <i key={h} style={{ left: `${((h - startHour) / 18) * 100}%` }} />)}
            {row.blocks.map((block) => <button key={block.id} className={`timeline-block ${block.priority.toLowerCase()}`} style={{ left: `${position(block.start)}%`, width: `${width(block.start, block.end)}%` }} onClick={() => onSelect(block)} title={`${block.id}: ${block.activity}`}><strong>{block.id}</strong><span>{block.activity}</span></button>)}
            {row.trains.map((train) => <div key={train.id} className={`train-marker ${train.type.toLowerCase()}`} style={{ left: `${position(train.time)}%` }} title={`${train.id} ${train.name} ${train.time}`}><span>{train.type === "Goods" ? "G" : "P"} {train.time}</span></div>)}
          </div>
        </div>)}
      </div>
      <div className="timeline-legend"><span><i className="legend-block" /> Maintenance block</span><span><i className="legend-passenger" /> Passenger train</span><span><i className="legend-goods" /> Goods train</span><span><i className="legend-conflict" /> Train intersects block</span></div>
    </div>
  );
}

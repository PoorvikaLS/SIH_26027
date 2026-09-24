import { Clock3, MapPin, Users, ChevronRight } from "lucide-react";

export default function BlockCard({ block, tasks, onClick, compact = false }) {
  return (
    <button className={`operation-block ${compact ? "compact" : ""}`} onClick={() => onClick(block)}>
      <div className="operation-block-top"><strong>{block.id}</strong><span className={`badge badge-${block.priority.toLowerCase()}`}>{block.priority}</span></div>
      <strong className="operation-title">{block.activity}</strong>
      <span className="operation-meta"><MapPin size={12} />{block.section}</span>
      <span className="operation-meta"><Clock3 size={12} />{block.start}–{block.end} · {tasks.length} task{tasks.length === 1 ? "" : "s"}</span>
      <span className="operation-bottom"><span>{block.departments.join(" + ")}</span><ChevronRight size={14} /></span>
    </button>
  );
}

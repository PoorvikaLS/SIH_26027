import { useMemo, useState } from "react";
import "./App.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "blocks", label: "Block Planning", icon: "▤" },
  { id: "assets", label: "Assets", icon: "◫" },
  { id: "maintenance", label: "Maintenance", icon: "⚙" },
  { id: "alerts", label: "Alerts", icon: "!" },
  { id: "analytics", label: "Analytics", icon: "⌁" },
];

const blockPlans = [
  { id: "BLK-2041", corridor: "Mysuru – Bengaluru", department: "Engineering", activity: "Track geometry inspection", start: "10:30", end: "12:00", priority: "High", status: "Approved" },
  { id: "BLK-2042", corridor: "Bengaluru – Hassan", department: "S&T", activity: "Signal relay maintenance", start: "13:00", end: "14:30", priority: "Critical", status: "Pending" },
  { id: "BLK-2043", corridor: "Mysuru – Hassan", department: "Traction", activity: "OHE isolator replacement", start: "15:00", end: "17:00", priority: "Medium", status: "Approved" },
  { id: "BLK-2044", corridor: "Bengaluru – Tumakuru", department: "Engineering", activity: "Rail joint renewal", start: "22:00", end: "01:00", priority: "High", status: "Scheduled" },
];

const assets = [
  { name: "Track Section A-17", type: "Track", availability: 98.7, state: "Available" },
  { name: "Signal Cabin S-204", type: "Signal", availability: 91.2, state: "Warning" },
  { name: "OHE Section O-118", type: "Traction", availability: 96.8, state: "Available" },
  { name: "Point Machine PM-72", type: "S&T", availability: 84.6, state: "Critical" },
];

const activities = [
  ["10:42", "AI planner generated a revised block plan", "AI System"],
  ["10:18", "Block BLK-2041 approved by Control Office", "Control"],
  ["09:56", "New overdue signal maintenance task imported", "S&T"],
  ["09:31", "OHE asset O-118 returned to service", "Traction"],
];

function App() {
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState("");

  const filteredBlocks = useMemo(() => {
    const q = query.toLowerCase().trim();
    return blockPlans.filter((b) => {
      const matchesQuery =
        !q ||
        Object.values(b).some((value) =>
          String(value).toLowerCase().includes(q)
        );
      const matchesDepartment =
        department === "All Departments" || b.department === department;
      return matchesQuery && matchesDepartment;
    });
  }, [query, department]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__railToast);
    window.__railToast = window.setTimeout(() => setToast(""), 2800);
  };

  const pageTitle = navItems.find((item) => item.id === active)?.label || "Dashboard";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">IR</div>
          <div>
            <strong>RAIL<span>OPT</span></strong>
            <small>AI BLOCK CONTROL</small>
          </div>
        </div>

        <div className="control-status">
          <span className="pulse-dot" />
          <div>
            <strong>CONTROL ONLINE</strong>
            <small>South Western Zone</small>
          </div>
        </div>

        <nav className="side-nav">
          <div className="nav-label">OPERATIONS</div>
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="nav-label nav-gap">INSIGHTS</div>
          {navItems.slice(4).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "alerts" && <span className="nav-count">7</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sync-row">
            <span className="sync-dot" />
            Data sync healthy
          </div>
          <div className="version">RAILOPT v1.0 • SIH 2026</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">CONTROL ROOM / {pageTitle.toUpperCase()}</div>
            <h1>{pageTitle}</h1>
          </div>

          <div className="topbar-actions">
            <div className="live-time">
              <span className="pulse-dot" />
              LIVE
            </div>

            <button
              className="icon-button notification-button"
              onClick={() => setShowNotifications((v) => !v)}
              aria-label="Notifications"
            >
              ♢
              <span className="notification-dot">7</span>
            </button>

            <button
              className="profile-button"
              onClick={() => setShowProfile((v) => !v)}
            >
              <span className="avatar">MC</span>
              <span className="profile-text">
                <strong>Control Admin</strong>
                <small>Operations</small>
              </span>
              <span>⌄</span>
            </button>
          </div>

          {showNotifications && (
            <div className="floating-panel notification-panel">
              <div className="panel-heading">
                <strong>Notifications</strong>
                <span className="badge badge-critical">7 new</span>
              </div>
              <p>Critical asset PM-72 requires attention.</p>
              <p>AI planner has a revised recommendation.</p>
              <p>New overdue maintenance imported from SMMS.</p>
            </div>
          )}

          {showProfile && (
            <div className="floating-panel profile-panel">
              <strong>Control Admin</strong>
              <span>Operations • South Western Zone</span>
              <button onClick={() => { setShowProfile(false); setShowSettings(true); }}>
                Settings
              </button>
              <button onClick={() => setShowProfile(false)}>Sign out</button>
            </div>
          )}
        </header>

        <div className="content">
          {active === "dashboard" && (
            <Dashboard
              filteredBlocks={filteredBlocks}
              query={query}
              setQuery={setQuery}
              department={department}
              setDepartment={setDepartment}
              notify={notify}
              setActive={setActive}
            />
          )}

          {active !== "dashboard" && (
            <SectionPage
              title={pageTitle}
              active={active}
              notify={notify}
              setActive={setActive}
            />
          )}
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} notify={notify} />}
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

function Dashboard({ filteredBlocks, query, setQuery, department, setDepartment, notify, setActive }) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">TUESDAY • 22 SEPTEMBER 2026</p>
          <h2>Good morning, Control Team</h2>
          <p className="muted">Here is the current network status and AI-assisted block outlook.</p>
        </div>
        <button className="primary-button" onClick={() => setActive("blocks")}>
          + Create Block Plan
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Asset Availability" value="96.4%" change="+1.8%" note="vs last week" tone="green" icon="◫" />
        <KpiCard title="Today's Blocks" value="18" change="3 pending" note="across 4 departments" tone="blue" icon="▤" />
        <KpiCard title="Critical Assets" value="07" change="2 new" note="require attention" tone="red" icon="!" />
        <KpiCard title="AI Efficiency" value="91.8%" change="+6.2%" note="block utilization" tone="amber" icon="⌁" />
      </section>

      <section className="dashboard-grid">
        <div className="card risk-card">
          <CardHeader title="AI Risk Overview" subtitle="Predictive maintenance risk across active corridors">
            <span className="ai-chip">✦ AI ANALYSIS</span>
          </CardHeader>
          <div className="risk-summary">
            <div className="risk-score">
              <div className="score-ring"><strong>23</strong><span>/100</span></div>
              <div>
                <strong>Network Risk</strong>
                <p>Moderate risk detected</p>
              </div>
            </div>
            <div className="risk-bars">
              <RiskBar label="Track" value={72} level="Low" />
              <RiskBar label="Signalling" value={48} level="Medium" />
              <RiskBar label="Traction" value={81} level="Low" />
              <RiskBar label="Points" value={29} level="High" />
            </div>
          </div>
          <div className="ai-insight">
            <span>✦</span>
            <p><strong>AI insight:</strong> Combining the pending S&T and Engineering activities into the 13:00 corridor window could reduce expected downtime by approximately 18 minutes.</p>
          </div>
        </div>

        <div className="card alert-card">
          <CardHeader title="Critical Alerts" subtitle="Assets requiring immediate review">
            <button className="text-button" onClick={() => setActive("alerts")}>View all →</button>
          </CardHeader>
          <div className="alert-list">
            <AlertItem severity="critical" title="Point Machine PM-72" detail="Availability 84.6% • overdue 2 days" />
            <AlertItem severity="warning" title="Signal Cabin S-204" detail="Relay maintenance due today" />
            <AlertItem severity="warning" title="Track Section A-17" detail="Inspection window closes in 4h" />
          </div>
        </div>
      </section>

      <section className="card block-card">
        <CardHeader title="Today's Block Plan" subtitle="Coordinated maintenance windows from BDMS, TMS, SMMS & TDMS">
          <div className="header-actions">
            <button className="secondary-button" onClick={() => notify("Export prepared for the Control Office.")}>Export</button>
            <button className="primary-button small" onClick={() => setActive("blocks")}>Open Planner</button>
          </div>
        </CardHeader>

        <div className="filter-row">
          <div className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search blocks, corridors, activities..." />
          </div>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>S&T</option>
            <option>Traction</option>
          </select>
          <button className="filter-button" onClick={() => { setQuery(""); setDepartment("All Departments"); }}>Reset</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>BLOCK ID</th>
                <th>CORRIDOR</th>
                <th>DEPARTMENT</th>
                <th>ACTIVITY</th>
                <th>TIME</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((block) => (
                <tr key={block.id}>
                  <td><strong>{block.id}</strong></td>
                  <td>{block.corridor}</td>
                  <td><span className="department">{block.department}</span></td>
                  <td>{block.activity}</td>
                  <td>{block.start} – {block.end}</td>
                  <td><StatusBadge value={block.priority} /></td>
                  <td><StatusBadge value={block.status} /></td>
                </tr>
              ))}
              {!filteredBlocks.length && (
                <tr><td colSpan="7" className="empty-state">No block plans match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="card availability-card">
          <CardHeader title="Asset Availability" subtitle="Current infrastructure health">
            <button className="text-button" onClick={() => setActive("assets")}>View assets →</button>
          </CardHeader>
          <div className="asset-list">
            {assets.map((asset) => (
              <div className="asset-row" key={asset.name}>
                <div className="asset-info">
                  <span className={`asset-icon ${asset.type.toLowerCase()}`}>{asset.type[0]}</span>
                  <div><strong>{asset.name}</strong><small>{asset.type}</small></div>
                </div>
                <div className="availability-meter">
                  <div className="meter-track"><span style={{ width: `${asset.availability}%` }} /></div>
                  <strong>{asset.availability}%</strong>
                </div>
                <StatusBadge value={asset.state} />
              </div>
            ))}
          </div>
        </div>

        <div className="card activity-card">
          <CardHeader title="Recent Activity" subtitle="Latest control room events" />
          <div className="activity-list">
            {activities.map(([time, text, source]) => (
              <div className="activity-item" key={time + text}>
                <span className="activity-time">{time}</span>
                <div><strong>{text}</strong><small>{source}</small></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card traffic-card">
          <CardHeader title="Maintenance / Traffic" subtitle="24-hour operating outlook" />
          <div className="mini-chart">
            {[42, 55, 48, 70, 64, 82, 58, 74, 88, 68, 77, 62].map((height, i) => (
              <div className="bar-column" key={i}>
                <span style={{ height: `${height}%` }} />
                {i % 2 === 0 && <small>{String(i + 6).padStart(2, "0")}</small>}
              </div>
            ))}
          </div>
          <div className="chart-legend"><span><i /> Maintenance load</span><span><i /> Train traffic</span></div>
        </div>
      </section>
    </>
  );
}

function KpiCard({ title, value, change, note, tone, icon }) {
  return (
    <div className={`card kpi-card ${tone}`}>
      <div className="kpi-top"><span>{title}</span><span className="kpi-icon">{icon}</span></div>
      <strong className="kpi-value">{value}</strong>
      <div className="kpi-foot"><b>{change}</b><span>{note}</span></div>
    </div>
  );
}

function CardHeader({ title, subtitle, children }) {
  return (
    <div className="card-header">
      <div><h3>{title}</h3><p>{subtitle}</p></div>
      {children}
    </div>
  );
}

function RiskBar({ label, value, level }) {
  return (
    <div className="risk-row">
      <div><span>{label}</span><strong>{level}</strong></div>
      <div className="risk-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function AlertItem({ severity, title, detail }) {
  return (
    <div className="alert-item">
      <span className={`alert-indicator ${severity}`} />
      <div><strong>{title}</strong><small>{detail}</small></div>
      <span className={`badge badge-${severity}`}>{severity}</span>
    </div>
  );
}

function StatusBadge({ value }) {
  const cls = value.toLowerCase().replace(/\s+/g, "-");
  return <span className={`badge badge-${cls}`}>{value}</span>;
}

function SectionPage({ title, active, notify, setActive }) {
  const copy = {
    blocks: ["Block Planning", "Create, compare and approve weekly/monthly AI-assisted maintenance blocks.", "The detailed planner can be connected to your optimization backend here."],
    assets: ["Asset Monitoring", "Track availability, criticality and current health across railway infrastructure.", "Connect TMS, SMMS and TDMS asset feeds to populate this screen."],
    maintenance: ["Maintenance", "Review defects, overdue work and planned maintenance activities.", "This screen is ready for API-driven maintenance records."],
    alerts: ["Alerts", "Prioritized operational alerts generated from asset and schedule data.", "Criticality can later be supplied by the AI/ML service."],
    analytics: ["Analytics", "Measure block utilization, downtime reduction and asset availability.", "Connect your historical data to turn these cards into live analytics."],
  };
  const [heading, subheading, body] = copy[active] || [title, "", ""];
  return (
    <section className="placeholder-page">
      <div className="page-hero">
        <span className="ai-chip">RAILOPT MODULE</span>
        <h2>{heading}</h2>
        <p>{subheading}</p>
      </div>
      <div className="module-grid">
        <div className="card module-card">
          <div className="module-icon">✦</div>
          <h3>Frontend foundation ready</h3>
          <p>{body}</p>
          <button className="primary-button" onClick={() => notify(`${heading} module selected.`)}>Continue</button>
        </div>
        <div className="card module-card">
          <h3>Integration points</h3>
          <ul>
            <li>REST API / backend data</li>
            <li>Role-based control actions</li>
            <li>AI recommendation output</li>
            <li>Weekly and monthly planning views</li>
          </ul>
        </div>
      </div>
      <button className="text-button back-button" onClick={() => setActive("dashboard")}>← Back to dashboard</button>
    </section>
  );
}

function SettingsModal({ onClose, notify }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header"><div><h3>Control Room Settings</h3><p>Configure dashboard display preferences.</p></div><button className="icon-button" onClick={onClose}>×</button></div>
        <label className="setting-row"><span><strong>Live updates</strong><small>Refresh operational data automatically.</small></span><input type="checkbox" defaultChecked /></label>
        <label className="setting-row"><span><strong>AI recommendations</strong><small>Show planner insights on the dashboard.</small></span><input type="checkbox" defaultChecked /></label>
        <label className="setting-row"><span><strong>Critical alerts</strong><small>Keep critical alerts visible in the topbar.</small></span><input type="checkbox" defaultChecked /></label>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => { notify("Settings saved."); onClose(); }}>Save Settings</button></div>
      </div>
    </div>
  );
}

export default App;

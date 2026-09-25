import { useMemo, useState } from "react";
import tasks from "../data/tasks";

const alertData = [
    {
        id: "ALT-001",
        severity: "Critical",
        title: "Critical maintenance task overdue",
        asset: "Track A-17",
        taskId: "MT-118",
        source: "Maintenance Intelligence",
        time: "10:42",
        status: "Open",
        reason:
            "Track geometry inspection is overdue and the associated asset has high operational exposure.",
        action:
            "Review the maintenance window and allocate the earliest available engineering block.",
    },
    {
        id: "ALT-002",
        severity: "Critical",
        title: "Maintenance awaiting block",
        asset: "Cabin S-204",
        taskId: "MT-125",
        source: "Block Planning",
        time: "10:18",
        status: "Open",
        reason:
            "Signal relay maintenance is marked critical but is still waiting for a possession block.",
        action:
            "Reserve a suitable S&T block and verify train traffic before execution.",
    },
    {
        id: "ALT-003",
        severity: "High",
        title: "High-priority maintenance due",
        asset: "Rail J-09",
        taskId: "MT-136",
        source: "Maintenance Intelligence",
        time: "09:56",
        status: "Open",
        reason:
            "Rail joint renewal has high priority and is approaching its planned maintenance deadline.",
        action:
            "Confirm the scheduled block and ensure the Engineering team is available.",
    },
    {
        id: "ALT-004",
        severity: "High",
        title: "Track inspection requires attention",
        asset: "Track A-17",
        taskId: "MT-118",
        source: "AI Risk Engine",
        time: "09:31",
        status: "Open",
        reason:
            "The asset has an active inspection requirement combined with elevated maintenance risk.",
        action:
            "Complete the inspection within the next available maintenance window.",
    },
    {
        id: "ALT-005",
        severity: "Warning",
        title: "Signal relay test due",
        asset: "Relay R-42",
        taskId: "MT-122",
        source: "Maintenance Intelligence",
        time: "08:48",
        status: "Open",
        reason:
            "The scheduled relay test is due and should be completed to maintain signalling reliability.",
        action:
            "Confirm S&T team availability and retain the planned maintenance window.",
    },
    {
        id: "ALT-006",
        severity: "Warning",
        title: "Track circuit awaiting block",
        asset: "Circuit C-77",
        taskId: "MT-145",
        source: "Block Planning",
        time: "08:20",
        status: "Open",
        reason:
            "The inspection cannot proceed until an appropriate block is allocated.",
        action:
            "Check available block windows on the Hassan – Mangaluru section.",
    },
    {
        id: "ALT-007",
        severity: "Warning",
        title: "OHE maintenance approaching",
        asset: "OHE O-118",
        taskId: "MT-131",
        source: "Maintenance Intelligence",
        time: "07:52",
        status: "Acknowledged",
        reason:
            "The OHE isolator replacement is planned and requires coordination with the Traction department.",
        action:
            "Confirm the planned traction block and maintenance crew.",
    },
    {
        id: "ALT-008",
        severity: "Info",
        title: "Maintenance task scheduled",
        asset: "OHE O-204",
        taskId: "MT-139",
        source: "AI Planner",
        time: "07:31",
        status: "Acknowledged",
        reason:
            "The task has been successfully included in the maintenance schedule.",
        action:
            "No immediate intervention required. Continue monitoring execution.",
    },
];

const severityRank = {
    Critical: 4,
    High: 3,
    Warning: 2,
    Info: 1,
};

const severityStyle = {
    Critical: {
        background: "#fef2f2",
        color: "#dc2626",
        border: "#fecaca",
    },
    High: {
        background: "#fff7ed",
        color: "#ea580c",
        border: "#fed7aa",
    },
    Warning: {
        background: "#fffbeb",
        color: "#ca8a04",
        border: "#fde68a",
    },
    Info: {
        background: "#eff6ff",
        color: "#2563eb",
        border: "#bfdbfe",
    },
};

const statusStyle = {
    Open: {
        background: "#fef2f2",
        color: "#dc2626",
    },
    Acknowledged: {
        background: "#f1f5f9",
        color: "#64748b",
    },
};

export default function Alerts() {
    const [search, setSearch] = useState("");
    const [severityFilter, setSeverityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [alerts, setAlerts] = useState(alertData);

    const taskMap = useMemo(() => {
        return new Map(tasks.map((task) => [task.id, task]));
    }, []);

    const enrichedAlerts = useMemo(() => {
        return alerts.map((alert) => ({
            ...alert,
            task: taskMap.get(alert.taskId),
        }));
    }, [alerts, taskMap]);

    const filteredAlerts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return enrichedAlerts
            .filter((alert) => {
                const matchesSearch =
                    !query ||
                    alert.id.toLowerCase().includes(query) ||
                    alert.title.toLowerCase().includes(query) ||
                    alert.asset.toLowerCase().includes(query) ||
                    alert.taskId.toLowerCase().includes(query) ||
                    alert.source.toLowerCase().includes(query);

                const matchesSeverity =
                    severityFilter === "All" ||
                    alert.severity === severityFilter;

                const matchesStatus =
                    statusFilter === "All" ||
                    alert.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesSeverity &&
                    matchesStatus
                );
            })
            .sort(
                (a, b) =>
                    severityRank[b.severity] -
                    severityRank[a.severity]
            );
    }, [
        enrichedAlerts,
        search,
        severityFilter,
        statusFilter,
    ]);

    const criticalCount = alerts.filter(
        (alert) => alert.severity === "Critical" && alert.status === "Open"
    ).length;

    const highCount = alerts.filter(
        (alert) => alert.severity === "High" && alert.status === "Open"
    ).length;

    const warningCount = alerts.filter(
        (alert) => alert.severity === "Warning" && alert.status === "Open"
    ).length;

    const acknowledgedCount = alerts.filter(
        (alert) => alert.status === "Acknowledged"
    ).length;

    const acknowledgeAlert = (alertId) => {
        setAlerts((current) =>
            current.map((alert) =>
                alert.id === alertId
                    ? {
                        ...alert,
                        status: "Acknowledged",
                    }
                    : alert
            )
        );

        if (selectedAlert?.id === alertId) {
            setSelectedAlert((current) => ({
                ...current,
                status: "Acknowledged",
            }));
        }
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <section style={styles.header}>
                <div>
                    <div style={styles.eyebrow}>
                        OPERATIONS INTELLIGENCE
                    </div>

                    <h2 style={styles.title}>Alerts</h2>

                    <p style={styles.subtitle}>
                        Review operational warnings, maintenance risks and
                        AI-generated recommendations requiring attention.
                    </p>
                </div>

                <div style={styles.liveBadge}>
                    <span style={styles.liveDot} />
                    LIVE ALERT MONITOR
                </div>
            </section>

            {/* SUMMARY */}
            <section style={styles.summaryGrid}>
                <SummaryCard
                    label="Critical"
                    value={criticalCount}
                    description="Immediate attention"
                    icon="!"
                    tone="critical"
                />

                <SummaryCard
                    label="High Priority"
                    value={highCount}
                    description="Requires review"
                    icon="▲"
                    tone="high"
                />

                <SummaryCard
                    label="Warnings"
                    value={warningCount}
                    description="Monitor closely"
                    icon="!"
                    tone="warning"
                />

                <SummaryCard
                    label="Acknowledged"
                    value={acknowledgedCount}
                    description="Already reviewed"
                    icon="✓"
                    tone="neutral"
                />
            </section>

            {/* AI INSIGHT */}
            <section style={styles.aiBanner}>
                <div style={styles.aiIcon}>✦</div>

                <div>
                    <div style={styles.aiTitle}>
                        AI Alert Intelligence
                    </div>

                    <div style={styles.aiText}>
                        The alert engine combines maintenance priority,
                        asset criticality, task status and block availability
                        to surface issues that may require operational action.
                    </div>
                </div>
            </section>

            {/* FILTERS */}
            <section style={styles.controls}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>⌕</span>

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search alerts, assets, tasks..."
                        style={styles.searchInput}
                    />
                </div>

                <select
                    value={severityFilter}
                    onChange={(event) =>
                        setSeverityFilter(event.target.value)
                    }
                    style={styles.select}
                >
                    <option value="All">All Severity</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Warning">Warning</option>
                    <option value="Info">Info</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                    style={styles.select}
                >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Acknowledged">
                        Acknowledged
                    </option>
                </select>

                <div style={styles.resultCount}>
                    {filteredAlerts.length} alert
                    {filteredAlerts.length !== 1 ? "s" : ""}
                </div>
            </section>

            {/* ALERT LIST */}
            <section style={styles.alertCard}>
                <div style={styles.cardHeader}>
                    <div>
                        <div style={styles.cardTitle}>
                            Alert Queue
                        </div>

                        <div style={styles.cardSubtitle}>
                            Prioritized operational events requiring review.
                        </div>
                    </div>

                    <div style={styles.queueStatus}>
                        {alerts.filter(
                            (alert) => alert.status === "Open"
                        ).length}{" "}
                        open
                    </div>
                </div>

                <div>
                    {filteredAlerts.map((alert) => {
                        const severity =
                            severityStyle[alert.severity];

                        const status =
                            statusStyle[alert.status];

                        return (
                            <div
                                key={alert.id}
                                style={styles.alertRow}
                                onClick={() =>
                                    setSelectedAlert(alert)
                                }
                            >
                                <div
                                    style={{
                                        ...styles.severityIndicator,
                                        background: severity.color,
                                    }}
                                />

                                <div style={styles.alertMain}>
                                    <div style={styles.alertTop}>
                                        <span
                                            style={{
                                                ...styles.severityBadge,
                                                background:
                                                    severity.background,
                                                color: severity.color,
                                                borderColor:
                                                    severity.border,
                                            }}
                                        >
                                            {alert.severity}
                                        </span>

                                        <span style={styles.alertId}>
                                            {alert.id}
                                        </span>

                                        <span style={styles.alertTime}>
                                            {alert.time}
                                        </span>
                                    </div>

                                    <div style={styles.alertTitle}>
                                        {alert.title}
                                    </div>

                                    <div style={styles.alertDetails}>
                                        <span>
                                            Asset: <strong>{alert.asset}</strong>
                                        </span>

                                        <span>
                                            Task: <strong>{alert.taskId}</strong>
                                        </span>

                                        <span>
                                            Source: <strong>{alert.source}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.alertRight}>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            background: status.background,
                                            color: status.color,
                                        }}
                                    >
                                        {alert.status}
                                    </span>

                                    <span style={styles.arrow}>
                                        →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAlerts.length === 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>✓</div>

                        <div style={styles.emptyTitle}>
                            No alerts found
                        </div>

                        <div style={styles.emptyText}>
                            Try changing the search term or filters.
                        </div>
                    </div>
                )}
            </section>

            {/* DETAIL MODAL */}
            {selectedAlert && (
                <div
                    style={styles.overlay}
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            setSelectedAlert(null);
                        }
                    }}
                >
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <div>
                                <div style={styles.modalEyebrow}>
                                    ALERT DETAILS · {selectedAlert.id}
                                </div>

                                <h3 style={styles.modalTitle}>
                                    {selectedAlert.title}
                                </h3>

                                <div style={styles.modalSubtitle}>
                                    {selectedAlert.asset} ·{" "}
                                    {selectedAlert.taskId}
                                </div>
                            </div>

                            <button
                                style={styles.closeButton}
                                onClick={() =>
                                    setSelectedAlert(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div style={styles.modalContent}>
                            <div style={styles.detailGrid}>
                                <DetailCard
                                    label="Severity"
                                    value={selectedAlert.severity}
                                />

                                <DetailCard
                                    label="Status"
                                    value={selectedAlert.status}
                                />

                                <DetailCard
                                    label="Asset"
                                    value={selectedAlert.asset}
                                />

                                <DetailCard
                                    label="Task"
                                    value={selectedAlert.taskId}
                                />

                                <DetailCard
                                    label="Source"
                                    value={selectedAlert.source}
                                />

                                <DetailCard
                                    label="Detected"
                                    value={selectedAlert.time}
                                />
                            </div>

                            <div style={styles.section}>
                                <div style={styles.sectionTitle}>
                                    Why was this alert raised?
                                </div>

                                <div style={styles.reasonBox}>
                                    <span style={styles.reasonIcon}>
                                        ?
                                    </span>

                                    <p>{selectedAlert.reason}</p>
                                </div>
                            </div>

                            <div style={styles.section}>
                                <div style={styles.sectionTitle}>
                                    Recommended Action
                                </div>

                                <div style={styles.actionBox}>
                                    <span style={styles.actionIcon}>
                                        →
                                    </span>

                                    <p>{selectedAlert.action}</p>
                                </div>
                            </div>

                            {selectedAlert.task && (
                                <div style={styles.section}>
                                    <div style={styles.sectionTitle}>
                                        Linked Maintenance Task
                                    </div>

                                    <div style={styles.taskBox}>
                                        <div>
                                            <div style={styles.taskId}>
                                                {selectedAlert.task.id}
                                            </div>

                                            <div style={styles.taskTitle}>
                                                {selectedAlert.task.title}
                                            </div>

                                            <div style={styles.taskMeta}>
                                                {selectedAlert.task.department} ·{" "}
                                                {selectedAlert.task.section}
                                            </div>
                                        </div>

                                        <div style={styles.taskRight}>
                                            <span style={styles.priorityBadge}>
                                                {selectedAlert.task.priority}
                                            </span>

                                            <span style={styles.taskStatus}>
                                                {selectedAlert.task.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                style={styles.secondaryButton}
                                onClick={() =>
                                    setSelectedAlert(null)
                                }
                            >
                                Close
                            </button>

                            {selectedAlert.status === "Open" && (
                                <button
                                    style={styles.primaryButton}
                                    onClick={() =>
                                        acknowledgeAlert(
                                            selectedAlert.id
                                        )
                                    }
                                >
                                    ✓ Acknowledge Alert
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    description,
    icon,
    tone,
}) {
    const toneStyles = {
        critical: {
            background: "#fef2f2",
            color: "#dc2626",
        },
        high: {
            background: "#fff7ed",
            color: "#ea580c",
        },
        warning: {
            background: "#fffbeb",
            color: "#ca8a04",
        },
        neutral: {
            background: "#f1f5f9",
            color: "#64748b",
        },
    };

    const current = toneStyles[tone];

    return (
        <div style={styles.summaryCard}>
            <div style={styles.summaryTop}>
                <span style={styles.summaryLabel}>
                    {label}
                </span>

                <span
                    style={{
                        ...styles.summaryIcon,
                        background: current.background,
                        color: current.color,
                    }}
                >
                    {icon}
                </span>
            </div>

            <div style={styles.summaryValue}>
                {value}
            </div>

            <div style={styles.summaryDescription}>
                {description}
            </div>
        </div>
    );
}

function DetailCard({ label, value }) {
    return (
        <div style={styles.detailCard}>
            <div style={styles.detailLabel}>
                {label}
            </div>

            <div style={styles.detailValue}>
                {value}
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "28px 32px 40px",
        minHeight: "100%",
        background: "#f8fafc",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        marginBottom: "24px",
    },

    eyebrow: {
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "#64748b",
        marginBottom: "7px",
    },

    title: {
        margin: 0,
        fontSize: "28px",
        lineHeight: 1.2,
        color: "#0f172a",
        fontWeight: 750,
    },

    subtitle: {
        margin: "7px 0 0",
        color: "#64748b",
        fontSize: "14px",
        maxWidth: "700px",
    },

    liveBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 13px",
        borderRadius: "20px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        color: "#475569",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    liveDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#22c55e",
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "14px",
        marginBottom: "16px",
    },

    summaryCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "17px 18px",
    },

    summaryTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    summaryLabel: {
        fontSize: "12px",
        color: "#64748b",
        fontWeight: 600,
    },

    summaryIcon: {
        width: "29px",
        height: "29px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: 800,
    },

    summaryValue: {
        marginTop: "10px",
        fontSize: "27px",
        lineHeight: 1,
        fontWeight: 750,
        color: "#0f172a",
    },

    summaryDescription: {
        marginTop: "6px",
        fontSize: "11px",
        color: "#94a3b8",
    },

    aiBanner: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        marginBottom: "16px",
        background: "#f5f3ff",
        border: "1px solid #e9d5ff",
        borderRadius: "11px",
    },

    aiIcon: {
        width: "31px",
        height: "31px",
        flexShrink: 0,
        borderRadius: "8px",
        background: "#ede9fe",
        color: "#7c3aed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
    },

    aiTitle: {
        color: "#5b21b6",
        fontSize: "11px",
        fontWeight: 800,
        marginBottom: "3px",
    },

    aiText: {
        color: "#6d28d9",
        fontSize: "11px",
        lineHeight: 1.5,
    },

    controls: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
    },

    searchWrapper: {
        flex: 1,
        maxWidth: "450px",
        position: "relative",
    },

    searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
        fontSize: "17px",
    },

    searchInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px 10px 34px",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        outline: "none",
        fontSize: "12px",
        background: "#ffffff",
        color: "#0f172a",
    },

    select: {
        padding: "10px 12px",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        background: "#ffffff",
        color: "#475569",
        fontSize: "12px",
        outline: "none",
        cursor: "pointer",
    },

    resultCount: {
        marginLeft: "auto",
        color: "#64748b",
        fontSize: "12px",
        fontWeight: 600,
    },

    alertCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
    },

    cardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderBottom: "1px solid #f1f5f9",
    },

    cardTitle: {
        fontSize: "14px",
        color: "#0f172a",
        fontWeight: 700,
    },

    cardSubtitle: {
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "4px",
    },

    queueStatus: {
        padding: "5px 9px",
        borderRadius: "6px",
        background: "#fef2f2",
        color: "#dc2626",
        fontSize: "10px",
        fontWeight: 700,
    },

    alertRow: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        minHeight: "78px",
        padding: "12px 20px",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        transition: "background 0.15s ease",
    },

    severityIndicator: {
        width: "4px",
        height: "44px",
        borderRadius: "5px",
        flexShrink: 0,
    },

    alertMain: {
        flex: 1,
        minWidth: 0,
    },

    alertTop: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    severityBadge: {
        border: "1px solid",
        borderRadius: "5px",
        padding: "3px 7px",
        fontSize: "9px",
        fontWeight: 800,
    },

    alertId: {
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: 600,
    },

    alertTime: {
        marginLeft: "auto",
        color: "#94a3b8",
        fontSize: "10px",
    },

    alertTitle: {
        marginTop: "6px",
        color: "#0f172a",
        fontSize: "12px",
        fontWeight: 700,
    },

    alertDetails: {
        display: "flex",
        flexWrap: "wrap",
        gap: "14px",
        marginTop: "4px",
        color: "#94a3b8",
        fontSize: "10px",
    },

    alertDetailsStrong: {
        color: "#475569",
    },

    alertRight: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    statusBadge: {
        padding: "5px 8px",
        borderRadius: "6px",
        fontSize: "9px",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    arrow: {
        color: "#94a3b8",
        fontSize: "16px",
    },

    emptyState: {
        padding: "55px 20px",
        textAlign: "center",
    },

    emptyIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        margin: "0 auto",
        background: "#ecfdf3",
        color: "#16a34a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
    },

    emptyTitle: {
        marginTop: "10px",
        color: "#334155",
        fontSize: "14px",
        fontWeight: 700,
    },

    emptyText: {
        marginTop: "4px",
        color: "#94a3b8",
        fontSize: "11px",
    },

    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
    },

    modal: {
        width: "min(720px, 100%)",
        maxHeight: "88vh",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow:
            "0 20px 60px rgba(15, 23, 42, 0.22)",
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "22px 24px",
        borderBottom: "1px solid #e2e8f0",
    },

    modalEyebrow: {
        fontSize: "10px",
        letterSpacing: "0.1em",
        color: "#64748b",
        fontWeight: 700,
    },

    modalTitle: {
        margin: "6px 0 0",
        color: "#0f172a",
        fontSize: "19px",
    },

    modalSubtitle: {
        marginTop: "5px",
        color: "#64748b",
        fontSize: "11px",
    },

    closeButton: {
        width: "32px",
        height: "32px",
        border: "none",
        borderRadius: "8px",
        background: "#f1f5f9",
        color: "#475569",
        fontSize: "21px",
        cursor: "pointer",
    },

    modalContent: {
        padding: "20px 24px 5px",
    },

    detailGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "10px",
    },

    detailCard: {
        padding: "12px",
        borderRadius: "9px",
        background: "#f8fafc",
        border: "1px solid #eef2f7",
    },

    detailLabel: {
        fontSize: "9px",
        color: "#94a3b8",
        fontWeight: 700,
    },

    detailValue: {
        marginTop: "5px",
        fontSize: "12px",
        color: "#0f172a",
        fontWeight: 700,
    },

    section: {
        marginTop: "20px",
    },

    sectionTitle: {
        color: "#0f172a",
        fontSize: "12px",
        fontWeight: 700,
        marginBottom: "9px",
    },

    reasonBox: {
        display: "flex",
        gap: "10px",
        padding: "13px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
    },

    reasonIcon: {
        width: "24px",
        height: "24px",
        flexShrink: 0,
        borderRadius: "6px",
        background: "#e0f2fe",
        color: "#0284c7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
    },

    reasonBoxP: {
        margin: 0,
    },

    actionBox: {
        display: "flex",
        gap: "10px",
        padding: "13px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "9px",
    },

    actionIcon: {
        width: "24px",
        height: "24px",
        flexShrink: 0,
        borderRadius: "6px",
        background: "#dcfce7",
        color: "#16a34a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
    },

    taskBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        padding: "13px",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
    },

    taskId: {
        color: "#2563eb",
        fontSize: "9px",
        fontWeight: 800,
    },

    taskTitle: {
        marginTop: "3px",
        color: "#334155",
        fontSize: "11px",
        fontWeight: 700,
    },

    taskMeta: {
        marginTop: "4px",
        color: "#94a3b8",
        fontSize: "10px",
    },

    taskRight: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    priorityBadge: {
        padding: "4px 7px",
        borderRadius: "5px",
        background: "#fff7ed",
        color: "#ea580c",
        fontSize: "9px",
        fontWeight: 700,
    },

    taskStatus: {
        color: "#64748b",
        fontSize: "9px",
    },

    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "9px",
        padding: "18px 24px 22px",
        marginTop: "15px",
        borderTop: "1px solid #e2e8f0",
    },

    secondaryButton: {
        padding: "9px 14px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        color: "#475569",
        fontSize: "11px",
        fontWeight: 700,
        cursor: "pointer",
    },

    primaryButton: {
        padding: "9px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#2563eb",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: 700,
        cursor: "pointer",
    },
};
import { useMemo, useState } from "react";
import { tasks } from "../data/tasks";

const assetCatalog = [
    {
        id: "Track A-17",
        type: "Track",
        section: "Mysuru – Bengaluru",
        criticality: "Critical",
        status: "Under Maintenance",
        lastMaintenance: "2026-09-10",
        nextMaintenance: "2026-09-24",
        condition: 72,
    },
    {
        id: "Relay R-42",
        type: "Signal Relay",
        section: "Mysuru – Bengaluru",
        criticality: "High",
        status: "Operational",
        lastMaintenance: "2026-09-12",
        nextMaintenance: "2026-09-24",
        condition: 88,
    },
    {
        id: "Cabin S-204",
        type: "Signal Cabin",
        section: "Bengaluru – Hassan",
        criticality: "Critical",
        status: "Awaiting Block",
        lastMaintenance: "2026-08-28",
        nextMaintenance: "2026-09-24",
        condition: 61,
    },
    {
        id: "OHE O-118",
        type: "OHE Isolator",
        section: "Mysuru – Hassan",
        criticality: "High",
        status: "Operational",
        lastMaintenance: "2026-09-05",
        nextMaintenance: "2026-09-24",
        condition: 84,
    },
    {
        id: "Rail J-09",
        type: "Rail Joint",
        section: "Bengaluru – Tumakuru",
        criticality: "Critical",
        status: "Scheduled",
        lastMaintenance: "2026-08-30",
        nextMaintenance: "2026-09-25",
        condition: 76,
    },
    {
        id: "OHE O-204",
        type: "OHE",
        section: "Bengaluru – Tumakuru",
        criticality: "Medium",
        status: "Scheduled",
        lastMaintenance: "2026-09-08",
        nextMaintenance: "2026-09-25",
        condition: 91,
    },
    {
        id: "Turnout T-13",
        type: "Turnout",
        section: "Bengaluru – Mysuru",
        criticality: "Medium",
        status: "Operational",
        lastMaintenance: "2026-09-14",
        nextMaintenance: "2026-09-26",
        condition: 94,
    },
    {
        id: "Circuit C-77",
        type: "Track Circuit",
        section: "Hassan – Mangaluru",
        criticality: "High",
        status: "Awaiting Block",
        lastMaintenance: "2026-09-01",
        nextMaintenance: "2026-09-27",
        condition: 69,
    },
    {
        id: "Cable CR-12",
        type: "Cable Route",
        section: "Hassan – Mangaluru",
        criticality: "Medium",
        status: "Operational",
        lastMaintenance: "2026-09-11",
        nextMaintenance: "2026-09-27",
        condition: 89,
    },
];

const severityRank = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
};

const statusStyle = {
    Operational: {
        background: "#ecfdf3",
        color: "#15803d",
    },
    "Under Maintenance": {
        background: "#fff7ed",
        color: "#c2410c",
    },
    "Awaiting Block": {
        background: "#fff7ed",
        color: "#b45309",
    },
    Scheduled: {
        background: "#eff6ff",
        color: "#2563eb",
    },
};

const criticalityStyle = {
    Critical: {
        background: "#fef2f2",
        color: "#dc2626",
    },
    High: {
        background: "#fff7ed",
        color: "#ea580c",
    },
    Medium: {
        background: "#fffbeb",
        color: "#ca8a04",
    },
    Low: {
        background: "#f0fdf4",
        color: "#16a34a",
    },
};

function formatDate(date) {
    if (!date) return "—";

    const value = new Date(`${date}T00:00:00`);

    return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getAssetTasks(assetId) {
    return tasks.filter((task) => task.asset === assetId);
}

function getAssetRisk(assetId) {
    const assetTasks = getAssetTasks(assetId);

    if (!assetTasks.length) return "Low";

    const priorities = assetTasks.map((task) => task.priority);

    if (priorities.includes("Critical")) return "Critical";
    if (priorities.includes("High")) return "High";
    if (priorities.includes("Medium")) return "Medium";

    return "Low";
}

export default function Assets() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedAsset, setSelectedAsset] = useState(null);

    const assets = useMemo(() => {
        return assetCatalog.map((asset) => ({
            ...asset,
            risk: getAssetRisk(asset.id),
            tasks: getAssetTasks(asset.id),
        }));
    }, []);

    const filteredAssets = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assets
            .filter((asset) => {
                const matchesSearch =
                    !query ||
                    asset.id.toLowerCase().includes(query) ||
                    asset.type.toLowerCase().includes(query) ||
                    asset.section.toLowerCase().includes(query);

                const matchesFilter =
                    filter === "All" ||
                    asset.status === filter ||
                    asset.criticality === filter;

                return matchesSearch && matchesFilter;
            })
            .sort(
                (a, b) =>
                    severityRank[b.criticality] - severityRank[a.criticality]
            );
    }, [assets, search, filter]);

    const criticalCount = assets.filter(
        (asset) => asset.criticality === "Critical"
    ).length;

    const maintenanceCount = assets.filter(
        (asset) =>
            asset.status === "Under Maintenance" ||
            asset.status === "Scheduled"
    ).length;

    const awaitingBlockCount = assets.filter(
        (asset) => asset.status === "Awaiting Block"
    ).length;

    const operationalCount = assets.filter(
        (asset) => asset.status === "Operational"
    ).length;

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <div style={styles.eyebrow}>ASSET MANAGEMENT</div>

                    <h1 style={styles.title}>Assets</h1>

                    <p style={styles.subtitle}>
                        Monitor railway infrastructure assets, condition, criticality and
                        maintenance status.
                    </p>
                </div>

                <div style={styles.headerBadge}>
                    <span style={styles.headerDot} />
                    Live Asset View
                </div>
            </div>

            {/* KPI cards */}
            <div style={styles.kpiGrid}>
                <KpiCard
                    label="Total Assets"
                    value={assets.length}
                    description="Tracked infrastructure assets"
                    icon="◫"
                />

                <KpiCard
                    label="Operational"
                    value={operationalCount}
                    description="Currently in service"
                    icon="✓"
                />

                <KpiCard
                    label="Critical Assets"
                    value={criticalCount}
                    description="Require close attention"
                    icon="!"
                    danger
                />

                <KpiCard
                    label="Maintenance / Block"
                    value={maintenanceCount + awaitingBlockCount}
                    description={`${awaitingBlockCount} awaiting block`}
                    icon="⚙"
                />
            </div>

            {/* Asset health */}
            <div style={styles.healthCard}>
                <div>
                    <div style={styles.sectionTitle}>Asset Health Overview</div>
                    <div style={styles.sectionSubtitle}>
                        Current condition across monitored railway assets
                    </div>
                </div>

                <div style={styles.healthStats}>
                    <HealthItem
                        label="Healthy"
                        value={assets.filter((a) => a.condition >= 85).length}
                    />

                    <HealthItem
                        label="Watch"
                        value={assets.filter(
                            (a) => a.condition >= 70 && a.condition < 85
                        ).length}
                    />

                    <HealthItem
                        label="Attention"
                        value={assets.filter((a) => a.condition < 70).length}
                    />
                </div>
            </div>

            {/* Controls */}
            <div style={styles.controls}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>⌕</span>

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search asset, type or section..."
                        style={styles.searchInput}
                    />
                </div>

                <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    style={styles.select}
                >
                    <option value="All">All Assets</option>
                    <option value="Operational">Operational</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Awaiting Block">Awaiting Block</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High Criticality</option>
                    <option value="Medium">Medium Criticality</option>
                </select>

                <div style={styles.resultCount}>
                    {filteredAssets.length} asset
                    {filteredAssets.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Table */}
            <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                    <div>
                        <div style={styles.sectionTitle}>Asset Register</div>
                        <div style={styles.sectionSubtitle}>
                            Click an asset to view its maintenance intelligence.
                        </div>
                    </div>
                </div>

                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Asset</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Section</th>
                                <th style={styles.th}>Criticality</th>
                                <th style={styles.th}>Condition</th>
                                <th style={styles.th}>Risk</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Next Maintenance</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAssets.map((asset) => (
                                <tr
                                    key={asset.id}
                                    onClick={() => setSelectedAsset(asset)}
                                    style={styles.row}
                                >
                                    <td style={styles.td}>
                                        <div style={styles.assetName}>{asset.id}</div>
                                        <div style={styles.assetTaskCount}>
                                            {asset.tasks.length} maintenance task
                                            {asset.tasks.length !== 1 ? "s" : ""}
                                        </div>
                                    </td>

                                    <td style={styles.td}>{asset.type}</td>

                                    <td style={styles.td}>{asset.section}</td>

                                    <td style={styles.td}>
                                        <Badge
                                            value={asset.criticality}
                                            styleMap={criticalityStyle}
                                        />
                                    </td>

                                    <td style={styles.td}>
                                        <ConditionBar value={asset.condition} />
                                    </td>

                                    <td style={styles.td}>
                                        <Badge
                                            value={asset.risk}
                                            styleMap={criticalityStyle}
                                        />
                                    </td>

                                    <td style={styles.td}>
                                        <Badge value={asset.status} styleMap={statusStyle} />
                                    </td>

                                    <td style={styles.td}>
                                        <span style={styles.date}>
                                            {formatDate(asset.nextMaintenance)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredAssets.length === 0 && (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>⌕</div>
                            <div style={styles.emptyTitle}>No assets found</div>
                            <div style={styles.emptyText}>
                                Try changing the search term or filter.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Asset detail modal */}
            {selectedAsset && (
                <div
                    style={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedAsset(null);
                        }
                    }}
                >
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <div>
                                <div style={styles.modalEyebrow}>ASSET DETAILS</div>

                                <h2 style={styles.modalTitle}>{selectedAsset.id}</h2>

                                <div style={styles.modalSubtitle}>
                                    {selectedAsset.type} · {selectedAsset.section}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedAsset(null)}
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <div style={styles.modalGrid}>
                            <DetailCard
                                label="Criticality"
                                value={selectedAsset.criticality}
                            />

                            <DetailCard label="Risk" value={selectedAsset.risk} />

                            <DetailCard
                                label="Current Status"
                                value={selectedAsset.status}
                            />

                            <DetailCard
                                label="Condition"
                                value={`${selectedAsset.condition}%`}
                            />

                            <DetailCard
                                label="Last Maintenance"
                                value={formatDate(selectedAsset.lastMaintenance)}
                            />

                            <DetailCard
                                label="Next Maintenance"
                                value={formatDate(selectedAsset.nextMaintenance)}
                            />
                        </div>

                        <div style={styles.detailSection}>
                            <div style={styles.detailHeading}>Condition Assessment</div>

                            <ConditionBar
                                value={selectedAsset.condition}
                                large
                            />

                            <p style={styles.detailText}>
                                The asset currently has a condition score of{" "}
                                <strong>{selectedAsset.condition}%</strong>. Its operational
                                priority is influenced by asset criticality, maintenance
                                history and associated maintenance tasks.
                            </p>
                        </div>

                        <div style={styles.detailSection}>
                            <div style={styles.detailHeading}>Linked Maintenance Tasks</div>

                            {selectedAsset.tasks.length === 0 ? (
                                <div style={styles.noTasks}>
                                    No active maintenance tasks are linked to this asset.
                                </div>
                            ) : (
                                <div style={styles.taskList}>
                                    {selectedAsset.tasks.map((task) => (
                                        <div key={task.id} style={styles.taskItem}>
                                            <div>
                                                <div style={styles.taskId}>{task.id}</div>
                                                <div style={styles.taskTitle}>{task.title}</div>
                                            </div>

                                            <div style={styles.taskMeta}>
                                                <Badge
                                                    value={task.priority}
                                                    styleMap={criticalityStyle}
                                                />

                                                <span style={styles.taskStatus}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.aiNote}>
                            <div style={styles.aiIcon}>✦</div>

                            <div>
                                <div style={styles.aiTitle}>AI Maintenance Insight</div>

                                <div style={styles.aiText}>
                                    {selectedAsset.risk === "Critical"
                                        ? "This asset requires close monitoring because it is linked to a critical or high-priority maintenance requirement."
                                        : selectedAsset.risk === "High"
                                            ? "This asset has elevated maintenance attention based on its linked task priority and operational criticality."
                                            : "This asset currently has no critical maintenance indicator, but its condition should continue to be monitored."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function KpiCard({ label, value, description, icon, danger }) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiTop}>
                <div style={styles.kpiLabel}>{label}</div>

                <div
                    style={{
                        ...styles.kpiIcon,
                        ...(danger ? styles.kpiIconDanger : {}),
                    }}
                >
                    {icon}
                </div>
            </div>

            <div style={styles.kpiValue}>{value}</div>

            <div style={styles.kpiDescription}>{description}</div>
        </div>
    );
}

function HealthItem({ label, value }) {
    return (
        <div style={styles.healthItem}>
            <div style={styles.healthValue}>{value}</div>
            <div style={styles.healthLabel}>{label}</div>
        </div>
    );
}

function Badge({ value, styleMap }) {
    const style = styleMap[value] || {
        background: "#f3f4f6",
        color: "#4b5563",
    };

    return (
        <span
            style={{
                ...styles.badge,
                background: style.background,
                color: style.color,
            }}
        >
            {value}
        </span>
    );
}

function ConditionBar({ value, large = false }) {
    return (
        <div
            style={{
                ...styles.conditionWrapper,
                ...(large ? styles.conditionLarge : {}),
            }}
        >
            <div style={styles.conditionTrack}>
                <div
                    style={{
                        ...styles.conditionFill,
                        width: `${value}%`,
                    }}
                />
            </div>

            <span style={styles.conditionValue}>{value}%</span>
        </div>
    );
}

function DetailCard({ label, value }) {
    return (
        <div style={styles.detailCard}>
            <div style={styles.detailLabel}>{label}</div>
            <div style={styles.detailValue}>{value}</div>
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
        marginBottom: "26px",
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
    },

    headerBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 13px",
        borderRadius: "20px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        color: "#475569",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
    },

    headerDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#22c55e",
    },

    kpiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "14px",
        marginBottom: "16px",
    },

    kpiCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "17px 18px",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
    },

    kpiTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    kpiLabel: {
        fontSize: "12px",
        color: "#64748b",
        fontWeight: 600,
    },

    kpiIcon: {
        width: "29px",
        height: "29px",
        borderRadius: "8px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "14px",
    },

    kpiIconDanger: {
        background: "#fef2f2",
        color: "#dc2626",
    },

    kpiValue: {
        fontSize: "26px",
        fontWeight: 750,
        color: "#0f172a",
        marginTop: "11px",
    },

    kpiDescription: {
        color: "#94a3b8",
        fontSize: "11px",
        marginTop: "3px",
    },

    healthCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "18px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "16px",
    },

    sectionTitle: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#0f172a",
    },

    sectionSubtitle: {
        marginTop: "4px",
        fontSize: "11px",
        color: "#94a3b8",
    },

    healthStats: {
        display: "flex",
        gap: "30px",
    },

    healthItem: {
        textAlign: "right",
    },

    healthValue: {
        fontSize: "20px",
        fontWeight: 750,
        color: "#0f172a",
    },

    healthLabel: {
        fontSize: "11px",
        color: "#64748b",
        marginTop: "2px",
    },

    controls: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
    },

    searchWrapper: {
        flex: 1,
        maxWidth: "430px",
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

    tableCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
    },

    tableHeader: {
        padding: "18px 20px",
        borderBottom: "1px solid #f1f5f9",
    },

    tableScroll: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "1050px",
    },

    th: {
        textAlign: "left",
        padding: "11px 15px",
        background: "#f8fafc",
        color: "#64748b",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 700,
        borderBottom: "1px solid #e2e8f0",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "13px 15px",
        borderBottom: "1px solid #f1f5f9",
        color: "#475569",
        fontSize: "12px",
        whiteSpace: "nowrap",
    },

    row: {
        cursor: "pointer",
    },

    assetName: {
        fontWeight: 700,
        color: "#0f172a",
        fontSize: "12px",
    },

    assetTaskCount: {
        color: "#94a3b8",
        fontSize: "10px",
        marginTop: "3px",
    },

    badge: {
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "10px",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    conditionWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: "105px",
    },

    conditionLarge: {
        width: "100%",
        marginTop: "12px",
    },

    conditionTrack: {
        flex: 1,
        height: "6px",
        background: "#e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
    },

    conditionFill: {
        height: "100%",
        background: "#3b82f6",
        borderRadius: "10px",
    },

    conditionValue: {
        fontSize: "10px",
        color: "#64748b",
        fontWeight: 700,
        minWidth: "30px",
    },

    date: {
        color: "#475569",
    },

    emptyState: {
        padding: "55px 20px",
        textAlign: "center",
    },

    emptyIcon: {
        fontSize: "25px",
        color: "#94a3b8",
    },

    emptyTitle: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#334155",
        marginTop: "8px",
    },

    emptyText: {
        fontSize: "12px",
        color: "#94a3b8",
        marginTop: "4px",
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
        zIndex: 1000,
    },

    modal: {
        width: "min(760px, 100%)",
        maxHeight: "88vh",
        overflowY: "auto",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.2)",
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
        margin: "5px 0 0",
        color: "#0f172a",
        fontSize: "22px",
    },

    modalSubtitle: {
        marginTop: "5px",
        color: "#64748b",
        fontSize: "12px",
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

    modalGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        padding: "20px 24px 5px",
    },

    detailCard: {
        background: "#f8fafc",
        border: "1px solid #eef2f7",
        borderRadius: "9px",
        padding: "12px",
    },

    detailLabel: {
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: 600,
    },

    detailValue: {
        color: "#0f172a",
        fontSize: "13px",
        fontWeight: 700,
        marginTop: "5px",
    },

    detailSection: {
        padding: "18px 24px 0",
    },

    detailHeading: {
        color: "#0f172a",
        fontSize: "13px",
        fontWeight: 700,
    },

    detailText: {
        color: "#64748b",
        fontSize: "11px",
        lineHeight: 1.6,
        marginTop: "10px",
    },

    noTasks: {
        marginTop: "10px",
        padding: "12px",
        background: "#f8fafc",
        color: "#94a3b8",
        borderRadius: "8px",
        fontSize: "11px",
    },

    taskList: {
        marginTop: "10px",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        overflow: "hidden",
    },

    taskItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        padding: "11px 13px",
        borderBottom: "1px solid #f1f5f9",
    },

    taskId: {
        color: "#2563eb",
        fontSize: "10px",
        fontWeight: 700,
    },

    taskTitle: {
        color: "#334155",
        fontSize: "11px",
        marginTop: "3px",
    },

    taskMeta: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
    },

    taskStatus: {
        color: "#64748b",
        fontSize: "10px",
    },

    aiNote: {
        display: "flex",
        gap: "12px",
        margin: "20px 24px 24px",
        padding: "14px",
        borderRadius: "10px",
        background: "#f5f3ff",
        border: "1px solid #e9d5ff",
    },

    aiIcon: {
        width: "28px",
        height: "28px",
        borderRadius: "7px",
        background: "#ede9fe",
        color: "#7c3aed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    aiTitle: {
        color: "#5b21b6",
        fontSize: "11px",
        fontWeight: 700,
    },

    aiText: {
        color: "#6d28d9",
        fontSize: "11px",
        lineHeight: 1.5,
        marginTop: "4px",
    },
};
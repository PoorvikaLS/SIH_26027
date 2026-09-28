import { useMemo, useState } from "react";
import tasks from "../../data/tasks";
import blocks from "../../data/blocks";
import trains from "../../data/trains";
import { calculateRisk } from "../../utils/risk";

const scenarios = [
    {
        id: "train-delay",
        label: "Train Delay",
        icon: "🚆",
        description: "A scheduled train is delayed and overlaps a maintenance window.",
    },
    {
        id: "emergency-defect",
        label: "Emergency Defect",
        icon: "🚨",
        description: "A new critical infrastructure defect is reported.",
    },
    {
        id: "block-cancellation",
        label: "Block Cancellation",
        icon: "🚧",
        description: "An approved maintenance block becomes unavailable.",
    },
    {
        id: "crew-unavailable",
        label: "Crew Unavailable",
        icon: "👷",
        description: "A maintenance crew becomes unavailable.",
    },
    {
        id: "traffic-increase",
        label: "Traffic Increase",
        icon: "📈",
        description: "Train traffic increases in an active corridor.",
    },
    {
        id: "duration-increase",
        label: "Maintenance Duration Increase",
        icon: "⏱",
        description: "One or more maintenance tasks require additional time.",
    },
];

function WhatIfSimulator() {
    const [scenario, setScenario] = useState("train-delay");
    const [applied, setApplied] = useState(false);

    const selectedScenario = scenarios.find(
        (item) => item.id === scenario
    );

    const taskData = useMemo(() => {
        return tasks.map((task) => ({
            ...task,
            risk: calculateRisk(task),
        }));
    }, []);

    const result = useMemo(() => {
        const criticalTasks = taskData.filter(
            (task) => task.risk.severity === "Critical"
        );

        const highRiskTasks = taskData.filter(
            (task) =>
                task.risk.severity === "High" ||
                task.priority === "High"
        );

        let affectedTasks = [];
        let newBlocks = blocks.length;
        let disruptedTrains = 0;
        let riskChange = 0;
        let coverageChange = 0;
        let recommendation = "";

        switch (scenario) {
            case "train-delay":
                affectedTasks = taskData.slice(0, 2);
                newBlocks = blocks.length;
                disruptedTrains = 2;
                riskChange = 6;
                coverageChange = -4;
                recommendation =
                    "The delayed train overlaps an active maintenance window. AI shifts the affected maintenance activities to the next compatible possession window to avoid additional train disruption.";
                break;

            case "emergency-defect":
                affectedTasks = criticalTasks.length
                    ? criticalTasks
                    : taskData.slice(0, 2);
                newBlocks = blocks.length + 1;
                disruptedTrains = 1;
                riskChange = -8;
                coverageChange = 3;
                recommendation =
                    "The emergency defect is treated as a high-priority intervention. The planner inserts an additional maintenance window and protects the affected asset before lower-priority work.";
                break;

            case "block-cancellation":
                affectedTasks = taskData.filter(
                    (task) =>
                        task.status === "Scheduled" ||
                        task.status === "Awaiting block"
                );
                newBlocks = Math.max(blocks.length - 1, 0);
                disruptedTrains = 0;
                riskChange = 9;
                coverageChange = -12;
                recommendation =
                    "The cancelled possession removes available maintenance capacity. Critical and high-risk tasks are retained while lower-priority activities are moved to another block.";
                break;

            case "crew-unavailable":
                affectedTasks = highRiskTasks.slice(0, 3);
                newBlocks = Math.max(blocks.length - 1, 0);
                disruptedTrains = 0;
                riskChange = 7;
                coverageChange = -9;
                recommendation =
                    "Crew availability is insufficient for the original schedule. The planner protects critical work, bundles compatible tasks, and moves activities requiring the unavailable crew.";
                break;

            case "traffic-increase":
                affectedTasks = taskData.slice(0, 3);
                newBlocks = Math.max(blocks.length - 1, 0);
                disruptedTrains = 3;
                riskChange = 5;
                coverageChange = -6;
                recommendation =
                    "Higher train density reduces safe maintenance windows. AI prioritizes short, critical activities and moves flexible work away from high-traffic periods.";
                break;

            case "duration-increase":
                affectedTasks = taskData.slice(0, 3);
                newBlocks = blocks.length + 1;
                disruptedTrains = 1;
                riskChange = 3;
                coverageChange = -5;
                recommendation =
                    "Longer maintenance durations create schedule overlap. The planner extends the possession where possible and moves conflicting work into a compatible alternative window.";
                break;

            default:
                affectedTasks = [];
        }

        return {
            affectedTasks,
            newBlocks,
            disruptedTrains,
            riskChange,
            coverageChange,
            recommendation,
        };
    }, [scenario, taskData]);

    const currentRisk = Math.round(
        taskData.reduce(
            (sum, task) => sum + task.risk.score,
            0
        ) / Math.max(taskData.length, 1)
    );

    const newRisk = Math.max(
        0,
        Math.min(100, currentRisk + result.riskChange)
    );

    const currentCoverage = 87;
    const newCoverage = Math.max(
        0,
        Math.min(100, currentCoverage + result.coverageChange)
    );

    const handleApply = () => {
        setApplied(true);
    };

    const handleReset = () => {
        setApplied(false);
        setScenario("train-delay");
    };

    return (
        <div style={styles.page}>
            <section style={styles.hero}>
                <div>
                    <div style={styles.eyebrow}>
                        AI OPERATIONS · SCENARIO SIMULATION
                    </div>

                    <h2 style={styles.heroTitle}>
                        What-if Simulator
                    </h2>

                    <p style={styles.heroText}>
                        Test operational changes and see how the AI
                        planner would adapt the maintenance schedule.
                    </p>
                </div>

                <div style={styles.aiBadge}>
                    ✦ AI SIMULATION
                </div>
            </section>

            <section style={styles.scenarioCard}>
                <div style={styles.sectionHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Select a scenario
                        </h3>

                        <p style={styles.sectionSubtitle}>
                            Simulate a real operational change.
                        </p>
                    </div>

                    {applied && (
                        <button
                            style={styles.resetButton}
                            onClick={handleReset}
                        >
                            Reset simulation
                        </button>
                    )}
                </div>

                <div style={styles.scenarioGrid}>
                    {scenarios.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setScenario(item.id);
                                setApplied(false);
                            }}
                            style={{
                                ...styles.scenarioOption,
                                ...(scenario === item.id
                                    ? styles.scenarioSelected
                                    : {}),
                            }}
                        >
                            <span style={styles.scenarioIcon}>
                                {item.icon}
                            </span>

                            <strong style={styles.scenarioLabel}>
                                {item.label}
                            </strong>

                            <span style={styles.scenarioDescription}>
                                {item.description}
                            </span>
                        </button>
                    ))}
                </div>

                <div style={styles.selectedScenario}>
                    <span style={styles.selectedIcon}>
                        {selectedScenario.icon}
                    </span>

                    <div>
                        <strong>
                            {selectedScenario.label}
                        </strong>

                        <p>
                            {selectedScenario.description}
                        </p>
                    </div>

                    <button
                        style={styles.simulateButton}
                        onClick={handleApply}
                    >
                        {applied
                            ? "Simulation Applied"
                            : "Run Simulation →"}
                    </button>
                </div>
            </section>

            <section style={styles.flow}>
                <PlanCard
                    label="CURRENT PLAN"
                    tone="current"
                    risk={currentRisk}
                    coverage={currentCoverage}
                    blocks={blocks.length}
                    trains={0}
                    taskCount={tasks.length}
                />

                <div style={styles.arrow}>
                    <span>→</span>
                    <small>SCENARIO</small>
                </div>

                <div style={styles.scenarioMiddle}>
                    <span style={styles.middleIcon}>
                        {selectedScenario.icon}
                    </span>

                    <strong>
                        {selectedScenario.label}
                    </strong>

                    <small>
                        {applied
                            ? "Impact calculated"
                            : "Ready to simulate"}
                    </small>
                </div>

                <div style={styles.arrow}>
                    <span>→</span>
                    <small>AI RESPONSE</small>
                </div>

                <PlanCard
                    label="NEW PLAN"
                    tone="new"
                    risk={newRisk}
                    coverage={newCoverage}
                    blocks={result.newBlocks}
                    trains={result.disruptedTrains}
                    taskCount={Math.max(
                        tasks.length - result.affectedTasks.length,
                        0
                    )}
                />
            </section>

            <section style={styles.metricsGrid}>
                <MetricCard
                    label="Risk Score"
                    current={currentRisk}
                    next={newRisk}
                    suffix="/100"
                    inverse
                />

                <MetricCard
                    label="Maintenance Coverage"
                    current={currentCoverage}
                    next={newCoverage}
                    suffix="%"
                />

                <MetricCard
                    label="Blocks Required"
                    current={blocks.length}
                    next={result.newBlocks}
                    suffix=""
                />

                <MetricCard
                    label="Train Disruption"
                    current={0}
                    next={result.disruptedTrains}
                    suffix=""
                />
            </section>

            <div style={styles.twoColumn}>
                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <h3 style={styles.panelTitle}>
                                Affected maintenance tasks
                            </h3>

                            <p style={styles.panelSubtitle}>
                                Tasks requiring rescheduling or priority
                                adjustment.
                            </p>
                        </div>

                        <span style={styles.countBadge}>
                            {result.affectedTasks.length} affected
                        </span>
                    </div>

                    <div style={styles.taskList}>
                        {result.affectedTasks.length ? (
                            result.affectedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    style={styles.taskRow}
                                >
                                    <div style={styles.taskMain}>
                                        <strong>
                                            {task.title}
                                        </strong>

                                        <span>
                                            {task.id} · {task.asset} ·{" "}
                                            {task.department}
                                        </span>
                                    </div>

                                    <div style={styles.taskRisk}>
                                        <strong>
                                            {task.risk.score}
                                        </strong>

                                        <span>
                                            risk
                                        </span>
                                    </div>

                                    <span
                                        style={{
                                            ...styles.priorityBadge,
                                            ...(task.priority === "Critical"
                                                ? styles.criticalBadge
                                                : task.priority === "High"
                                                    ? styles.highBadge
                                                    : {}),
                                        }}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={styles.empty}>
                                No maintenance tasks are affected.
                            </div>
                        )}
                    </div>
                </section>

                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <h3 style={styles.panelTitle}>
                                AI impact analysis
                            </h3>

                            <p style={styles.panelSubtitle}>
                                Why the plan changes under this scenario.
                            </p>
                        </div>

                        <span style={styles.aiMiniBadge}>
                            ✦ AI
                        </span>
                    </div>

                    <div style={styles.insightBox}>
                        <span style={styles.insightIcon}>
                            ✦
                        </span>

                        <p>{result.recommendation}</p>
                    </div>

                    <div style={styles.impactList}>
                        <ImpactRow
                            label="Risk impact"
                            value={
                                result.riskChange >= 0
                                    ? `+${result.riskChange} points`
                                    : `${result.riskChange} points`
                            }
                            tone={
                                result.riskChange > 0
                                    ? "warning"
                                    : "positive"
                            }
                        />

                        <ImpactRow
                            label="Maintenance coverage"
                            value={
                                result.coverageChange >= 0
                                    ? `+${result.coverageChange}%`
                                    : `${result.coverageChange}%`
                            }
                            tone={
                                result.coverageChange < 0
                                    ? "warning"
                                    : "positive"
                            }
                        />

                        <ImpactRow
                            label="Blocks required"
                            value={
                                result.newBlocks > blocks.length
                                    ? `+${result.newBlocks - blocks.length}`
                                    : result.newBlocks <
                                        blocks.length
                                        ? `-${blocks.length - result.newBlocks}`
                                        : "No change"
                            }
                            tone="neutral"
                        />

                        <ImpactRow
                            label="Train movements affected"
                            value={`${result.disruptedTrains}`}
                            tone={
                                result.disruptedTrains
                                    ? "warning"
                                    : "positive"
                            }
                        />
                    </div>
                </section>
            </div>

            <section style={styles.reasonPanel}>
                <div style={styles.reasonIcon}>
                    ✦
                </div>

                <div>
                    <strong>
                        Why does the AI change the plan?
                    </strong>

                    <p>
                        The simulator evaluates maintenance risk,
                        task priority, available blocks, train
                        movements and operational constraints before
                        proposing the revised schedule. Critical work
                        is protected first, while flexible tasks are
                        moved to compatible windows.
                    </p>
                </div>
            </section>
        </div>
    );
}

function PlanCard({
    label,
    tone,
    risk,
    coverage,
    blocks,
    trains,
    taskCount,
}) {
    return (
        <div
            style={{
                ...styles.planCard,
                ...(tone === "new"
                    ? styles.newPlan
                    : {}),
            }}
        >
            <span style={styles.planLabel}>
                {label}
            </span>

            <div style={styles.planMain}>
                <div>
                    <small>RISK</small>
                    <strong>{risk}/100</strong>
                </div>

                <div>
                    <small>COVERAGE</small>
                    <strong>{coverage}%</strong>
                </div>
            </div>

            <div style={styles.planStats}>
                <span>
                    <b>{blocks}</b> blocks
                </span>

                <span>
                    <b>{taskCount}</b> tasks
                </span>

                <span>
                    <b>{trains}</b> train impacts
                </span>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    current,
    next,
    suffix,
    inverse = false,
}) {
    const difference = next - current;

    const positive = inverse
        ? difference < 0
        : difference >= 0;

    return (
        <div style={styles.metricCard}>
            <span style={styles.metricLabel}>
                {label}
            </span>

            <div style={styles.metricValues}>
                <strong>
                    {current}
                    {suffix}
                </strong>

                <span>→</span>

                <strong
                    style={{
                        color: positive
                            ? "#18865b"
                            : "#c94b4b",
                    }}
                >
                    {next}
                    {suffix}
                </strong>
            </div>

            <small
                style={{
                    color: positive
                        ? "#18865b"
                        : "#c94b4b",
                }}
            >
                {difference === 0
                    ? "No change"
                    : difference > 0
                        ? `+${difference}`
                        : difference}
            </small>
        </div>
    );
}

function ImpactRow({
    label,
    value,
    tone,
}) {
    const colors = {
        warning: {
            background: "#fff4e8",
            text: "#b76318",
        },
        positive: {
            background: "#eaf8f1",
            text: "#18865b",
        },
        neutral: {
            background: "#eef3f7",
            text: "#456173",
        },
    };

    return (
        <div style={styles.impactRow}>
            <span>{label}</span>

            <strong
                style={{
                    background: colors[tone].background,
                    color: colors[tone].text,
                    padding: "5px 9px",
                    borderRadius: "7px",
                    fontSize: "12px",
                }}
            >
                {value}
            </strong>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        paddingBottom: "30px",
    },

    hero: {
        background:
            "linear-gradient(135deg, #17394d 0%, #28586e 100%)",
        borderRadius: "16px",
        padding: "26px 28px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 28px rgba(23,57,77,0.12)",
    },

    eyebrow: {
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "1.4px",
        opacity: 0.75,
        marginBottom: "8px",
    },

    heroTitle: {
        fontSize: "28px",
        margin: 0,
        fontWeight: 800,
    },

    heroText: {
        margin: "7px 0 0",
        fontSize: "13px",
        opacity: 0.82,
    },

    aiBadge: {
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "9px",
        padding: "9px 12px",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "0.8px",
    },

    scenarioCard: {
        background: "#fff",
        border: "1px solid #dfe7ec",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 5px 18px rgba(24,49,63,0.05)",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },

    sectionTitle: {
        margin: 0,
        fontSize: "17px",
        color: "#213642",
    },

    sectionSubtitle: {
        margin: "4px 0 0",
        color: "#718390",
        fontSize: "12px",
    },

    resetButton: {
        border: "1px solid #d4e0e7",
        background: "#fff",
        color: "#466170",
        borderRadius: "8px",
        padding: "8px 12px",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "12px",
    },

    scenarioGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "10px",
    },

    scenarioOption: {
        border: "1px solid #dce5ea",
        background: "#fbfcfd",
        borderRadius: "11px",
        padding: "14px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minHeight: "112px",
    },

    scenarioSelected: {
        border: "2px solid #2788bb",
        background: "#f1f9fd",
        boxShadow: "0 4px 12px rgba(39,136,187,0.10)",
    },

    scenarioIcon: {
        fontSize: "21px",
    },

    scenarioLabel: {
        color: "#263b47",
        fontSize: "13px",
    },

    scenarioDescription: {
        color: "#788b97",
        fontSize: "11px",
        lineHeight: 1.45,
    },

    selectedScenario: {
        marginTop: "15px",
        padding: "13px 15px",
        background: "#f5f8fa",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    selectedIcon: {
        fontSize: "25px",
    },

    simulateButton: {
        marginLeft: "auto",
        border: "none",
        background: "#183c50",
        color: "#fff",
        borderRadius: "8px",
        padding: "10px 15px",
        fontWeight: 800,
        fontSize: "12px",
        cursor: "pointer",
    },

    flow: {
        display: "grid",
        gridTemplateColumns:
            "1fr 70px 170px 70px 1fr",
        gap: "10px",
        alignItems: "center",
    },

    planCard: {
        background: "#fff",
        border: "1px solid #dfe7ec",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 5px 18px rgba(24,49,63,0.05)",
    },

    newPlan: {
        border: "1px solid #80cda9",
        background: "#fbfffd",
    },

    planLabel: {
        fontSize: "10px",
        letterSpacing: "1px",
        fontWeight: 900,
        color: "#738692",
    },

    planMain: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginTop: "12px",
    },

    planStats: {
        display: "flex",
        gap: "12px",
        marginTop: "15px",
        paddingTop: "12px",
        borderTop: "1px solid #edf1f3",
        fontSize: "10px",
        color: "#7b8c96",
    },

    arrow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#81929d",
    },

    scenarioMiddle: {
        background: "#eef7fb",
        border: "1px dashed #9cc9dc",
        borderRadius: "13px",
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        textAlign: "center",
        color: "#28586e",
    },

    middleIcon: {
        fontSize: "23px",
    },

    metricsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "12px",
    },

    metricCard: {
        background: "#fff",
        border: "1px solid #dfe7ec",
        borderRadius: "12px",
        padding: "15px",
    },

    metricLabel: {
        color: "#718390",
        fontSize: "11px",
        fontWeight: 700,
    },

    metricValues: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        marginTop: "9px",
    },

    twoColumn: {
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "16px",
    },

    panel: {
        background: "#fff",
        border: "1px solid #dfe7ec",
        borderRadius: "14px",
        overflow: "hidden",
    },

    panelHeader: {
        padding: "18px 18px 14px",
        borderBottom: "1px solid #edf1f3",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    panelTitle: {
        margin: 0,
        fontSize: "15px",
        color: "#263b47",
    },

    panelSubtitle: {
        margin: "4px 0 0",
        fontSize: "11px",
        color: "#7a8b95",
    },

    countBadge: {
        background: "#eef4f7",
        color: "#49616f",
        padding: "6px 9px",
        borderRadius: "7px",
        fontSize: "10px",
        fontWeight: 800,
    },

    aiMiniBadge: {
        background: "#eaf5fb",
        color: "#237ca8",
        padding: "6px 9px",
        borderRadius: "7px",
        fontSize: "10px",
        fontWeight: 800,
    },

    taskList: {
        display: "flex",
        flexDirection: "column",
    },

    taskRow: {
        padding: "13px 18px",
        borderBottom: "1px solid #edf1f3",
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: "12px",
        alignItems: "center",
    },

    taskMain: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    taskRisk: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#536a77",
    },

    priorityBadge: {
        background: "#eef4f7",
        color: "#4b6574",
        padding: "5px 8px",
        borderRadius: "6px",
        fontSize: "10px",
        fontWeight: 800,
    },

    highBadge: {
        background: "#fff3df",
        color: "#b66b1a",
    },

    criticalBadge: {
        background: "#fde9e9",
        color: "#c34c4c",
    },

    insightBox: {
        margin: "16px",
        padding: "14px",
        background: "#f1f8fc",
        border: "1px solid #d7eaf3",
        borderRadius: "10px",
        display: "flex",
        gap: "10px",
    },

    insightIcon: {
        color: "#2788bb",
        fontSize: "17px",
    },

    impactList: {
        padding: "0 16px 16px",
    },

    impactRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: "1px solid #edf1f3",
        fontSize: "12px",
        color: "#536a77",
    },

    reasonPanel: {
        background: "#f8fbfc",
        border: "1px solid #dce8ed",
        borderRadius: "13px",
        padding: "18px",
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
    },

    reasonIcon: {
        width: "34px",
        height: "34px",
        borderRadius: "9px",
        background: "#e7f3f9",
        color: "#2788bb",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
    },

    empty: {
        padding: "25px",
        textAlign: "center",
        color: "#80919b",
        fontSize: "12px",
    },
};

export default WhatIfSimulator;
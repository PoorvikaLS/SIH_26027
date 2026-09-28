import { useMemo, useState } from "react";
import tasks from "../../data/tasks";
import { calculateRisk } from "../../utils/risk";
import RiskBadge from "../../components/ai/RiskBadge";

function MaintenanceIntelligence() {
    const [selectedTask, setSelectedTask] = useState(null);
    const [filter, setFilter] = useState("All");

    const taskData = useMemo(() => {
        return tasks.map((task) => ({
            ...task,
            risk: calculateRisk(task),
        }));
    }, []);

    const filteredTasks =
        filter === "All"
            ? taskData
            : taskData.filter(
                (task) => task.risk.severity === filter
            );

    return (
        <div
            style={{
                padding: "32px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {/* HEADER */}
            <div style={{ marginBottom: "24px" }}>
                <div
                    style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#2589c9",
                        letterSpacing: "1px",
                        marginBottom: "8px",
                    }}
                >
                    AI INTELLIGENCE
                </div>

                <h1
                    style={{
                        margin: 0,
                        fontSize: "28px",
                        color: "#17202a",
                    }}
                >
                    Maintenance Intelligence
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#6b7c8f",
                    }}
                >
                    AI-assisted maintenance risk assessment and task prioritization.
                </p>
            </div>

            {/* SUMMARY CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                {["Critical", "High", "Medium", "Low"].map((level) => {
                    const count = taskData.filter(
                        (task) => task.risk.severity === level
                    ).length;

                    return (
                        <div
                            key={level}
                            style={{
                                background: "#ffffff",
                                border: "1px solid #dce3e8",
                                borderRadius: "12px",
                                padding: "18px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: "#6b7c8f",
                                    marginBottom: "8px",
                                }}
                            >
                                {level} Risk
                            </div>

                            <div
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 700,
                                    color: "#17202a",
                                }}
                            >
                                {count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FILTERS */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "16px",
                }}
            >
                {["All", "Critical", "High", "Medium", "Low"].map(
                    (level) => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setFilter(level)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border: "1px solid #dce3e8",
                                background:
                                    filter === level
                                        ? "#1f8acb"
                                        : "#ffffff",
                                color:
                                    filter === level
                                        ? "#ffffff"
                                        : "#435466",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            {level}
                        </button>
                    )
                )}
            </div>

            {/* TABLE */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce3e8",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "18px 20px",
                        borderBottom: "1px solid #e5eaee",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "18px",
                            color: "#17202a",
                        }}
                    >
                        Maintenance Risk Assessment
                    </h2>

                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: "13px",
                            color: "#6b7c8f",
                        }}
                    >
                        Click any task row to view the AI risk analysis.
                    </p>
                </div>

                <div
                    style={{
                        overflowX: "auto",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            minWidth: "850px",
                            borderCollapse: "collapse",
                            fontSize: "14px",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#f7f9fb" }}>
                                <th style={thStyle}>Task</th>
                                <th style={thStyle}>Asset</th>
                                <th style={thStyle}>Department</th>
                                <th style={thStyle}>Risk</th>
                                <th style={thStyle}>Priority</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr
                                    key={task.id}
                                    onPointerDown={() => {
                                        setSelectedTask(task);
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            setSelectedTask(task);
                                        }
                                    }}
                                    tabIndex={0}
                                    style={{
                                        cursor: "pointer",
                                        borderTop: "1px solid #edf1f4",
                                        outline: "none",
                                    }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.background =
                                            "#f7fbfe";
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.background =
                                            "#ffffff";
                                    }}
                                >
                                    {/* TASK */}
                                    <td style={tdStyle}>
                                        <strong
                                            style={{
                                                color: "#17202a",
                                            }}
                                        >
                                            {task.id}
                                        </strong>

                                        <div
                                            style={{
                                                color: "#2589c9",
                                                marginTop: "4px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {task.title}
                                        </div>
                                    </td>

                                    {/* ASSET */}
                                    <td style={tdStyle}>
                                        {task.asset}
                                    </td>

                                    {/* DEPARTMENT */}
                                    <td style={tdStyle}>
                                        {task.department}
                                    </td>

                                    {/* RISK */}
                                    <td style={tdStyle}>
                                        <RiskBadge
                                            severity={task.risk.severity}
                                        />

                                        <div
                                            style={{
                                                marginTop: "5px",
                                                fontSize: "12px",
                                                color: "#6b7c8f",
                                            }}
                                        >
                                            Score: {task.risk.score}/100
                                        </div>
                                    </td>

                                    {/* PRIORITY */}
                                    <td style={tdStyle}>
                                        {task.priority}
                                    </td>

                                    {/* STATUS */}
                                    <td style={tdStyle}>
                                        {task.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DETAIL MODAL */}
            {selectedTask && (
                <div
                    onPointerDown={() => setSelectedTask(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15, 27, 38, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        zIndex: 9999,
                    }}
                >
                    <div
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: "760px",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow:
                                "0 24px 70px rgba(0,0,0,0.25)",
                        }}
                    >
                        {/* MODAL HEADER */}
                        <div
                            style={{
                                padding: "24px",
                                borderBottom:
                                    "1px solid #e5eaee",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "20px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#2589c9",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    AI RISK ANALYSIS · {selectedTask.id}
                                </div>

                                <h2
                                    style={{
                                        margin:
                                            "8px 0 6px",
                                        color: "#17202a",
                                    }}
                                >
                                    {selectedTask.title}
                                </h2>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#6b7c8f",
                                    }}
                                >
                                    {selectedTask.asset} ·{" "}
                                    {selectedTask.section}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedTask(null)
                                }
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "8px",
                                    border:
                                        "1px solid #dce3e8",
                                    background: "#ffffff",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "#536577",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <div style={{ padding: "24px" }}>
                            {/* RISK SUMMARY */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                    padding: "18px",
                                    background: "#f7f9fb",
                                    borderRadius: "12px",
                                    marginBottom: "24px",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#7a8997",
                                            marginBottom:
                                                "6px",
                                        }}
                                    >
                                        AI RISK SCORE
                                    </div>

                                    <strong
                                        style={{
                                            fontSize: "32px",
                                            color: "#17202a",
                                        }}
                                    >
                                        {selectedTask.risk.score}
                                        <span
                                            style={{
                                                fontSize: "16px",
                                                color: "#7a8997",
                                            }}
                                        >
                                            /100
                                        </span>
                                    </strong>
                                </div>

                                <RiskBadge
                                    severity={
                                        selectedTask.risk
                                            .severity
                                    }
                                />
                            </div>

                            {/* DETAILS */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, 1fr)",
                                    gap: "20px",
                                }}
                            >
                                <Detail
                                    label="Priority"
                                    value={
                                        selectedTask.priority
                                    }
                                />

                                <Detail
                                    label="Status"
                                    value={
                                        selectedTask.status
                                    }
                                />

                                <Detail
                                    label="Department"
                                    value={
                                        selectedTask.department
                                    }
                                />

                                <Detail
                                    label="Asset"
                                    value={
                                        selectedTask.asset
                                    }
                                />

                                <Detail
                                    label="Due Date"
                                    value={
                                        selectedTask.due
                                    }
                                />

                                <Detail
                                    label="Overdue Duration"
                                    value={
                                        selectedTask.risk
                                            .daysOverdue === 0
                                            ? "Not overdue"
                                            : `${selectedTask.risk.daysOverdue} day(s)`
                                    }
                                />
                            </div>

                            {/* WHY */}
                            <div
                                style={{
                                    marginTop: "28px",
                                    padding: "20px",
                                    background: "#f7f9fb",
                                    borderRadius: "12px",
                                }}
                            >
                                <h3
                                    style={{
                                        marginTop: 0,
                                        color: "#17202a",
                                    }}
                                >
                                    Why did AI assign this risk?
                                </h3>

                                <ul
                                    style={{
                                        marginBottom: 0,
                                        paddingLeft: "20px",
                                        color: "#536577",
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {selectedTask.risk.reasons.map(
                                        (reason) => (
                                            <li key={reason}>
                                                {reason}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* CLOSE */}
                            <div
                                style={{
                                    marginTop: "24px",
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTask(null)
                                    }
                                    style={{
                                        padding: "10px 18px",
                                        border: "none",
                                        borderRadius: "8px",
                                        background: "#1f8acb",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <div
                style={{
                    fontSize: "12px",
                    color: "#7a8997",
                    marginBottom: "5px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontWeight: 700,
                    color: "#263746",
                }}
            >
                {value}
            </div>
        </div>
    );
}

const thStyle = {
    textAlign: "left",
    padding: "14px 16px",
    color: "#6b7c8f",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

const tdStyle = {
    padding: "16px",
    color: "#34495e",
    verticalAlign: "top",
};

export default MaintenanceIntelligence;
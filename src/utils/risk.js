const priorityScore = {
    Critical: 40,
    High: 30,
    Medium: 20,
    Low: 10,
};

const statusScore = {
    "Awaiting block": 25,
    Planned: 15,
    Scheduled: 5,
};

export function calculateRisk(task) {
    const today = new Date();
    const dueDate = new Date(task.due);

    const daysOverdue = Math.max(
        0,
        Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
    );

    const priority = priorityScore[task.priority] || 0;
    const status = statusScore[task.status] || 0;
    const overdueScore = Math.min(daysOverdue * 10, 30);

    const score = Math.min(
        100,
        priority + status + overdueScore
    );

    let severity = "Low";

    if (score >= 70) {
        severity = "Critical";
    } else if (score >= 50) {
        severity = "High";
    } else if (score >= 30) {
        severity = "Medium";
    }

    return {
        score,
        severity,
        daysOverdue,
        reasons: [
            `${task.priority} priority`,
            task.status === "Awaiting block"
                ? "Awaiting block availability"
                : `${task.status} maintenance status`,
            daysOverdue > 0
                ? `${daysOverdue} day(s) overdue`
                : "Not overdue",
        ],
    };
}

export function getRiskLevel(score) {
    if (score >= 70) return "Critical";
    if (score >= 50) return "High";
    if (score >= 30) return "Medium";
    return "Low";
}
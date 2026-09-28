function RiskBadge({ severity }) {
    const styles = {
        Critical: {
            background: "#FEE2E2",
            color: "#B91C1C",
        },
        High: {
            background: "#FFEDD5",
            color: "#C2410C",
        },
        Medium: {
            background: "#FEF3C7",
            color: "#A16207",
        },
        Low: {
            background: "#DCFCE7",
            color: "#15803D",
        },
    };

    const style = styles[severity] || styles.Low;

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: style.background,
                color: style.color,
            }}
        >
            {severity}
        </span>
    );
}

export default RiskBadge;
import { useMemo, useState } from "react";
import tasks from "../../data/tasks";
import blocks from "../../data/blocks";
import trains from "../../data/trains";
import { calculateRisk } from "../../utils/risk";

function Analytics() {
    const [period, setPeriod] = useState("Today");
    const [activeMetric, setActiveMetric] = useState("overview");

    const taskData = useMemo(() => {
        return tasks.map((task) => ({
            ...task,
            risk: calculateRisk(task),
        }));
    }, []);

    const analytics = useMemo(() => {
        const totalTasks = taskData.length;

        const completedOrScheduled = taskData.filter(
            (task) =>
                task.status === "Scheduled" ||
                task.status === "Planned"
        ).length;

        const awaitingBlock = taskData.filter(
            (task) => task.status === "Awaiting block"
        ).length;

        const critical = taskData.filter(
            (task) => task.risk.severity === "Critical"
        ).length;

        const high = taskData.filter(
            (task) => task.risk.severity === "High"
        ).length;

        const medium = taskData.filter(
            (task) => task.risk.severity === "Medium"
        ).length;

        const low = taskData.filter(
            (task) => task.risk.severity === "Low"
        ).length;

        const activeBlocks = blocks.filter(
            (block) =>
                block.status === "Approved" ||
                block.status === "Scheduled"
        ).length;

        const departments = new Set(
            tasks.map((task) => task.department)
        ).size;

        return {
            totalTasks,
            completedOrScheduled,
            awaitingBlock,
            critical,
            high,
            medium,
            low,
            activeBlocks,
            departments,
        };
    }, [taskData]);

    const departmentAnalytics = useMemo(() => {
        const departments = [
            "Engineering",
            "S&T",
            "Traction",
        ];

        return departments.map((department) => {
            const departmentTasks = taskData.filter(
                (task) => task.department === department
            );

            const criticalTasks = departmentTasks.filter(
                (task) =>
                    task.risk.severity === "Critical" ||
                    task.risk.severity === "High"
            ).length;

            return {
                department,
                tasks: departmentTasks.length,
                critical: criticalTasks,
                coverage:
                    departmentTasks.length > 0
                        ? Math.round(
                            ((departmentTasks.length -
                                departmentTasks.filter(
                                    (task) =>
                                        task.status ===
                                        "Awaiting block"
                                ).length) /
                                departmentTasks.length) *
                            100
                        )
                        : 0,
            };
        });
    }, [taskData]);

    const riskDistribution = [
        {
            label: "Critical",
            value: analytics.critical,
            percentage: Math.round(
                (analytics.critical / analytics.totalTasks) * 100
            ),
            className: "critical",
        },
        {
            label: "High",
            value: analytics.high,
            percentage: Math.round(
                (analytics.high / analytics.totalTasks) * 100
            ),
            className: "high",
        },
        {
            label: "Medium",
            value: analytics.medium,
            percentage: Math.round(
                (analytics.medium / analytics.totalTasks) * 100
            ),
            className: "medium",
        },
        {
            label: "Low",
            value: analytics.low,
            percentage: Math.round(
                (analytics.low / analytics.totalTasks) * 100
            ),
            className: "low",
        },
    ];

    const utilizationData = [
        { label: "06", value: 42 },
        { label: "08", value: 58 },
        { label: "10", value: 76 },
        { label: "12", value: 64 },
        { label: "14", value: 82 },
        { label: "16", value: 71 },
        { label: "18", value: 88 },
        { label: "20", value: 61 },
        { label: "22", value: 46 },
    ];

    const trafficData = [
        { label: "06", value: 38 },
        { label: "08", value: 62 },
        { label: "10", value: 81 },
        { label: "12", value: 74 },
        { label: "14", value: 68 },
        { label: "16", value: 86 },
        { label: "18", value: 92 },
        { label: "20", value: 73 },
        { label: "22", value: 49 },
    ];

    return (
        <div style={pageStyle}>

            {/* HEADER */}
            <div style={headerStyle}>
                <div>
                    <div style={eyebrowStyle}>
                        REPORTS & ANALYTICS
                    </div>

                    <h1 style={titleStyle}>
                        Operational Analytics
                    </h1>

                    <p style={subtitleStyle}>
                        Monitor maintenance performance, asset
                        availability, block utilization, risk and
                        train disruption across the network.
                    </p>
                </div>

                <div style={periodControlStyle}>
                    {["Today", "Week", "Month"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setPeriod(option)}
                            style={{
                                ...periodButtonStyle,
                                ...(period === option
                                    ? activePeriodButtonStyle
                                    : {}),
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* TOP KPI CARDS */}
            <section style={kpiGridStyle}>

                <AnalyticsKpi
                    label="Asset Availability"
                    value="96.4%"
                    change="+1.8%"
                    description="vs previous period"
                    tone="green"
                />

                <AnalyticsKpi
                    label="Block Utilization"
                    value="82%"
                    change="+6.2%"
                    description="maintenance windows"
                    tone="blue"
                />

                <AnalyticsKpi
                    label="Maintenance Coverage"
                    value="87%"
                    change="+4.7%"
                    description="planned work covered"
                    tone="purple"
                />

                <AnalyticsKpi
                    label="Train Disruption"
                    value="Low"
                    change="-12%"
                    description="operational impact"
                    tone="amber"
                />
            </section>

            {/* MAIN METRIC NAV */}
            <section style={metricTabsStyle}>
                {[
                    ["overview", "Overview"],
                    ["assets", "Asset Availability"],
                    ["maintenance", "Maintenance"],
                    ["blocks", "Block Utilization"],
                    ["risk", "Risk Analytics"],
                    ["traffic", "Train Disruption"],
                ].map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveMetric(id)}
                        style={{
                            ...metricTabStyle,
                            ...(activeMetric === id
                                ? activeMetricTabStyle
                                : {}),
                        }}
                    >
                        {label}
                    </button>
                ))}
            </section>

            {/* OVERVIEW */}
            {activeMetric === "overview" && (
                <>
                    {/* PERFORMANCE SUMMARY */}
                    <section style={twoColumnStyle}>

                        <div style={cardStyle}>
                            <SectionHeader
                                eyebrow="MAINTENANCE PERFORMANCE"
                                title="Maintenance workload"
                                subtitle="Current maintenance task distribution"
                            />

                            <div style={workloadGridStyle}>
                                <WorkloadItem
                                    label="Total tasks"
                                    value={analytics.totalTasks}
                                />

                                <WorkloadItem
                                    label="Planned / scheduled"
                                    value={
                                        analytics.completedOrScheduled
                                    }
                                />

                                <WorkloadItem
                                    label="Awaiting block"
                                    value={
                                        analytics.awaitingBlock
                                    }
                                />

                                <WorkloadItem
                                    label="Departments"
                                    value={analytics.departments}
                                />
                            </div>

                            <div style={progressSectionStyle}>
                                <div style={progressHeaderStyle}>
                                    <span>
                                        Maintenance coverage
                                    </span>

                                    <strong>87%</strong>
                                </div>

                                <div style={progressTrackStyle}>
                                    <span
                                        style={{
                                            ...progressFillStyle,
                                            width: "87%",
                                        }}
                                    />
                                </div>

                                <small style={helperTextStyle}>
                                    Percentage of maintenance work
                                    currently covered by planned
                                    operational windows.
                                </small>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <SectionHeader
                                eyebrow="RISK ANALYTICS"
                                title="Risk distribution"
                                subtitle="AI-assessed maintenance risk levels"
                            />

                            <div style={riskOverviewStyle}>
                                <div style={riskCircleStyle}>
                                    <strong>
                                        {analytics.critical +
                                            analytics.high}
                                    </strong>

                                    <span>
                                        elevated
                                        <br />
                                        tasks
                                    </span>
                                </div>

                                <div style={riskLegendStyle}>
                                    {riskDistribution.map((item) => (
                                        <div
                                            key={item.label}
                                            style={riskLegendItemStyle}
                                        >
                                            <div
                                                style={{
                                                    ...riskDotStyle,
                                                    ...riskColors[
                                                    item.className
                                                    ],
                                                }}
                                            />

                                            <span>
                                                {item.label}
                                            </span>

                                            <strong>
                                                {item.value}
                                            </strong>

                                            <small>
                                                {item.percentage}%
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CHARTS */}
                    <section style={twoColumnStyle}>

                        <ChartCard
                            title="Block utilization"
                            subtitle="Maintenance window utilization across the operating day"
                            data={utilizationData}
                            suffix="%"
                        />

                        <ChartCard
                            title="Train traffic intensity"
                            subtitle="Relative traffic intensity across the operating day"
                            data={trafficData}
                            suffix="%"
                        />

                    </section>

                    {/* DEPARTMENT PERFORMANCE */}
                    <section style={cardStyle}>
                        <SectionHeader
                            eyebrow="MAINTENANCE PERFORMANCE"
                            title="Department performance"
                            subtitle="Task workload and maintenance coverage by department"
                        />

                        <div style={{ overflowX: "auto" }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>
                                            DEPARTMENT
                                        </th>

                                        <th style={thStyle}>
                                            TASKS
                                        </th>

                                        <th style={thStyle}>
                                            ELEVATED RISK
                                        </th>

                                        <th style={thStyle}>
                                            COVERAGE
                                        </th>

                                        <th style={thStyle}>
                                            STATUS
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {departmentAnalytics.map(
                                        (item) => (
                                            <tr
                                                key={
                                                    item.department
                                                }
                                                style={
                                                    tableRowStyle
                                                }
                                            >
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <strong>
                                                        {
                                                            item.department
                                                        }
                                                    </strong>
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {item.tasks}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            riskNumberStyle
                                                        }
                                                    >
                                                        {
                                                            item.critical
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <div
                                                        style={
                                                            miniProgressWrapper
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                miniProgressTrack
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    ...miniProgressFill,
                                                                    width: `${item.coverage}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <strong>
                                                            {
                                                                item.coverage
                                                            }
                                                            %
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            item.coverage >=
                                                                80
                                                                ? statusGoodStyle
                                                                : statusWarningStyle
                                                        }
                                                    >
                                                        {item.coverage >=
                                                            80
                                                            ? "On track"
                                                            : "Needs review"}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}

            {/* ASSET AVAILABILITY */}
            {activeMetric === "assets" && (
                <AssetAnalytics />
            )}

            {/* MAINTENANCE ANALYTICS */}
            {activeMetric === "maintenance" && (
                <MaintenanceAnalytics
                    analytics={analytics}
                    taskData={taskData}
                />
            )}

            {/* BLOCK UTILIZATION */}
            {activeMetric === "blocks" && (
                <BlockAnalytics
                    blocks={blocks}
                    utilizationData={utilizationData}
                />
            )}

            {/* RISK ANALYTICS */}
            {activeMetric === "risk" && (
                <RiskAnalytics
                    taskData={taskData}
                    riskDistribution={riskDistribution}
                />
            )}

            {/* TRAIN DISRUPTION */}
            {activeMetric === "traffic" && (
                <TrafficAnalytics
                    trains={trains}
                    trafficData={trafficData}
                />
            )}

            {/* AI INSIGHT */}
            <section style={aiInsightStyle}>
                <div style={aiInsightIconStyle}>
                    ✦
                </div>

                <div>
                    <div style={aiInsightLabelStyle}>
                        AI ANALYTICS INSIGHT
                    </div>

                    <h3 style={aiInsightTitleStyle}>
                        Operational pattern detected
                    </h3>

                    <p style={aiInsightTextStyle}>
                        Current maintenance data indicates that
                        grouping compatible Engineering and S&T
                        activities into shared corridor windows
                        can improve block utilization while
                        reducing repeated operational
                        interruptions.
                    </p>
                </div>
            </section>

        </div>
    );
}

/* ================================================= */
/* ASSET ANALYTICS */
/* ================================================= */

function AssetAnalytics() {
    const assetData = [
        {
            name: "Track Section A-17",
            type: "Track",
            availability: 98.7,
            status: "Available",
        },
        {
            name: "Signal Cabin S-204",
            type: "Signal",
            availability: 91.2,
            status: "Warning",
        },
        {
            name: "OHE Section O-118",
            type: "Traction",
            availability: 96.8,
            status: "Available",
        },
        {
            name: "Point Machine PM-72",
            type: "S&T",
            availability: 84.6,
            status: "Critical",
        },
    ];

    return (
        <section style={cardStyle}>
            <SectionHeader
                eyebrow="ASSET AVAILABILITY"
                title="Infrastructure availability"
                subtitle="Current availability across monitored railway assets"
            />

            <div style={assetAnalyticsGrid}>
                {assetData.map((asset) => (
                    <div
                        key={asset.name}
                        style={assetAnalyticsCard}
                    >
                        <div style={assetAnalyticsTop}>
                            <div>
                                <span
                                    style={
                                        assetTypeStyle
                                    }
                                >
                                    {asset.type}
                                </span>

                                <h3
                                    style={
                                        assetNameStyle
                                    }
                                >
                                    {asset.name}
                                </h3>
                            </div>

                            <strong
                                style={{
                                    ...availabilityValueStyle,
                                    color:
                                        asset.availability >=
                                            95
                                            ? "#217a4d"
                                            : asset.availability >=
                                                90
                                                ? "#a56a00"
                                                : "#c0392b",
                                }}
                            >
                                {asset.availability}%
                            </strong>
                        </div>

                        <div
                            style={
                                availabilityTrackStyle
                            }
                        >
                            <span
                                style={{
                                    ...availabilityFillStyle,
                                    width: `${asset.availability}%`,
                                }}
                            />
                        </div>

                        <div
                            style={
                                assetAnalyticsFooter
                            }
                        >
                            <span>
                                Availability
                            </span>

                            <strong>
                                {asset.status}
                            </strong>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ================================================= */
/* MAINTENANCE ANALYTICS */
/* ================================================= */

function MaintenanceAnalytics({
    analytics,
    taskData,
}) {
    const overdueTasks = taskData.filter(
        (task) => task.risk.daysOverdue > 0
    );

    return (
        <div style={stackStyle}>

            <section style={cardStyle}>
                <SectionHeader
                    eyebrow="MAINTENANCE PERFORMANCE"
                    title="Maintenance workload analytics"
                    subtitle="Task completion, overdue work and scheduling readiness"
                />

                <div style={analyticsNumberGrid}>
                    <LargeMetric
                        label="Total maintenance tasks"
                        value={analytics.totalTasks}
                    />

                    <LargeMetric
                        label="Planned / scheduled"
                        value={
                            analytics.completedOrScheduled
                        }
                    />

                    <LargeMetric
                        label="Awaiting block"
                        value={analytics.awaitingBlock}
                    />

                    <LargeMetric
                        label="Overdue tasks"
                        value={overdueTasks.length}
                    />
                </div>
            </section>

            <section style={cardStyle}>
                <SectionHeader
                    eyebrow="OVERDUE WORK"
                    title="Tasks requiring scheduling attention"
                    subtitle="Tasks with an overdue duration identified by the AI risk engine"
                />

                <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>
                                    TASK
                                </th>

                                <th style={thStyle}>
                                    ASSET
                                </th>

                                <th style={thStyle}>
                                    DEPARTMENT
                                </th>

                                <th style={thStyle}>
                                    OVERDUE
                                </th>

                                <th style={thStyle}>
                                    RISK
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {overdueTasks.map((task) => (
                                <tr
                                    key={task.id}
                                    style={tableRowStyle}
                                >
                                    <td style={tdStyle}>
                                        <strong>
                                            {task.id}
                                        </strong>

                                        <div
                                            style={
                                                taskTitleStyle
                                            }
                                        >
                                            {task.title}
                                        </div>
                                    </td>

                                    <td style={tdStyle}>
                                        {task.asset}
                                    </td>

                                    <td style={tdStyle}>
                                        {task.department}
                                    </td>

                                    <td style={tdStyle}>
                                        {task.risk.daysOverdue}{" "}
                                        day
                                        {task.risk.daysOverdue !==
                                            1
                                            ? "s"
                                            : ""}
                                    </td>

                                    <td style={tdStyle}>
                                        <span
                                            style={
                                                riskPillStyle
                                            }
                                        >
                                            {
                                                task.risk.severity
                                            }
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

/* ================================================= */
/* BLOCK ANALYTICS */
/* ================================================= */

function BlockAnalytics({
    blocks,
    utilizationData,
}) {
    const approved = blocks.filter(
        (block) =>
            block.status === "Approved"
    ).length;

    const scheduled = blocks.filter(
        (block) =>
            block.status === "Scheduled"
    ).length;

    const pending = blocks.filter(
        (block) =>
            block.status === "Pending"
    ).length;

    return (
        <div style={stackStyle}>

            <section style={analyticsNumberGridSection}>
                <LargeMetric
                    label="Total blocks"
                    value={blocks.length}
                />

                <LargeMetric
                    label="Approved"
                    value={approved}
                />

                <LargeMetric
                    label="Scheduled"
                    value={scheduled}
                />

                <LargeMetric
                    label="Pending"
                    value={pending}
                />
            </section>

            <ChartCard
                title="Block utilization trend"
                subtitle="Relative use of available maintenance windows"
                data={utilizationData}
                suffix="%"
            />

            <section style={cardStyle}>
                <SectionHeader
                    eyebrow="BLOCK UTILIZATION"
                    title="Operational interpretation"
                    subtitle="How the current schedule uses available possession windows"
                />

                <div style={insightGridStyle}>
                    <InsightBox
                        title="82%"
                        label="Current utilization"
                        text="Most available maintenance windows are being used."
                    />

                    <InsightBox
                        title="18%"
                        label="Remaining capacity"
                        text="Additional work may fit into unused windows depending on traffic constraints."
                    />

                    <InsightBox
                        title="4"
                        label="Departments coordinated"
                        text="Engineering, S&T, Traction and control operations contribute to planning."
                    />
                </div>
            </section>
        </div>
    );
}

/* ================================================= */
/* RISK ANALYTICS */
/* ================================================= */

function RiskAnalytics({
    taskData,
    riskDistribution,
}) {
    const sortedTasks = [...taskData].sort(
        (a, b) =>
            b.risk.score - a.risk.score
    );

    return (
        <div style={stackStyle}>

            <section style={twoColumnStyle}>

                <div style={cardStyle}>
                    <SectionHeader
                        eyebrow="RISK DISTRIBUTION"
                        title="Maintenance risk profile"
                        subtitle="Risk classification generated from task and operational factors"
                    />

                    <div
                        style={{
                            padding: "20px",
                        }}
                    >
                        {riskDistribution.map(
                            (item) => (
                                <div
                                    key={item.label}
                                    style={
                                        riskBarItemStyle
                                    }
                                >
                                    <div
                                        style={
                                            riskBarHeaderStyle
                                        }
                                    >
                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>

                                        <strong>
                                            {
                                                item.value
                                            }{" "}
                                            tasks
                                        </strong>
                                    </div>

                                    <div
                                        style={
                                            horizontalBarTrack
                                        }
                                    >
                                        <span
                                            style={{
                                                ...horizontalBarFill,
                                                width: `${Math.max(
                                                    item.percentage,
                                                    4
                                                )}%`,
                                                ...riskColors[
                                                item.className
                                                ],
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div style={cardStyle}>
                    <SectionHeader
                        eyebrow="TOP RISK TASKS"
                        title="Highest risk exposure"
                        subtitle="Tasks ranked by AI risk score"
                    />

                    <div style={topRiskListStyle}>
                        {sortedTasks
                            .slice(0, 5)
                            .map((task, index) => (
                                <div
                                    key={task.id}
                                    style={
                                        topRiskItemStyle
                                    }
                                >
                                    <span
                                        style={
                                            rankStyle
                                        }
                                    >
                                        {index + 1}
                                    </span>

                                    <div
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                        <strong>
                                            {
                                                task.id
                                            }
                                        </strong>

                                        <small>
                                            {
                                                task.title
                                            }
                                        </small>
                                    </div>

                                    <div
                                        style={
                                            riskScoreStyle
                                        }
                                    >
                                        <strong>
                                            {
                                                task.risk
                                                    .score
                                            }
                                        </strong>

                                        <small>
                                            /100
                                        </small>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

            </section>

            <section style={aiInsightStyle}>
                <div style={aiInsightIconStyle}>
                    !
                </div>

                <div>
                    <div style={aiInsightLabelStyle}>
                        RISK INTERPRETATION
                    </div>

                    <h3 style={aiInsightTitleStyle}>
                        Risk exposure should guide scheduling priority
                    </h3>

                    <p style={aiInsightTextStyle}>
                        Higher-risk maintenance tasks should be
                        reviewed alongside block availability,
                        asset criticality and train traffic before
                        final plan approval.
                    </p>
                </div>
            </section>
        </div>
    );
}

/* ================================================= */
/* TRAFFIC ANALYTICS */
/* ================================================= */

function TrafficAnalytics({
    trains,
    trafficData,
}) {
    const passenger = trains.filter(
        (train) =>
            train.type === "Passenger"
    ).length;

    const goods = trains.filter(
        (train) =>
            train.type === "Goods"
    ).length;

    const conflicts = trains.filter(
        (train) =>
            train.status === "Conflict"
    ).length;

    return (
        <div style={stackStyle}>

            <section style={analyticsNumberGridSection}>
                <LargeMetric
                    label="Train movements"
                    value={trains.length}
                />

                <LargeMetric
                    label="Passenger services"
                    value={passenger}
                />

                <LargeMetric
                    label="Goods services"
                    value={goods}
                />

                <LargeMetric
                    label="Conflicting movements"
                    value={conflicts}
                />
            </section>

            <ChartCard
                title="Train traffic intensity"
                subtitle="Relative traffic load throughout the operating window"
                data={trafficData}
                suffix="%"
            />

            <section style={cardStyle}>
                <SectionHeader
                    eyebrow="TRAFFIC DISRUPTION"
                    title="Operational impact"
                    subtitle="Current train movement profile relevant to maintenance planning"
                />

                <div style={insightGridStyle}>
                    <InsightBox
                        title="Low"
                        label="Current disruption"
                        text="The generated AI plan currently indicates limited train disruption."
                    />

                    <InsightBox
                        title={`${trains.length}`}
                        label="Tracked movements"
                        text="Scheduled train movements are considered during block conflict analysis."
                    />

                    <InsightBox
                        title="AI"
                        label="Conflict detection"
                        text="Train windows are evaluated before assigning maintenance blocks."
                    />
                </div>
            </section>
        </div>
    );
}

/* ================================================= */
/* REUSABLE COMPONENTS */
/* ================================================= */

function AnalyticsKpi({
    label,
    value,
    change,
    description,
    tone,
}) {
    return (
        <div
            style={{
                ...kpiCardStyle,
                borderTop: `3px solid ${toneColors[tone]}`,
            }}
        >
            <span style={kpiLabelStyle}>
                {label}
            </span>

            <strong style={kpiValueStyle}>
                {value}
            </strong>

            <div style={kpiBottomStyle}>
                <span
                    style={{
                        color: toneColors[tone],
                        fontWeight: 700,
                    }}
                >
                    {change}
                </span>

                <span>
                    {description}
                </span>
            </div>
        </div>
    );
}

function SectionHeader({
    eyebrow,
    title,
    subtitle,
}) {
    return (
        <div style={sectionHeaderStyle}>
            <div>
                <div style={eyebrowStyle}>
                    {eyebrow}
                </div>

                <h2 style={sectionTitleStyle}>
                    {title}
                </h2>

                <p style={sectionSubtitleStyle}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

function WorkloadItem({
    label,
    value,
}) {
    return (
        <div style={workloadItemStyle}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function LargeMetric({
    label,
    value,
}) {
    return (
        <div style={largeMetricStyle}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function ChartCard({
    title,
    subtitle,
    data,
    suffix,
}) {
    return (
        <div style={cardStyle}>
            <SectionHeader
                eyebrow="TREND ANALYSIS"
                title={title}
                subtitle={subtitle}
            />

            <div style={chartWrapperStyle}>
                <div style={chartStyle}>
                    {data.map((item) => (
                        <div
                            key={item.label}
                            style={chartColumnStyle}
                        >
                            <div
                                style={{
                                    ...chartBarStyle,
                                    height: `${item.value}%`,
                                }}
                                title={`${item.value}${suffix}`}
                            >
                                <span
                                    style={
                                        chartTooltipStyle
                                    }
                                >
                                    {item.value}
                                    {suffix}
                                </span>
                            </div>

                            <small
                                style={
                                    chartLabelStyle
                                }
                            >
                                {item.label}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InsightBox({
    title,
    label,
    text,
}) {
    return (
        <div style={insightBoxStyle}>
            <strong>{title}</strong>

            <span>{label}</span>

            <p>{text}</p>
        </div>
    );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const pageStyle = {
    padding: "32px",
    maxWidth: "1200px",
    margin: "0 auto",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    marginBottom: "24px",
};

const eyebrowStyle = {
    fontSize: "11px",
    fontWeight: 800,
    color: "#2589c9",
    letterSpacing: "1px",
    marginBottom: "7px",
};

const titleStyle = {
    margin: 0,
    fontSize: "30px",
    color: "#17202a",
};

const subtitleStyle = {
    margin: "8px 0 0",
    color: "#6b7c8f",
    fontSize: "13px",
    lineHeight: 1.6,
    maxWidth: "720px",
};

const periodControlStyle = {
    display: "flex",
    padding: "4px",
    background: "#f1f4f6",
    borderRadius: "9px",
};

const periodButtonStyle = {
    border: "none",
    background: "transparent",
    padding: "8px 13px",
    borderRadius: "6px",
    color: "#687989",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
};

const activePeriodButtonStyle = {
    background: "#ffffff",
    color: "#2589c9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const kpiGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "22px",
};

const kpiCardStyle = {
    background: "#ffffff",
    border: "1px solid #dce3e8",
    borderRadius: "12px",
    padding: "18px",
};

const kpiLabelStyle = {
    display: "block",
    color: "#718092",
    fontSize: "11px",
    fontWeight: 700,
    marginBottom: "9px",
};

const kpiValueStyle = {
    display: "block",
    color: "#17202a",
    fontSize: "27px",
    marginBottom: "8px",
};

const kpiBottomStyle = {
    display: "flex",
    gap: "8px",
    fontSize: "11px",
    color: "#8996a2",
};

const toneColors = {
    green: "#20a36a",
    blue: "#2589c9",
    purple: "#7557c7",
    amber: "#c58a1c",
};

const metricTabsStyle = {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "22px",
};

const metricTabStyle = {
    border: "1px solid #dce3e8",
    background: "#ffffff",
    color: "#647586",
    padding: "9px 13px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
};

const activeMetricTabStyle = {
    background: "#eef7fd",
    color: "#2589c9",
    borderColor: "#b9dff5",
};

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #dce3e8",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "22px",
};

const twoColumnStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "22px",
};

const sectionHeaderStyle = {
    padding: "20px 22px",
    borderBottom: "1px solid #e7ecef",
};

const sectionTitleStyle = {
    margin: 0,
    color: "#17202a",
    fontSize: "18px",
};

const sectionSubtitleStyle = {
    margin: "5px 0 0",
    color: "#6d7d8c",
    fontSize: "12px",
    lineHeight: 1.5,
};

const workloadGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "10px",
};

const workloadItemStyle = {
    background: "#f7f9fb",
    borderRadius: "9px",
    padding: "14px",
};

const progressSectionStyle = {
    padding: "0 20px 20px",
};

const progressHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#607181",
    marginBottom: "7px",
};

const progressTrackStyle = {
    height: "8px",
    background: "#e9eef1",
    borderRadius: "10px",
    overflow: "hidden",
};

const progressFillStyle = {
    display: "block",
    height: "100%",
    background: "#2589c9",
    borderRadius: "10px",
};

const helperTextStyle = {
    display: "block",
    color: "#8a97a2",
    fontSize: "10px",
    marginTop: "7px",
};

const riskOverviewStyle = {
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "28px",
};

const riskCircleStyle = {
    width: "125px",
    height: "125px",
    minWidth: "125px",
    borderRadius: "50%",
    background:
        "linear-gradient(135deg, #eef7fd, #f7fbfd)",
    border: "8px solid #d7ebf8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

const riskLegendStyle = {
    flex: 1,
};

const riskLegendItemStyle = {
    display: "grid",
    gridTemplateColumns:
        "12px 1fr 30px 35px",
    alignItems: "center",
    gap: "8px",
    padding: "7px 0",
    fontSize: "12px",
    color: "#607181",
};

const riskDotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
};

const riskColors = {
    critical: {
        background: "#c0392b",
    },
    high: {
        background: "#d35400",
    },
    medium: {
        background: "#c69b17",
    },
    low: {
        background: "#20a36a",
    },
};

const chartWrapperStyle = {
    padding: "24px 22px 20px",
};

const chartStyle = {
    height: "210px",
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    borderBottom: "1px solid #dfe5e9",
    padding: "0 8px",
};

const chartColumnStyle = {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "7px",
};

const chartBarStyle = {
    width: "100%",
    maxWidth: "42px",
    minHeight: "12px",
    background:
        "linear-gradient(to top, #2589c9, #75bde5)",
    borderRadius: "6px 6px 0 0",
    position: "relative",
    cursor: "pointer",
};

const chartTooltipStyle = {
    position: "absolute",
    top: "-21px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "9px",
    color: "#647586",
    fontWeight: 700,
};

const chartLabelStyle = {
    color: "#87949f",
    fontSize: "10px",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
};

const thStyle = {
    textAlign: "left",
    padding: "13px 16px",
    color: "#718092",
    fontSize: "10px",
    letterSpacing: "0.6px",
    background: "#f7f9fb",
};

const tdStyle = {
    padding: "14px 16px",
    color: "#34495e",
    fontSize: "13px",
    verticalAlign: "middle",
};

const tableRowStyle = {
    borderTop: "1px solid #edf1f4",
};

const riskNumberStyle = {
    background: "#fff0dc",
    color: "#d35400",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: 700,
    fontSize: "11px",
};

const miniProgressWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const miniProgressTrack = {
    width: "100px",
    height: "6px",
    background: "#e8edf0",
    borderRadius: "8px",
    overflow: "hidden",
};

const miniProgressFill = {
    display: "block",
    height: "100%",
    background: "#20a36a",
    borderRadius: "8px",
};

const statusGoodStyle = {
    color: "#217a4d",
    background: "#e8f6ed",
    padding: "5px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 700,
};

const statusWarningStyle = {
    color: "#a56a00",
    background: "#fff4df",
    padding: "5px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 700,
};

const assetAnalyticsGrid = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "14px",
};

const assetAnalyticsCard = {
    border: "1px solid #e2e8ec",
    borderRadius: "11px",
    padding: "17px",
};

const assetAnalyticsTop = {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
};

const assetTypeStyle = {
    color: "#2589c9",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
};

const assetNameStyle = {
    margin: "5px 0 14px",
    fontSize: "15px",
    color: "#263746",
};

const availabilityValueStyle = {
    fontSize: "20px",
};

const availabilityTrackStyle = {
    height: "8px",
    background: "#e9eef1",
    borderRadius: "8px",
    overflow: "hidden",
};

const availabilityFillStyle = {
    display: "block",
    height: "100%",
    background: "#20a36a",
    borderRadius: "8px",
};

const assetAnalyticsFooter = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "9px",
    fontSize: "11px",
    color: "#84919d",
};

const stackStyle = {
    display: "flex",
    flexDirection: "column",
};

const analyticsNumberGrid = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "12px",
};

const analyticsNumberGridSection = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "22px",
};

const largeMetricStyle = {
    background: "#ffffff",
    border: "1px solid #dce3e8",
    borderRadius: "12px",
    padding: "20px",
};

const insightGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
    gap: "12px",
};

const insightBoxStyle = {
    background: "#f7f9fb",
    borderRadius: "10px",
    padding: "17px",
};

const horizontalBarTrack = {
    height: "8px",
    background: "#edf1f4",
    borderRadius: "8px",
    overflow: "hidden",
};

const horizontalBarFill = {
    display: "block",
    height: "100%",
    borderRadius: "8px",
};

const riskBarItemStyle = {
    marginBottom: "17px",
};

const riskBarHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
    color: "#607181",
    fontSize: "12px",
};

const topRiskListStyle = {
    padding: "8px 20px 20px",
};

const topRiskItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 0",
    borderBottom: "1px solid #edf1f4",
};

const rankStyle = {
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    background: "#f0f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
    color: "#647586",
};

const riskScoreStyle = {
    textAlign: "right",
    color: "#c0392b",
};

const riskPillStyle = {
    background: "#fff0dc",
    color: "#d35400",
    padding: "5px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 700,
};

const aiInsightStyle = {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    padding: "20px",
    background: "#f3f9fd",
    border: "1px solid #cfe7f6",
    borderRadius: "12px",
    marginTop: "2px",
};

const aiInsightIconStyle = {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "9px",
    background: "#2589c9",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
};

const aiInsightLabelStyle = {
    color: "#2589c9",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.8px",
};

const aiInsightTitleStyle = {
    margin: "5px 0",
    color: "#243746",
    fontSize: "15px",
};

const aiInsightTextStyle = {
    margin: 0,
    color: "#647586",
    fontSize: "12px",
    lineHeight: 1.6,
};

const insightBoxStrongStyle = {};

export default Analytics;
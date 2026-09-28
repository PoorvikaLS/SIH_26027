import { useMemo, useState } from "react";
import tasks from "../../data/tasks";
import { calculateRisk } from "../../utils/risk";

function AIPlanning() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("A");
    const [selectedScenario, setSelectedScenario] = useState("train-delay");

    const taskData = useMemo(() => {
        return tasks.map((task) => ({
            ...task,
            risk: calculateRisk(task),
        }));
    }, []);

    const planningSteps = [
        "Loading maintenance data",
        "Assessing asset criticality",
        "Calculating risk scores",
        "Checking train timetable",
        "Checking block availability",
        "Checking team availability",
        "Detecting conflicts",
        "Combining compatible tasks",
        "Optimizing maintenance schedule",
        "Generating alternative plans",
    ];

    const generatePlan = () => {
        setIsGenerating(true);
        setShowResults(false);
        setCompletedSteps([]);

        planningSteps.forEach((_, index) => {
            setTimeout(() => {
                setCompletedSteps((previous) => [...previous, index]);

                if (index === planningSteps.length - 1) {
                    setTimeout(() => {
                        setIsGenerating(false);
                        setShowResults(true);
                    }, 500);
                }
            }, (index + 1) * 500);
        });
    };

    const scheduledTasks = taskData.filter(
        (task) =>
            task.status === "Scheduled" ||
            task.status === "Planned"
    );

    const criticalTasks = taskData.filter(
        (task) => task.risk.severity === "Critical"
    );

    const awaitingBlock = taskData.filter(
        (task) => task.status === "Awaiting block"
    );

    const bundledTasks = taskData.filter(
        (task) =>
            task.section === "Bengaluru – Tumakuru" ||
            task.section === "Hassan – Mangaluru"
    );

    const alternativePlans = [
        {
            id: "A",
            name: "Plan A",
            title: "Balanced Operations",
            description:
                "Balances maintenance coverage, block usage and train operations.",
            coverage: "87%",
            blockUsage: "82%",
            disruption: "Low",
            riskExposure: "18%",
            assetAvailability: "91%",
            unscheduled: "2",
            conflicts: "2",
            blocks: "4",
            profile: "Balanced",
            reasoning:
                "Tasks are distributed across available maintenance windows while keeping higher-risk work visible and limiting operational conflicts.",
        },
        {
            id: "B",
            name: "Plan B",
            title: "Block Optimization",
            description:
                "Groups compatible work to reduce the number of maintenance blocks.",
            coverage: "84%",
            blockUsage: "68%",
            disruption: "Low–Medium",
            riskExposure: "21%",
            assetAvailability: "89%",
            unscheduled: "3",
            conflicts: "1",
            blocks: "3",
            profile: "Block-focused",
            reasoning:
                "Compatible tasks in the same corridor are grouped together, reducing the number of separate block requirements.",
        },
        {
            id: "C",
            name: "Plan C",
            title: "Reduced Train Disruption",
            description:
                "Spreads maintenance activity to reduce interference with train movements.",
            coverage: "81%",
            blockUsage: "76%",
            disruption: "Very Low",
            riskExposure: "24%",
            assetAvailability: "87%",
            unscheduled: "4",
            conflicts: "0",
            blocks: "4",
            profile: "Traffic-focused",
            reasoning:
                "Maintenance windows are spread across available periods to minimize interaction with train movements.",
        },
    ];

    const scenarios = [
        {
            id: "train-delay",
            icon: "◷",
            title: "Train Delay",
            shortTitle: "Train Delay",
            description:
                "A train movement is delayed and overlaps with a planned maintenance window.",
            impact:
                "The affected maintenance window must be shifted to avoid interference with train operations.",
            affectedTasks: "2",
            blocks: "1",
            disruption: "Medium",
            risk: "22%",
            unscheduled: "3",
            conflicts: "1",
            response:
                "Shift affected maintenance tasks to the next compatible block window and re-check train movement conflicts.",
        },
        {
            id: "emergency-defect",
            icon: "!",
            title: "Emergency Defect",
            shortTitle: "Emergency Defect",
            description:
                "A critical infrastructure defect is detected and requires immediate attention.",
            impact:
                "Emergency maintenance is inserted ahead of lower-priority planned work.",
            affectedTasks: "3",
            blocks: "1",
            disruption: "Medium",
            risk: "14%",
            unscheduled: "2",
            conflicts: "2",
            response:
                "Prioritize the emergency task, reserve the required maintenance block and move lower-priority work.",
        },
        {
            id: "block-cancellation",
            icon: "×",
            title: "Block Cancellation",
            shortTitle: "Block Cancellation",
            description:
                "A previously allocated maintenance block becomes unavailable.",
            impact:
                "Tasks assigned to the cancelled block need to be redistributed.",
            affectedTasks: "3",
            blocks: "3",
            disruption: "Low–Medium",
            risk: "24%",
            unscheduled: "4",
            conflicts: "1",
            response:
                "Reassign affected tasks to compatible blocks and preserve critical maintenance where possible.",
        },
        {
            id: "crew-unavailable",
            icon: "◉",
            title: "Crew Unavailable",
            shortTitle: "Crew Unavailable",
            description:
                "A maintenance team becomes unavailable during the planned work window.",
            impact:
                "Tasks requiring the unavailable team are delayed or reassigned.",
            affectedTasks: "2",
            blocks: "3",
            disruption: "Low",
            risk: "23%",
            unscheduled: "4",
            conflicts: "1",
            response:
                "Reallocate available teams and move tasks that cannot be safely staffed.",
        },
        {
            id: "traffic-increase",
            icon: "↗",
            title: "Traffic Increase",
            shortTitle: "Traffic Increase",
            description:
                "Train traffic increases on an active corridor.",
            impact:
                "Available maintenance windows become narrower because of increased train movements.",
            affectedTasks: "4",
            blocks: "4",
            disruption: "Medium",
            risk: "26%",
            unscheduled: "5",
            conflicts: "3",
            response:
                "Reduce maintenance windows during high-traffic periods and prioritize critical tasks.",
        },
        {
            id: "duration-increase",
            icon: "＋",
            title: "Maintenance Duration Increase",
            shortTitle: "Duration Increase",
            description:
                "Planned maintenance activities require more time than originally estimated.",
            impact:
                "Extended work windows create additional conflicts with subsequent activities.",
            affectedTasks: "3",
            blocks: "5",
            disruption: "Medium",
            risk: "25%",
            unscheduled: "4",
            conflicts: "3",
            response:
                "Extend compatible blocks where possible and reschedule overlapping lower-priority tasks.",
        },
    ];

    const activePlan = alternativePlans.find(
        (plan) => plan.id === selectedPlan
    );

    const activeScenario = scenarios.find(
        (scenario) => scenario.id === selectedScenario
    );

    return (
        <div style={pageStyle}>

            {/* HEADER */}
            <div style={{ marginBottom: "28px" }}>
                <div style={eyebrowStyle}>
                    AI INTELLIGENCE
                </div>

                <h1 style={titleStyle}>
                    AI Plan Generation
                </h1>

                <p style={subtitleStyle}>
                    Generate an optimized maintenance plan using risk,
                    train traffic, block availability and operational constraints.
                </p>
            </div>

            {/* CONTROL CARD */}
            <section style={heroCardStyle}>
                <div>
                    <div style={aiLabelStyle}>
                        ✦ AI PLANNER
                    </div>

                    <h2 style={heroTitleStyle}>
                        Generate optimized maintenance plan
                    </h2>

                    <p style={heroTextStyle}>
                        The AI planner evaluates maintenance priorities,
                        infrastructure risk, train movements and available
                        maintenance windows before generating a plan.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={generatePlan}
                    disabled={isGenerating}
                    style={{
                        ...generateButtonStyle,
                        opacity: isGenerating ? 0.7 : 1,
                        cursor: isGenerating ? "wait" : "pointer",
                    }}
                >
                    {isGenerating
                        ? "Generating..."
                        : "✦ Generate AI Plan"}
                </button>
            </section>

            {/* PROCESSING STEPS */}
            <section style={cardStyle}>
                <div style={sectionHeaderStyle}>
                    <div>
                        <h2 style={sectionTitleStyle}>
                            AI Planning Process
                        </h2>

                        <p style={sectionSubtitleStyle}>
                            Transparent planning pipeline — see exactly what
                            the AI evaluates before producing a schedule.
                        </p>
                    </div>

                    {isGenerating && (
                        <span style={processingBadgeStyle}>
                            ● PROCESSING
                        </span>
                    )}

                    {showResults && !isGenerating && (
                        <span style={completedBadgeStyle}>
                            ✓ COMPLETE
                        </span>
                    )}
                </div>

                <div style={stepsGridStyle}>
                    {planningSteps.map((step, index) => {
                        const completed = completedSteps.includes(index);
                        const current =
                            isGenerating &&
                            completedSteps.length === index;

                        return (
                            <div
                                key={step}
                                style={{
                                    ...stepStyle,
                                    borderColor: current
                                        ? "#2589c9"
                                        : completed
                                            ? "#cce6f5"
                                            : "#e1e7ec",
                                    background: current
                                        ? "#f1f9fe"
                                        : completed
                                            ? "#f7fbfd"
                                            : "#ffffff",
                                }}
                            >
                                <div
                                    style={{
                                        ...stepNumberStyle,
                                        background: completed
                                            ? "#20a36a"
                                            : current
                                                ? "#2589c9"
                                                : "#edf1f4",
                                        color:
                                            completed || current
                                                ? "#ffffff"
                                                : "#718092",
                                    }}
                                >
                                    {completed ? "✓" : index + 1}
                                </div>

                                <div>
                                    <strong
                                        style={{
                                            color: "#253746",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {step}
                                    </strong>

                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#7b8996",
                                            marginTop: "3px",
                                        }}
                                    >
                                        {completed
                                            ? "Completed"
                                            : current
                                                ? "Analyzing..."
                                                : "Waiting"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* RESULTS */}
            {showResults && (
                <>
                    {/* PLAN SUMMARY */}
                    <section style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div>
                                <h2 style={sectionTitleStyle}>
                                    Generated Maintenance Plan
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    AI-generated schedule based on current
                                    maintenance and operational data.
                                </p>
                            </div>

                            <span style={aiResultBadgeStyle}>
                                ✦ AI GENERATED
                            </span>
                        </div>

                        <div style={summaryGridStyle}>
                            <SummaryCard
                                label="Scheduled Tasks"
                                value={scheduledTasks.length}
                            />

                            <SummaryCard
                                label="Bundled Tasks"
                                value={bundledTasks.length}
                            />

                            <SummaryCard
                                label="Critical Tasks"
                                value={criticalTasks.length}
                            />

                            <SummaryCard
                                label="Awaiting Block"
                                value={awaitingBlock.length}
                            />

                            <SummaryCard
                                label="Conflicts Detected"
                                value="2"
                            />

                            <SummaryCard
                                label="Blocks Required"
                                value="4"
                            />
                        </div>
                    </section>

                    {/* GENERATED TASK TABLE */}
                    <section style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div>
                                <h2 style={sectionTitleStyle}>
                                    Recommended Schedule
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Tasks prioritized according to risk and
                                    operational compatibility.
                                </p>
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    minWidth: "800px",
                                }}
                            >
                                <thead>
                                    <tr style={{ background: "#f7f9fb" }}>
                                        <th style={thStyle}>TASK</th>
                                        <th style={thStyle}>SECTION</th>
                                        <th style={thStyle}>RISK</th>
                                        <th style={thStyle}>PRIORITY</th>
                                        <th style={thStyle}>BLOCK</th>
                                        <th style={thStyle}>AI DECISION</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {taskData.slice(0, 7).map((task, index) => (
                                        <tr
                                            key={task.id}
                                            style={{
                                                borderTop:
                                                    "1px solid #edf1f4",
                                            }}
                                        >
                                            <td style={tdStyle}>
                                                <strong>{task.id}</strong>

                                                <div
                                                    style={{
                                                        color: "#2589c9",
                                                        marginTop: "4px",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {task.title}
                                                </div>
                                            </td>

                                            <td style={tdStyle}>
                                                {task.section}
                                            </td>

                                            <td style={tdStyle}>
                                                <span
                                                    style={{
                                                        ...riskBadgeStyle,
                                                        background:
                                                            task.risk.severity ===
                                                                "Critical"
                                                                ? "#fde8e8"
                                                                : task.risk.severity ===
                                                                    "High"
                                                                    ? "#fff0dc"
                                                                    : task.risk.severity ===
                                                                        "Medium"
                                                                        ? "#fff7d6"
                                                                        : "#e8f6ed",
                                                        color:
                                                            task.risk.severity ===
                                                                "Critical"
                                                                ? "#c0392b"
                                                                : task.risk.severity ===
                                                                    "High"
                                                                    ? "#d35400"
                                                                    : task.risk.severity ===
                                                                        "Medium"
                                                                        ? "#9a7200"
                                                                        : "#217a4d",
                                                    }}
                                                >
                                                    {task.risk.severity}
                                                </span>

                                                <div
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#7b8996",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    {task.risk.score}/100
                                                </div>
                                            </td>

                                            <td style={tdStyle}>
                                                {task.priority}
                                            </td>

                                            <td style={tdStyle}>
                                                <strong>
                                                    BLK-
                                                    {2041 + index}
                                                </strong>
                                            </td>

                                            <td style={tdStyle}>
                                                <span
                                                    style={{
                                                        color:
                                                            task.risk.severity ===
                                                                "Critical"
                                                                ? "#c0392b"
                                                                : "#217a4d",
                                                        fontWeight: 700,
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {task.risk.severity ===
                                                        "Critical"
                                                        ? "Priority scheduling"
                                                        : "Scheduled"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ALTERNATIVE PLANS */}
                    <section style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div>
                                <div style={aiLabelStyle}>
                                    ✦ AI ALTERNATIVES
                                </div>

                                <h2 style={sectionTitleStyle}>
                                    Alternative Plans A / B / C
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Different scheduling strategies generated
                                    from the same maintenance and operational
                                    constraints.
                                </p>
                            </div>

                            <span style={alternativeBadgeStyle}>
                                3 OPTIONS
                            </span>
                        </div>

                        <div style={plansGridStyle}>
                            {alternativePlans.map((plan) => {
                                const selected =
                                    selectedPlan === plan.id;

                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedPlan(plan.id)
                                        }
                                        style={{
                                            ...planCardStyle,
                                            borderColor: selected
                                                ? "#2589c9"
                                                : "#dce3e8",
                                            background: selected
                                                ? "#f4faff"
                                                : "#ffffff",
                                        }}
                                    >
                                        <div style={planCardTopStyle}>
                                            <div
                                                style={{
                                                    ...planLetterStyle,
                                                    background: selected
                                                        ? "#2589c9"
                                                        : "#edf1f4",
                                                    color: selected
                                                        ? "#ffffff"
                                                        : "#607181",
                                                }}
                                            >
                                                {plan.id}
                                            </div>

                                            {selected && (
                                                <span
                                                    style={
                                                        selectedPlanBadgeStyle
                                                    }
                                                >
                                                    SELECTED
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                textAlign: "left",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#7b8996",
                                                    fontWeight: 700,
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                {plan.name}
                                            </div>

                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#243746",
                                                    fontSize: "17px",
                                                }}
                                            >
                                                {plan.title}
                                            </h3>

                                            <p
                                                style={{
                                                    color: "#6d7d8c",
                                                    fontSize: "12px",
                                                    lineHeight: 1.5,
                                                    margin:
                                                        "8px 0 14px",
                                                }}
                                            >
                                                {plan.description}
                                            </p>

                                            <span
                                                style={
                                                    profileBadgeStyle
                                                }
                                            >
                                                {plan.profile}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={selectedPlanContainerStyle}>
                            <div style={selectedPlanHeaderStyle}>
                                <div>
                                    <div style={aiLabelStyle}>
                                        PLAN {activePlan.id}
                                    </div>

                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "19px",
                                            color: "#17202a",
                                        }}
                                    >
                                        {activePlan.title}
                                    </h3>
                                </div>

                                <span style={profileBadgeStyle}>
                                    {activePlan.profile}
                                </span>
                            </div>

                            <p style={planReasoningStyle}>
                                {activePlan.reasoning}
                            </p>

                            <div style={metricsGridStyle}>
                                <Metric
                                    label="Maintenance Coverage"
                                    value={activePlan.coverage}
                                />

                                <Metric
                                    label="Block Usage"
                                    value={activePlan.blockUsage}
                                />

                                <Metric
                                    label="Train Disruption"
                                    value={activePlan.disruption}
                                />

                                <Metric
                                    label="Risk Exposure"
                                    value={activePlan.riskExposure}
                                />

                                <Metric
                                    label="Asset Availability"
                                    value={activePlan.assetAvailability}
                                />

                                <Metric
                                    label="Unscheduled Tasks"
                                    value={activePlan.unscheduled}
                                />

                                <Metric
                                    label="Conflicts"
                                    value={activePlan.conflicts}
                                />

                                <Metric
                                    label="Blocks Required"
                                    value={activePlan.blocks}
                                />
                            </div>
                        </div>
                    </section>

                    {/* PLAN COMPARISON */}
                    <section style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div>
                                <div style={aiLabelStyle}>
                                    ✦ COMPARISON
                                </div>

                                <h2 style={sectionTitleStyle}>
                                    Plan Comparison
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Compare the operational characteristics
                                    of each generated alternative.
                                </p>
                            </div>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    minWidth: "850px",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            background: "#f7f9fb",
                                        }}
                                    >
                                        <th style={comparisonThStyle}>
                                            METRIC
                                        </th>

                                        {alternativePlans.map((plan) => (
                                            <th
                                                key={plan.id}
                                                style={comparisonThStyle}
                                            >
                                                {plan.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    <ComparisonRow
                                        label="Maintenance coverage"
                                        values={alternativePlans.map(
                                            (plan) => plan.coverage
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Block usage"
                                        values={alternativePlans.map(
                                            (plan) => plan.blockUsage
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Train disruption"
                                        values={alternativePlans.map(
                                            (plan) => plan.disruption
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Risk exposure"
                                        values={alternativePlans.map(
                                            (plan) =>
                                                plan.riskExposure
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Asset availability"
                                        values={alternativePlans.map(
                                            (plan) =>
                                                plan.assetAvailability
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Unscheduled tasks"
                                        values={alternativePlans.map(
                                            (plan) =>
                                                plan.unscheduled
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Conflicts"
                                        values={alternativePlans.map(
                                            (plan) =>
                                                plan.conflicts
                                        )}
                                    />

                                    <ComparisonRow
                                        label="Blocks required"
                                        values={alternativePlans.map(
                                            (plan) => plan.blocks
                                        )}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ================================================= */}
                    {/* WHAT-IF SIMULATOR */}
                    {/* ================================================= */}

                    <section style={cardStyle}>
                        <div style={sectionHeaderStyle}>
                            <div>
                                <div style={aiLabelStyle}>
                                    ✦ WHAT-IF SIMULATOR
                                </div>

                                <h2 style={sectionTitleStyle}>
                                    Simulate Operational Changes
                                </h2>

                                <p style={sectionSubtitleStyle}>
                                    Test unexpected operational scenarios and
                                    see how the AI would adapt the maintenance
                                    plan.
                                </p>
                            </div>

                            <span style={simulationBadgeStyle}>
                                LIVE SIMULATION
                            </span>
                        </div>

                        {/* SCENARIO SELECTOR */}
                        <div style={scenarioGridStyle}>
                            {scenarios.map((scenario) => {
                                const selected =
                                    selectedScenario === scenario.id;

                                return (
                                    <button
                                        key={scenario.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedScenario(
                                                scenario.id
                                            )
                                        }
                                        style={{
                                            ...scenarioCardStyle,
                                            borderColor: selected
                                                ? "#2589c9"
                                                : "#dce3e8",
                                            background: selected
                                                ? "#f2f9fe"
                                                : "#ffffff",
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...scenarioIconStyle,
                                                background: selected
                                                    ? "#2589c9"
                                                    : "#edf3f7",
                                                color: selected
                                                    ? "#ffffff"
                                                    : "#607181",
                                            }}
                                        >
                                            {scenario.icon}
                                        </div>

                                        <div
                                            style={{
                                                textAlign: "left",
                                            }}
                                        >
                                            <strong
                                                style={{
                                                    display: "block",
                                                    color: "#253746",
                                                    fontSize: "13px",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                {scenario.title}
                                            </strong>

                                            <span
                                                style={{
                                                    color: "#7b8996",
                                                    fontSize: "11px",
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {scenario.description}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* CURRENT → SCENARIO → NEW PLAN */}
                        <div style={simulationFlowStyle}>

                            <SimulationStage
                                label="CURRENT PLAN"
                                number="01"
                                title="AI Generated Plan"
                                text="Current maintenance schedule before the scenario occurs."
                                type="current"
                            />

                            <div style={flowArrowStyle}>
                                →
                            </div>

                            <SimulationStage
                                label="SCENARIO"
                                number="02"
                                title={activeScenario.title}
                                text={activeScenario.impact}
                                type="scenario"
                            />

                            <div style={flowArrowStyle}>
                                →
                            </div>

                            <SimulationStage
                                label="NEW PLAN"
                                number="03"
                                title="AI Adjusted Plan"
                                text={activeScenario.response}
                                type="new"
                            />

                        </div>

                        {/* IMPACT SUMMARY */}
                        <div style={impactContainerStyle}>
                            <div style={impactHeaderStyle}>
                                <div>
                                    <div style={aiLabelStyle}>
                                        SCENARIO IMPACT
                                    </div>

                                    <h3
                                        style={{
                                            margin: 0,
                                            color: "#243746",
                                            fontSize: "17px",
                                        }}
                                    >
                                        {activeScenario.shortTitle}
                                    </h3>
                                </div>

                                <span style={scenarioActiveBadgeStyle}>
                                    SIMULATED
                                </span>
                            </div>

                            <div style={impactGridStyle}>
                                <ImpactMetric
                                    label="Affected Tasks"
                                    value={activeScenario.affectedTasks}
                                />

                                <ImpactMetric
                                    label="Blocks"
                                    value={activeScenario.blocks}
                                />

                                <ImpactMetric
                                    label="Train Disruption"
                                    value={
                                        activeScenario.disruption
                                    }
                                />

                                <ImpactMetric
                                    label="Risk Exposure"
                                    value={activeScenario.risk}
                                />

                                <ImpactMetric
                                    label="Unscheduled Tasks"
                                    value={
                                        activeScenario.unscheduled
                                    }
                                />

                                <ImpactMetric
                                    label="Conflicts"
                                    value={
                                        activeScenario.conflicts
                                    }
                                />
                            </div>
                        </div>

                        {/* AI RESPONSE */}
                        <div style={aiResponseStyle}>
                            <div
                                style={{
                                    ...aiResponseIconStyle,
                                    background: "#e8f6ed",
                                    color: "#217a4d",
                                }}
                            >
                                ✦
                            </div>

                            <div>
                                <strong
                                    style={{
                                        display: "block",
                                        color: "#263746",
                                        marginBottom: "5px",
                                        fontSize: "13px",
                                    }}
                                >
                                    AI Response
                                </strong>

                                <span
                                    style={{
                                        color: "#667787",
                                        fontSize: "13px",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {activeScenario.response}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* AI REASONING + PLAN STATUS */}
                    <section style={reasoningGridStyle}>

                        <div style={cardStyle}>
                            <div style={aiLabelStyle}>
                                ✦ AI REASONING
                            </div>

                            <h2 style={sectionTitleStyle}>
                                Why these recommendations?
                            </h2>

                            <div style={reasonListStyle}>
                                <Reason
                                    title="Risk-based prioritization"
                                    text="Higher-risk maintenance tasks are considered earlier in the planning process."
                                />

                                <Reason
                                    title="Block compatibility"
                                    text="Tasks requiring similar corridor access can be grouped into compatible maintenance windows."
                                />

                                <Reason
                                    title="Train disruption control"
                                    text="The planner considers train movement windows before assigning maintenance blocks."
                                />

                                <Reason
                                    title="Alternative strategy generation"
                                    text="Different plans change scheduling priorities so planners can compare operational trade-offs."
                                />

                                <Reason
                                    title="What-if adaptation"
                                    text="When an operational condition changes, the planner recalculates affected tasks and maintenance constraints."
                                />
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={aiLabelStyle}>
                                ✦ PLAN STATUS
                            </div>

                            <h2 style={sectionTitleStyle}>
                                Operational readiness
                            </h2>

                            <div style={readinessStyle}>
                                <div>
                                    <span>Maintenance coverage</span>
                                    <strong>87%</strong>
                                </div>

                                <div>
                                    <span>Block utilization</span>
                                    <strong>82%</strong>
                                </div>

                                <div>
                                    <span>Train disruption</span>
                                    <strong>Low</strong>
                                </div>

                                <div>
                                    <span>Critical tasks</span>
                                    <strong>
                                        {criticalTasks.length}
                                    </strong>
                                </div>
                            </div>
                        </div>

                    </section>
                </>
            )}
        </div>
    );
}

/* ================================================= */
/* SMALL COMPONENTS */
/* ================================================= */

function SummaryCard({ label, value }) {
    return (
        <div style={summaryCardStyle}>
            <span
                style={{
                    display: "block",
                    color: "#718092",
                    fontSize: "11px",
                    marginBottom: "7px",
                }}
            >
                {label}
            </span>

            <strong
                style={{
                    color: "#243746",
                    fontSize: "21px",
                }}
            >
                {value}
            </strong>
        </div>
    );
}

function Metric({ label, value }) {
    return (
        <div style={metricStyle}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function ComparisonRow({ label, values }) {
    return (
        <tr style={{ borderTop: "1px solid #edf1f4" }}>
            <td style={comparisonTdStyle}>
                <strong>{label}</strong>
            </td>

            {values.map((value, index) => (
                <td
                    key={`${label}-${index}`}
                    style={comparisonTdStyle}
                >
                    {value}
                </td>
            ))}
        </tr>
    );
}

function Reason({ title, text }) {
    return (
        <div
            style={{
                padding: "14px 0",
                borderBottom: "1px solid #edf1f4",
            }}
        >
            <strong
                style={{
                    display: "block",
                    color: "#263746",
                    marginBottom: "5px",
                }}
            >
                {title}
            </strong>

            <span
                style={{
                    color: "#6d7d8c",
                    fontSize: "13px",
                    lineHeight: 1.6,
                }}
            >
                {text}
            </span>
        </div>
    );
}

function SimulationStage({
    label,
    number,
    title,
    text,
    type,
}) {
    return (
        <div
            style={{
                ...simulationStageStyle,
                borderColor:
                    type === "scenario"
                        ? "#e5c87a"
                        : type === "new"
                            ? "#9bd7ba"
                            : "#cbdde8",
                background:
                    type === "scenario"
                        ? "#fffaf0"
                        : type === "new"
                            ? "#f3fbf7"
                            : "#f7fbfd",
            }}
        >
            <div style={stageTopStyle}>
                <span style={stageNumberStyle}>
                    {number}
                </span>

                <span
                    style={{
                        ...stageLabelStyle,
                        color:
                            type === "scenario"
                                ? "#a56a00"
                                : type === "new"
                                    ? "#217a4d"
                                    : "#2589c9",
                    }}
                >
                    {label}
                </span>
            </div>

            <h3 style={stageTitleStyle}>
                {title}
            </h3>

            <p style={stageTextStyle}>
                {text}
            </p>
        </div>
    );
}

function ImpactMetric({ label, value }) {
    return (
        <div style={impactMetricStyle}>
            <span>{label}</span>

            <strong>
                {value}
            </strong>
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

const eyebrowStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#2589c9",
    letterSpacing: "1px",
    marginBottom: "8px",
};

const titleStyle = {
    margin: 0,
    fontSize: "30px",
    color: "#17202a",
};

const subtitleStyle = {
    marginTop: "8px",
    color: "#6b7c8f",
};

const heroCardStyle = {
    background: "#ffffff",
    border: "1px solid #dce3e8",
    borderRadius: "14px",
    padding: "26px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginBottom: "22px",
};

const aiLabelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#2589c9",
    letterSpacing: "0.8px",
    marginBottom: "8px",
};

const heroTitleStyle = {
    margin: "0 0 8px",
    color: "#17202a",
    fontSize: "20px",
};

const heroTextStyle = {
    margin: 0,
    color: "#6b7c8f",
    maxWidth: "700px",
    lineHeight: 1.6,
    fontSize: "13px",
};

const generateButtonStyle = {
    border: "none",
    background: "#1f8acb",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "9px",
    fontWeight: 700,
    fontSize: "13px",
    whiteSpace: "nowrap",
};

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #dce3e8",
    borderRadius: "14px",
    marginBottom: "22px",
    overflow: "hidden",
};

const sectionHeaderStyle = {
    padding: "20px 22px",
    borderBottom: "1px solid #e5eaee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
};

const sectionTitleStyle = {
    margin: 0,
    fontSize: "18px",
    color: "#17202a",
};

const sectionSubtitleStyle = {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#6b7c8f",
};

const processingBadgeStyle = {
    background: "#fff4df",
    color: "#a56a00",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 700,
};

const completedBadgeStyle = {
    background: "#e8f6ed",
    color: "#217a4d",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 700,
};

const stepsGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "10px",
};

const stepStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "1px solid",
    borderRadius: "9px",
    transition: "all 0.2s ease",
};

const stepNumberStyle = {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
};

const aiResultBadgeStyle = {
    background: "#e8f6ed",
    color: "#217a4d",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 700,
};

const summaryGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(6, minmax(0, 1fr))",
    gap: "12px",
};

const summaryCardStyle = {
    padding: "16px",
    background: "#f7f9fb",
    borderRadius: "10px",
};

const thStyle = {
    textAlign: "left",
    padding: "14px 16px",
    color: "#6b7c8f",
    fontSize: "11px",
    letterSpacing: "0.5px",
};

const tdStyle = {
    padding: "15px 16px",
    color: "#34495e",
    verticalAlign: "top",
    fontSize: "13px",
};

const riskBadgeStyle = {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
};

const reasoningGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
    gap: "22px",
};

const reasonListStyle = {
    padding: "8px 22px 20px",
};

const readinessStyle = {
    padding: "18px 22px 22px",
};

const alternativeBadgeStyle = {
    background: "#eef6fc",
    color: "#2589c9",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 700,
};

const plansGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
    gap: "14px",
};

const planCardStyle = {
    border: "1px solid",
    borderRadius: "12px",
    padding: "18px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
};

const planCardTopStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
};

const planLetterStyle = {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "14px",
};

const selectedPlanBadgeStyle = {
    background: "#e8f6ed",
    color: "#217a4d",
    padding: "5px 7px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: 800,
};

const profileBadgeStyle = {
    display: "inline-block",
    background: "#f1f4f6",
    color: "#637384",
    padding: "5px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 700,
};

const selectedPlanContainerStyle = {
    margin: "0 20px 20px",
    padding: "20px",
    border: "1px solid #dce3e8",
    borderRadius: "12px",
    background: "#fbfcfd",
};

const selectedPlanHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "10px",
};

const planReasoningStyle = {
    margin: "0 0 18px",
    color: "#647586",
    fontSize: "13px",
    lineHeight: 1.6,
};

const metricsGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(4, minmax(0, 1fr))",
    gap: "10px",
};

const metricStyle = {
    background: "#ffffff",
    border: "1px solid #e5eaee",
    borderRadius: "9px",
    padding: "13px",
};

const comparisonThStyle = {
    textAlign: "left",
    padding: "14px 16px",
    color: "#667787",
    fontSize: "11px",
    letterSpacing: "0.5px",
};

const comparisonTdStyle = {
    padding: "14px 16px",
    color: "#34495e",
    fontSize: "13px",
    verticalAlign: "middle",
};

/* ================================================= */
/* WHAT-IF STYLES */
/* ================================================= */

const simulationBadgeStyle = {
    background: "#fff4df",
    color: "#a56a00",
    padding: "7px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 700,
};

const scenarioGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
    gap: "12px",
};

const scenarioCardStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    padding: "14px",
    border: "1px solid",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const scenarioIconStyle = {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "14px",
};

const simulationFlowStyle = {
    padding: "10px 20px 24px",
    display: "grid",
    gridTemplateColumns:
        "1fr auto 1fr auto 1fr",
    alignItems: "stretch",
    gap: "12px",
};

const simulationStageStyle = {
    border: "1px solid",
    borderRadius: "12px",
    padding: "17px",
    minHeight: "150px",
};

const stageTopStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
};

const stageNumberStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#edf1f4",
    color: "#637384",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
};

const stageLabelStyle = {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.7px",
};

const stageTitleStyle = {
    margin: "0 0 8px",
    color: "#263746",
    fontSize: "16px",
};

const stageTextStyle = {
    margin: 0,
    color: "#6d7d8c",
    fontSize: "12px",
    lineHeight: 1.6,
};

const flowArrowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#91a0ad",
    fontSize: "24px",
    fontWeight: 700,
};

const impactContainerStyle = {
    margin: "0 20px 20px",
    padding: "18px",
    border: "1px solid #dce3e8",
    borderRadius: "12px",
    background: "#fbfcfd",
};

const impactHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
};

const scenarioActiveBadgeStyle = {
    background: "#eef6fc",
    color: "#2589c9",
    padding: "6px 9px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 800,
};

const impactGridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(6, minmax(0, 1fr))",
    gap: "10px",
};

const impactMetricStyle = {
    background: "#ffffff",
    border: "1px solid #e5eaee",
    borderRadius: "9px",
    padding: "12px",
};

const aiResponseStyle = {
    margin: "0 20px 20px",
    padding: "16px",
    borderRadius: "10px",
    background: "#f7fbfd",
    border: "1px solid #dcecf5",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
};

const aiResponseIconStyle = {
    width: "30px",
    height: "30px",
    minWidth: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
};

export default AIPlanning;
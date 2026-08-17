export const intelligenceConfig = {
  cooldownMs: {
    TREND_CHANGE: 5 * 60 * 1000, // 5 simulated minutes
    CURRENT_STATUS: 15 * 60 * 1000,
    NETWORK_SUMMARY: 30 * 60 * 1000,
    ANOMALY: 1 * 60 * 1000,
  },
  priorityWeights: {
    CRITICAL_ALERT: 100,
    WARNING_ALERT: 50,
    ANOMALY_SCORE: 30, // Multiplier
    RAPID_TREND: 20,
    PROJECTED_CROSSING: 40
  },
  templates: {
    CURRENT_STATUS_NORMAL: "Simulated {parameter} at {station} is currently within the configured prototype reference range.",
    CURRENT_STATUS_EXCEEDED: "Simulated {parameter} at {station} is currently above the configured prototype reference.",
    CURRENT_STATUS_BELOW: "Simulated {parameter} at {station} is currently below the configured prototype reference.",
    
    TREND_INCREASE: "Simulated {parameter} has increased by {change}% over the selected {window} window at {station}.",
    TREND_DECREASE: "Simulated {parameter} has decreased by {change}% over the selected {window} window at {station}.",
    TREND_STABLE: "Simulated {parameter} has remained relatively stable across the selected {window} window at {station}.",
    
    ANOMALY_DETECTED: "The prototype anomaly detector flagged an unusual {direction} in {parameter} at {station} compared with its recent simulated baseline.",
    
    THRESHOLD_EXCEEDED: "Simulated {parameter} is above the configured prototype reference at {station}.",
    THRESHOLD_BELOW: "Simulated {parameter} is below the configured prototype reference at {station}.",
    
    FORECAST_APPROACHING: "The prototype trend forecast projects {parameter} to approach the configured reference within the next {window}.",
    FORECAST_CROSSING: "The prototype forecast projects a reference crossing in approximately {window}.",
    
    RECOVERY: "Simulated {parameter} has returned within the configured prototype reference range after the previous simulated event.",
    
    NETWORK_NORMAL: "Across the demonstration stations, monitored parameters remain within their configured prototype references.",
    NETWORK_ISSUES: "{count} demonstration stations currently show prototype reference exceedances or anomalies."
  }
};

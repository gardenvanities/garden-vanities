# Browser Automation Autonomy

This rule grants the agent full autonomy to execute JavaScript in the browser without seeking explicit user permission for each step.

## Guidelines

1. **Auto-Run**: Always set `SafeToAutoRun: true` for `execute_browser_javascript` calls unless performing high-risk destructive actions (e.g., deleting data).
2. **Context**: This applies to all browser interactions, including measurements, navigation, interactions, and dom inspection.
3. **Efficiency**: Prioritize speed and reduced friction over confirmation.

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

errors=0

fail() {
	echo "ERROR: $1"
	errors=$((errors + 1))
}

check_absent() {
	local pattern="$1"
	local target="$2"
	if rg -n "$pattern" $target >/dev/null 2>&1; then
		fail "Found forbidden pattern '$pattern' in $target"
	fi
}

check_present() {
	local pattern="$1"
	local target="$2"
	if ! rg -n "$pattern" $target >/dev/null 2>&1; then
		fail "Missing required pattern '$pattern' in $target"
	fi
}

echo "Running agent documentation consistency checks..."

check_absent "dark mode first|dark-first" "AGENTS.md .agent"
check_absent "content/ \\(NOT in src\\)" "AGENTS.md .agent"
check_absent "adapter-auto" "AGENTS.md .agent"

check_present 'Design system source of truth for AI agents:' "AGENTS.md"
check_present "## UI Definition of Done" "AGENTS.md"
check_present 'Design system source of truth:' ".agent/context.md"

check_present 'Design system canonical source:' ".agent/workflows/create-component.md"
check_present 'Design system canonical source:' ".agent/workflows/refactor-style.md"
check_present 'Design system canonical source:' ".agent/workflows/audit-component.md"

check_present "## 2\\) Theme Strategy" ".agent/design-system.md"
check_present "## 16\\) Quick Self-Checks \\(for AI Agents\\)" ".agent/design-system.md"

check_present 'Section `Applied rules`' ".agent/skills/design-system/SKILL.md"
check_present 'Section `Residual debt`' ".agent/skills/design-system/SKILL.md"

if [[ "$errors" -gt 0 ]]; then
	echo "Consistency check failed with $errors error(s)."
	exit 1
fi

echo "Consistency check passed."

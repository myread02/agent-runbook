# Minimal agent harness

Give coding agents a shared way to check the project, complete one feature, and leave a handoff that another agent can resume. The workflow and feature list format stay the same across projects. Each project supplies its own commands, architecture rules, acceptance criteria, and initial feature data. [Learn Harness Engineering templates](https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/), [Anthropic's research on long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents).

## Set up a project

Set up these four parts in the project root. The startup entry point can be a file or an existing project command.

| Part | What to configure |
| --- | --- |
| `AGENTS.md` | The shared instructions. Merge the workflow into existing instructions and retain project rules such as module boundaries and quality thresholds. [Runbook template](AGENTS.md), [AGENTS.md format](https://agents.md/). |
| Startup entry point | A documented command that checks for required tools, runs the project's baseline checks, and reports version control status if available. If implemented as a script, resolve project paths relative to the script so it also works when called from a subdirectory. Make it executable where the project expects direct execution. Return a nonzero exit status for missing tools or failed checks and preserve existing workspace changes. |
| `feature_list.json` | A JSON array of features. Each feature has a unique `id`, a `name`, a `description`, an `acceptance_criteria` array of testable statements, and a `status` of `todo` or `done`. Seed `done` entries only when existing verification supports them. |
| `agent-progress.md` | A handoff log with newest entries first. Record the date, feature ID or task, changes, verification commands and results, blockers, and the next step. Record the harness setup and its actual verification results in the first entry. |

Document the full verification command or sequence alongside the startup command. Include any extra checks required by the affected environment. A project can use its existing task runner or a script suited to its environment, such as `init.sh` in a project that uses Bash.

A new `feature_list.json` can start with one item.

```json
[
  {
    "id": "FEAT-001",
    "name": "Export filtered results",
    "description": "Let users download the results matching the current filter as CSV.",
    "acceptance_criteria": [
      "The CSV contains a header and only rows matching the current filter.",
      "When no rows match, the CSV contains only the header."
    ],
    "status": "todo"
  }
]
```

## Start an agent session

Open the project in your coding agent. If the tool does not load the root `AGENTS.md` automatically, ask it to read the file before starting. You can also attach the file or paste it into the session. If your agent supports user-wide instructions, you can put the instruction to read the project's `AGENTS.md` there. Tools that use a different instruction file may also support importing the shared runbook. [Claude Code loading and imports](https://code.claude.com/docs/en/memory#agentsmd).

To assign a specific feature, use a prompt like this.

> Read the root `AGENTS.md` and follow it. Complete FEAT-001.

To continue a handoff, use this prompt.

> Read the root `AGENTS.md` and follow it. Resume the unfinished feature named in the latest handoff. If no feature is named, pick one `todo` from `feature_list.json`.

The agent runs the baseline checks before editing, works on one feature, and records the verification results in the handoff. A failed, interrupted, or unavailable required check keeps the feature at `todo`. The handoff should identify the blocker and the next step. In a version-controlled project, the agent commits the verified changes locally.

## Verify the setup

1. Check the startup command's syntax where applicable. Invoke it from the project root and from a subdirectory. Simulate a failed check and confirm the command returns nonzero. Confirm that it reports existing workspace changes without modifying them.
2. Parse `feature_list.json` and check required fields, unique IDs, and valid statuses. For each seeded `done` entry, confirm which existing test or other check verifies its acceptance criteria.
3. Run the project's full verification and write the results in the first progress entry. Rehearse a handoff with an unfinished item and confirm the next session can identify it. Confirm a failed or interrupted required check leaves that item at `todo`.
4. If the project uses version control, commit the verified harness setup together in one local commit.

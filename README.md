# Agent runbook

Use this runbook to give coding agents a shared workflow for scoped changes, verification, and handoffs. The instructions live in `AGENTS.md` and work with any coding agent that can read them and access your project.

## Set up a project

1. Copy [AGENTS.md](AGENTS.md) to your project's root. If you already have an `AGENTS.md`, merge the workflow into it and keep your project-specific instructions.
2. In your project's README, document the commands agents should use for setup, tests, lint, and builds. If you already have an `init.sh` that runs setup and baseline checks, identify it as the startup command.
3. Add the optional tracking files if you want agents to pick up work across sessions. You can keep an existing progress log under its current name by documenting its path in your project's README.

| Optional file | What it holds |
| --- | --- |
| `feature_list.json` | Work items that agents can pick up. Use `"todo"` for pending work and `"done"` for completed, verified work. |
| `agent-progress.md` | A handoff log with the work completed, check results, open issues, and the next step. |

For example, a new `feature_list.json` can start with one item.

```json
[
  {
    "id": "csv-export",
    "summary": "Add CSV export for the filtered results",
    "status": "todo"
  }
]
```

## Start an agent session

Open the project in your coding agent. If it loads `AGENTS.md` automatically, give it the task directly. Otherwise, ask it to read the file before starting. If it can't read files by path, attach `AGENTS.md` or paste its contents into the session.

For an assigned task, you can use this prompt.

> Read `AGENTS.md` and follow it. Add CSV export for the filtered results.

If you use a tracker and want the agent to choose the task, use this prompt.

> Read `AGENTS.md` and follow it. Pick one item marked `todo` in `feature_list.json` and complete it.

At the end of the session, look for a summary of the change, which checks ran, and any remaining blockers. In projects with tracking files, the next agent can use the progress log and feature tracker to resume the work.

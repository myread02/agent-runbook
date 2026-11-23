# Initialize the project’s agent harness

Work in the project the user wants to initialize. If its root already has an `AGENTS.md`, read it and follow the local project rules. Keep existing files and workspace changes intact.

1. Fetch the [shared AGENTS.md template](https://raw.githubusercontent.com/myread02/agent-runbook/main/AGENTS.md) using your HTTP fetch tool. If you have `curl`, this command prints the template for review.

   ```sh
   curl --fail --silent --show-error https://raw.githubusercontent.com/myread02/agent-runbook/main/AGENTS.md
   ```

2. Read the target project’s README, manifests, task definitions, and CI configuration where available. Identify its documented dependency setup, baseline checks, and full verification commands. Run the existing startup procedure, or run the documented setup and baseline checks in order. Record failures and pause feature work if a required check fails. For a new project without an existing toolchain, use the stack the user specified and record any checks that are still unavailable.
3. Create `AGENTS.md` at the project root from the template, or merge the workflow into the existing file. Retain project-specific architecture rules and quality requirements. Document the startup and verification commands in the project’s README or instructions. Reuse an existing startup command, or add one in the project’s toolchain if it needs a single entry point.
4. Keep existing feature entries. If there is no `feature_list.json`, create it as a JSON array. Use `[]` when there are no known features to seed. Each feature has a unique `id`, a `name`, a `description`, an `acceptance_criteria` array of testable statements, and a `status` of `todo` or `done`. Seed `done` only where existing checks verify the acceptance criteria.
5. Run the project’s full applicable verification. Check the documented startup entry point and parse `feature_list.json`. Add an entry at the top of `agent-progress.md` or the project’s existing handoff log with the date, task, files changed, commands and results, blockers, and next step. A tracked item stays `todo` until all required checks pass.
6. Review the changes and report what you verified. For a version-controlled project, apply the project’s commit rules and keep the harness changes together.

See the [harness setup guide](https://raw.githubusercontent.com/myread02/agent-runbook/main/README.md) for the feature list example and handoff checks.

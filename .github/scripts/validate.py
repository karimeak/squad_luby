#!/usr/bin/env python3
"""
Validate squad_luby repo structure:
  1. squad.yaml and pipeline.yaml files parse as valid YAML
  2. agents/*.agent.md files have valid frontmatter with required fields
  3. pipeline.yaml step `file:` paths exist on disk
"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
SQUADS = ROOT / "squads"
SKIP_DIRS = {"nao-usados", "luby-video-machine"}

REQUIRED_AGENT_FIELDS = {"name", "icon", "execution"}
VALID_EXECUTIONS = {"inline", "subagent"}

errors: list[str] = []


def err(path: Path, msg: str) -> None:
    errors.append(f"{path}: {msg}")


def parse_frontmatter(text: str):
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", text, re.DOTALL)
    if not match:
        return None
    return yaml.safe_load(match.group(1))


def validate_squad(squad_dir: Path) -> None:
    squad_yaml = squad_dir / "squad.yaml"
    if not squad_yaml.exists():
        return

    try:
        yaml.safe_load(squad_yaml.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        err(squad_yaml.relative_to(ROOT), f"invalid YAML: {exc}")
        return

    pipeline_yaml = squad_dir / "pipeline" / "pipeline.yaml"
    pipeline_data = None
    if pipeline_yaml.exists():
        try:
            pipeline_data = yaml.safe_load(pipeline_yaml.read_text(encoding="utf-8"))
        except yaml.YAMLError as exc:
            err(pipeline_yaml.relative_to(ROOT), f"invalid YAML: {exc}")

    if isinstance(pipeline_data, dict) and isinstance(pipeline_data.get("steps"), list):
        for step in pipeline_data["steps"]:
            if not isinstance(step, dict):
                continue
            file_rel = step.get("file")
            if not file_rel:
                continue
            step_file = squad_dir / "pipeline" / file_rel
            if not step_file.exists():
                err(
                    pipeline_yaml.relative_to(ROOT),
                    f"step {step.get('id', '?')!r} references missing file: {file_rel}",
                )

    agents_dir = squad_dir / "agents"
    if not agents_dir.exists():
        return

    for agent_md in sorted(agents_dir.glob("*.agent.md")):
        rel = agent_md.relative_to(ROOT)
        text = agent_md.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        if not isinstance(fm, dict):
            err(rel, "no valid YAML frontmatter between --- markers")
            continue
        missing = sorted(REQUIRED_AGENT_FIELDS - set(fm.keys()))
        if missing:
            err(rel, f"frontmatter missing fields: {missing}")
        exec_val = fm.get("execution")
        if exec_val and exec_val not in VALID_EXECUTIONS:
            err(
                rel,
                f"execution must be 'inline' or 'subagent', got: {exec_val!r}",
            )


def main() -> int:
    if not SQUADS.exists():
        print(f"squads/ directory not found at {SQUADS}", file=sys.stderr)
        return 1

    for squad_dir in sorted(SQUADS.iterdir()):
        if not squad_dir.is_dir() or squad_dir.name in SKIP_DIRS:
            continue
        validate_squad(squad_dir)

    if errors:
        for line in errors:
            print(line)
        print(f"\n{len(errors)} validation error(s)")
        return 1

    print("All squads validated")
    return 0


if __name__ == "__main__":
    sys.exit(main())

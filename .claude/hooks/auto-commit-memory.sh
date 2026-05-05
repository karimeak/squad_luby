#!/usr/bin/env bash
# Auto-commit + push of squad memory/state files at end of each session.
# Single squad touched -> commits to auto/<squad>. Multi-squad -> commits to current branch.
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

mapfile -t changed < <(git status --porcelain -- 'squads/*/_memory/*.md' 'squads/*/state.json' 2>/dev/null | awk '{print $NF}')
[ "${#changed[@]}" -eq 0 ] && exit 0

mapfile -t squads < <(printf '%s\n' "${changed[@]}" | awk -F/ '{print $2}' | sort -u)

original_branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "${#squads[@]}" -eq 1 ]; then
  squad="${squads[0]}"
  branch="auto/${squad}"

  git stash push --include-untracked --quiet \
    -m "auto-commit-memory" \
    -- "squads/${squad}/_memory" "squads/${squad}/state.json" 2>/dev/null || true

  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    git checkout --quiet "${branch}"
  elif git ls-remote --exit-code --heads origin "${branch}" >/dev/null 2>&1; then
    git fetch --quiet origin "${branch}"
    git checkout --quiet -b "${branch}" "origin/${branch}"
  else
    git checkout --quiet -b "${branch}"
  fi

  git stash pop --quiet 2>/dev/null || true

  git add "squads/${squad}/_memory" "squads/${squad}/state.json" 2>/dev/null || true
  if ! git diff --cached --quiet; then
    git commit --quiet -m "chore(${squad}): atualiza memory após run"
    git push --quiet -u origin "${branch}" || echo "[auto-commit-memory] push falhou para ${branch}"
  fi

  git checkout --quiet "${original_branch}" 2>/dev/null || true
else
  list="$(IFS=,; echo "${squads[*]}")"
  for f in "${changed[@]}"; do git add "$f" 2>/dev/null || true; done
  if ! git diff --cached --quiet; then
    git commit --quiet -m "chore(squads): atualiza memory após runs (${list})"
    git push --quiet origin "${original_branch}" || echo "[auto-commit-memory] push falhou para ${original_branch}"
  fi
fi

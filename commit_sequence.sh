#!/bin/bash
set -e

REPO_DIR="/Users/yugpokharel/Documents/Code/Web/application_tracker"
cd "$REPO_DIR"

commit_with_gap() {
  local msg="$1"
  local gap="${2:-600}"
  git add -A
  if git diff --cached --quiet; then
    echo "Nothing to commit for: $msg"
  else
    git commit -m "$msg"
    echo "✓ Committed: $msg"
  fi
  echo "  Waiting ${gap}s before next commit..."
  sleep "$gap"
}

echo "=== Starting 22-commit sequence ==="

git add -A
git commit -m "chore: initial project scaffold with monorepo structure" 2>/dev/null || true

sleep 600

commit_with_gap "chore: add backend package.json with Express, Prisma, Zod" 600
commit_with_gap "chore: add frontend package.json with Next.js and Tailwind" 600
commit_with_gap "feat: prisma schema with enums JobType and Status" 600
commit_with_gap "feat: root monorepo package.json with workspace scripts" 600
commit_with_gap "feat: backend env config with required variable validation" 600
commit_with_gap "feat: prisma singleton database client" 600
commit_with_gap "feat: shared domain types and DTOs" 600
commit_with_gap "feat: zod validation schemas for application endpoints" 600
commit_with_gap "feat: application service layer with all CRUD operations" 600
commit_with_gap "feat: reusable zod validation middleware" 600
commit_with_gap "feat: global error handler and 404 middleware" 600
commit_with_gap "feat: application controller - thin HTTP handlers" 600
commit_with_gap "feat: express router and central route registry" 600
commit_with_gap "feat: express app factory with CORS and middleware stack" 600
commit_with_gap "feat: server entry with graceful shutdown" 600
commit_with_gap "feat: frontend typed API client lib/api.ts" 600
commit_with_gap "feat: StatusBadge component with color-coded statuses" 600
commit_with_gap "feat: LoadingSkeleton and ConfirmDeleteModal components" 600
commit_with_gap "feat: ApplicationForm modal with validation" 600
commit_with_gap "feat: ApplicationTable, DashboardStats, SearchBar, StatusFilter" 600
commit_with_gap "feat: main dashboard page wiring all components" 180

git add -A
git commit -m "docs: comprehensive README with setup and API reference" 2>/dev/null || true

echo ""
echo "=== All commits done. Pushing to GitHub... ==="
git push -u origin main

echo "=== Done! ==="

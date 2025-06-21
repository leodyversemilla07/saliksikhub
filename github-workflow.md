## Daily Workflow

### 1. Sync with `main`

Before starting work each day:

```bash
git checkout main
git pull origin main
```

---

### 2. Create a feature or task branch

Create a new branch for each feature or fix:

```bash
git checkout -b your-branch-name
```

**Branch naming suggestions:**

-   `feat-login-page`
-   `fix-navbar`
-   `style-homepage`

---

### 3. Work on your branch

Make code changes and commit them in small, logical chunks:

```bash
git add .
git commit -m "Add login form validation"
```

Push your branch:

```bash
git push -u origin your-branch-name
```

---

### 4. Open a Pull Request (PR)

On GitHub:

-   Click "Compare & Pull Request"
-   Write a brief title and description
-   Assign your partner as the reviewer

---

### 5. Review and Merge

-   The reviewer checks the code and requests changes or approves
-   Once approved, click "Merge" into `main`
-   Optionally delete the branch after merging

---

### 6. Pull the latest changes

After a PR is merged, all team members should sync:

```bash
git checkout main
git pull origin main
```

---

## Tips

-   Do not work directly on `main`.
-   Use one branch per feature or bug fix.
-   Keep commit messages concise but descriptive.
-   Resolve merge conflicts during the PR process if they occur.

---

## Summary

| Action           | Command Example                                |
| ---------------- | ---------------------------------------------- |
| Clone repo       | `git clone <repo-url>`                         |
| Create branch    | `git checkout -b feat-task`                    |
| Commit & push    | `git add . && git commit -m "..." && git push` |
| Pull latest main | `git checkout main && git pull`                |
| Merge feature    | GitHub PR → Review → Merge                     |

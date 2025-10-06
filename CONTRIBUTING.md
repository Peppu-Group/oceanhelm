# 🛠️ CONTRIBUTING.md

Thanks for wanting to contribute to **Chiaka's Birthday Gift Registry**! Your time and effort are appreciated. Please follow these guidelines to make collaboration smooth and fast.

---

## 🔀 Branching & Workflow

1. **Fork** the repository to your personal account.
2. **Create a branch** for your work. Use a clear name, for example:
   - `feature/your-feature-name`
   - `fix/description-of-fix`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** on that branch.
4. **Test locally on your device** before submitting a Pull Request (PR). Run the project's tests and confirm manual checks as appropriate for your change.
5. **Push your branch** to your fork and open a Pull Request against the repository's `main` branch (or the branch referenced in the issue).

---

## ✅ Pull Request Guidelines

When you open a PR, please include:
- A short, descriptive title.
- A clear description of what you changed and why.
- Links to any related issue(s) (e.g., `Closes #123`) if applicable.
- Steps to reproduce and verification steps for reviewers (how we can test your change).

We will **review and test** your PR. If further changes are needed, we will request them through review comments. We may also run CI checks and manual tests as part of the review process.

We reserve the right **not to merge** any pull request that appears incomplete, suspicious, or harmful. If your PR is rejected, we'll try to explain why so you can improve it.

---

## ⚠️ Database Access (Important Banner)

> 🚫 **DATABASE ACCESS — READ THIS FIRST**  
> We **will not provide access** to our database under *any* circumstances. Do **not** request credentials or direct database access. All database credentials and environments are securely managed by the core team and will not be shared.
>
> If you believe an issue is **database-related**, **do not** ask for access — instead, **comment on the issue** with:
> - A clear description of the problem
> - Exact steps to reproduce
> - Any error messages or log excerpts (sanitized; remove secrets)
> - Your environment (OS, browser, app version) and device details
> - Screenshots or sample data (sanitized) that help reproduce the issue

This information helps the maintainers investigate without exposing sensitive data.

---

## 🐞 Reporting Problems

If you hit a problem while contributing:
1. Search existing issues first — someone might have already reported it.
2. If not found, **open a new issue** with a reproducible example and clear details.
3. If you suspect the problem is database-related, post a **detailed comment** on the issue (see instructions above). Do **not** request database credentials or access.

---

## 🧹 Code Quality & Tests

- Keep changes focused and small where possible.
- Write clear, readable commits and messages.
- Add or update tests when appropriate and ensure they pass locally before opening a PR.

---

## 🧾 Final Notes & Thanks

Thanks for helping improve this project! We value clear communication, respectful collaboration, and secure handling of data. If you need clarification about the contribution process, please open an issue and tag a maintainer.

---

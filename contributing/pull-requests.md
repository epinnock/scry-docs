# Pull Requests

Guidelines for submitting pull requests.

## Before You Start

1. **Check existing issues** - Is there already an issue for this?
2. **Discuss large changes** - Open an issue first for significant changes
3. **Read the docs** - Understand the codebase
4. **Set up development** - Follow [Development Setup](/contributing/development)

## Creating a Pull Request

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/scry-node.git
cd scry-node

# Add upstream remote
git remote add upstream https://github.com/epinnock/scry-node.git
```

### 2. Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/my-feature
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

### 3. Make Changes

Follow our [Code Style](/contributing/code-style) guidelines:

- Write TypeScript
- Add tests for new features
- Update documentation if needed
- Keep commits focused

### 4. Commit Changes

Write clear commit messages:

```bash
# Good commit messages
git commit -m "feat: add presigned URL expiration option"
git commit -m "fix: handle empty ZIP files gracefully"
git commit -m "docs: add self-hosting troubleshooting section"

# Conventional commit format
# type(scope): description
#
# Types: feat, fix, docs, style, refactor, test, chore
```

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/my-feature
```

Then create PR on GitHub.

## PR Template

Use this template when creating a PR:

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

Describe tests you ran.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally with my changes

## Related Issues

Closes #123
```

## Review Process

### What Reviewers Look For

1. **Code quality** - Follows style guidelines
2. **Test coverage** - New code has tests
3. **Documentation** - Updated where needed
4. **Performance** - No obvious issues
5. **Security** - No vulnerabilities introduced

### Addressing Feedback

```bash
# Make requested changes
git commit -m "address review feedback"

# Or amend if single change
git commit --amend
git push --force-with-lease
```

### Getting Reviews

- Be patient - reviews may take a few days
- Respond to all comments
- Ask questions if feedback is unclear
- Request re-review after making changes

## Merge Requirements

PRs must meet these criteria:

- [ ] All CI checks pass
- [ ] At least one approval from maintainer
- [ ] No unresolved conversations
- [ ] Up to date with main branch

### Keeping Up to Date

```bash
# Update your branch
git fetch upstream
git rebase upstream/main

# Resolve any conflicts
git push --force-with-lease
```

## After Merge

1. **Delete your branch** (GitHub offers this)
2. **Update local main**:

```bash
git checkout main
git pull upstream main
git branch -d feature/my-feature
```

## Quick Fixes

### Typos and Documentation

For simple fixes:

1. Edit directly on GitHub
2. Use "Create a new branch for this commit and start a pull request"
3. Submit PR

### Small Bug Fixes

Can be done without opening an issue first, but include:
- Clear description of the bug
- Steps to reproduce
- How the fix addresses it

## Large Changes

### Feature Proposals

1. **Open an issue first** describing the feature
2. **Wait for maintainer feedback**
3. **Discuss implementation approach**
4. **Then start coding**

### Breaking Changes

1. **Discuss thoroughly** before starting
2. **Provide migration guide**
3. **Consider deprecation period**
4. **Update all documentation**

## Tips for Good PRs

### Keep PRs Small

- One feature/fix per PR
- Easier to review
- Faster to merge
- Less risk

### Write Good Descriptions

- Explain the "why" not just the "what"
- Include screenshots for UI changes
- Link to related issues

### Test Thoroughly

- Run all tests locally
- Test edge cases
- Test on different environments if applicable

### Respond Promptly

- Address feedback quickly
- Keep the conversation going
- Be open to suggestions

## Help Wanted

Look for issues labeled:

- `good first issue` - Great for new contributors
- `help wanted` - Maintainers would appreciate help
- `documentation` - Docs improvements needed
- `bug` - Known bugs to fix

## Next Steps

- [Development Setup](/contributing/development) - Set up your environment
- [Code Style](/contributing/code-style) - Coding conventions
- [Testing](/contributing/testing) - Writing tests

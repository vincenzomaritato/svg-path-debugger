# Contributing to SVG Path Debugger

Thank you for your interest in contributing to SVG Path Debugger! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - A clear, descriptive title
   - Detailed description of the feature
   - Use cases and benefits
   - Any mockups or examples

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Run tests and ensure they pass
5. Update documentation if needed
6. Submit a pull request

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/vmaritato/svg-path-debugger.git
cd svg-path-debugger
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Update tests when modifying existing features

## Project Structure

```
svg-path-debugger/
├── src/
│   ├── components/     # React components
│   ├── styles/        # CSS files
│   └── utils/         # Utility functions
├── public/            # Static assets
└── tests/            # Test files
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

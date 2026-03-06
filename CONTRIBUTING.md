# Contributing to Maintix

Thank you for your interest in contributing to Maintix! Please see the full [Contributing Guide](docs/contributing.md) for detailed instructions on:

- Setting up your development environment
- Branch naming conventions
- Code style and linting
- Commit message format
- Pull request process

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/maintix.git
cd maintix

# Install dependencies
pnpm install

# Start dev databases
docker compose up -d

# Run database migrations
pnpm --filter @maintix/database db:push

# Seed demo data
pnpm --filter @maintix/database db:seed

# Start all apps in dev mode
pnpm dev
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

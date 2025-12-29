# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

**IMPORTANT: This project uses Yarn (v1.22.19) as its package manager. Always use `yarn` commands instead of `npm` for dependency management and script execution.**

## Development Commands

### Build
```bash
# Build all packages in the monorepo
yarn build

# Type check all packages
yarn tsc
```

### Testing
```bash
# Run tests in core package
cd packages/core && yarn test

# Run tests in react package
cd packages/react && yarn test

# Run tests with coverage in react package
cd packages/react && yarn coverage
```

### Linting
```bash
# Lint all files from root
yarn lint
```

### Documentation
```bash
# Generate documentation with TypeDoc
yarn docs
```

### Installing Dependencies
```bash
# Install all dependencies
yarn install

# Add a new dependency to a specific package
cd packages/core && yarn add <package-name>
cd packages/react && yarn add <package-name>
```

## Architecture

This is a Lerna monorepo containing two main packages:

1. **landingai** (`packages/core/`) - Core JavaScript library for LandingLens API integration
   - Provides API client for inference endpoints
   - Contains utility functions for annotations, colors, and math operations
   - Exports TypeScript types for predictions and API responses

2. **landingai-react** (`packages/react/`) - React components library
   - Provides React components for image collection and inference visualization
   - Uses React Context API for API configuration (`InferenceContext`)
   - Main components: `PhotoCollector`, `InferenceResult`, and annotation visualizers

### Key Dependencies
- Build tools: esbuild for bundling, TypeScript for type checking
- Testing: Jest for core package, Vitest for React package
- Monorepo management: Lerna with Yarn workspaces
- React versions supported: 16.8.0+ and 17.0.0

### Code Conventions
- ESLint configuration requires semicolons and single quotes
- TypeScript strict mode is enabled
- Component CSS uses CSS modules (`.module.css` files)
- All public APIs are exported through package index files
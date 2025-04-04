# Freecash.com Test Automation

This repository contains automated tests for Freecash.com, including UI tests with Playwright and load tests with k6.

## Project Structure

```
freecash.com/
├── .github/
│   └── workflows/         # CI/CD workflows
├── e2e/                   # End-to-end tests
├── k6/                    # k6 load testing scripts
│   ├── login/             # Login-specific load tests
│   └── utils/             # Utilities for k6 tests
├── playwright-report/     # HTML test reports
├── test-results/          # Test artifacts (screenshots, videos)
├── tests/                 # Playwright test suite
│   └── fixtures/          # Test data and fixtures
├── tests-examples/        # Example tests
├── .gitignore
├── package.json           # Project dependencies and scripts
└── playwright.config.ts   # Playwright configuration
```

## Features

- **UI Test Automation**: Comprehensive test coverage for Freecash.com using Playwright
- **Cross-browser Testing**: Tests run across Chromium, Firefox, and WebKit
- **Mobile Testing**: Support for mobile Chrome and Safari
- **Load Testing**: K6 scripts for performance and stress testing

## Test Scope

### UI Tests

The Playwright tests cover:

- Login functionality (email/password)
- Third-party authentication (Google, Facebook, Steam)
- Captcha challenge functionality
- Security and validation testing
- Responsive design testing

### Load Tests

K6 load testing scenarios:

- Regular load testing (simulating normal traffic)
- Spike testing (sudden traffic surges)
- Stress testing (finding breaking points)

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- k6 for load testing

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install browsers:

```bash
npm run install:browsers
```

## Running Tests

### Playwright UI Tests

Run all tests:
```bash
npm test
```

Run with UI mode:
```bash
npm run test:ui
```

Run specific tests:
```bash
npm run test:login        # Run login tests
```

Run on specific browsers:
```bash
npm run test:chromium     # Run on Chrome
npm run test:firefox      # Run on Firefox
npm run test:webkit       # Run on Safari
npm run test:mobile       # Run on mobile browsers
```

Debug tests:
```bash
npm run test:debug
npm run test:headed
```

### k6 Load Tests

Run load testing scenarios:

```bash
npm run k6:load           # Normal load test
npm run k6:spike          # Spike test
npm run k6:stress         # Stress test
```

## Test Reports

After running Playwright tests, view the HTML report:

```bash
npm run report
```

## CI/CD Integration

Tests are configured to run in CI environments with appropriate retry and reporting strategies defined in `playwright.config.ts`.

## Project Configuration

### Playwright Configuration

The `playwright.config.ts` file contains settings for:

- Test directories
- Timeouts
- Browser configurations
- Reporting options
- Test retry strategies
- Screenshot and video capture settings

### k6 Configuration

Load testing parameters for k6 are configured within each script file:

- `k6/login/login-load.js`: Normal load patterns
- `k6/login/login-spike.js`: Traffic spike patterns
- `k6/login/login-stress.js`: Stress test configurations

## License

ISC
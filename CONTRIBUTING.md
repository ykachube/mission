# Contributing to Mission Control

Thank you for your interest in contributing to Mission Control! This document provides guidelines and information to help make the process as smooth as possible.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat all contributors and users with respect and professionalism.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes with a clear, descriptive commit message
7. Push your changes to your fork
8. Submit a pull request to the main repository

## Development Setup

1. Install Node.js (v14 or higher)
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   cd src/frontend
   npm install
   cd ../..
   ```
4. Start the development servers:
   ```bash
   # In one terminal
   npm run dev
   
   # In another terminal
   cd src/frontend
   npm start
   ```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the README.md with details of changes to the interface, if applicable
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
4. Your Pull Request will be reviewed by maintainers, who may request changes or ask questions
5. Once approved, your Pull Request will be merged

## Reporting Issues

If you find a bug or have a feature request, please check the existing issues first to avoid duplicates. If your issue is new, please create a new issue with:

1. A clear, descriptive title
2. A detailed description of the problem or enhancement
3. Steps to reproduce (for bugs)
4. Expected and actual behavior (for bugs)
5. Screenshots, if applicable

## Code Style

This project uses TypeScript and follows common React and Node.js best practices. Please ensure your code:

1. Follows the existing code style
2. Includes appropriate comments for complex logic
3. Is well-tested
4. Does not introduce unnecessary dependencies

## Questions?

If you have any questions about contributing, feel free to create an issue asking for clarification.
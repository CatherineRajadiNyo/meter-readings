# Flo Energy - Meter Readings Processing System

A Next.js application for processing and storing NEM12 meter data files. This system provides an API endpoint for uploading and processing NEM12 files, with real-time progress updates and SQL generation for database storage.

## Features

- NEM12 file validation and processing
- Real-time progress updates during file processing
- SQL statement generation for database storage
- Edge runtime support for improved performance
- Type-safe implementation with TypeScript
- Modular and maintainable code structure

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```

## API Usage

### Process NEM12 File

**Endpoint:** `POST /api/nem12/process`

**Request:**

- Content-Type: `multipart/form-data`
- Body: Form data with a file field named 'file' containing the NEM12 CSV file

**Response:**

- Content-Type: `text/event-stream`
- Stream of progress updates and processing results

### Testing

Run tests:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Building

1. Build for production:
   ```bash
   yarn build
   ```
2. View production build:
   ```bash
   yarn start
   ```

## Deploy on Vercel

Check out the [assignment here](https://flo-energy.vercel.app/)

## Technical Design & Architecture

### Technology Advantages

1. **Next.js**

   - Server-side rendering and API routes in a single framework
   - Built-in Edge Runtime support for improved performance

2. **TypeScript**

   - Static type checking catches errors at compile time
   - Self-documenting code through type definitions
   - Improved maintainability and refactoring safety

3. **Jest & Testing Library**

   - Comprehensive testing framework for both unit and integration tests
   - Built-in mocking capabilities
   - Snapshot testing for UI components
   - TypeScript support

4. **shadcn/ui**

   - High-quality, accessible components out of the box
   - Fully customizable through Tailwind CSS
   - Copy-paste components into your project (no dependencies)
   - Built on Radix UI primitives for accessibility
   - Consistent design system across the application
   - Easy to modify and extend components
   - Type-safe with TypeScript

5. **Tailwind CSS**
   - Utility-first approach for rapid UI development
   - Consistent design tokens and spacing
   - Built-in responsive design utilities
   - Small bundle size through PurgeCSS
   - Great developer experience with IntelliSense
   - Seamless integration with shadcn/ui

### Project Structure

```
src/
├── app/                 # Next.js application routes
│   └── api/             # API endpoints
│       └── nem12/       # NEM12 processing endpoints
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── FileUpload/  # PascalCase for component folders
│   │   │   ├── index.tsx
│   │   │   └── __tests__/
│   │   │       └── FileUpload.test.tsx
│   │   └── Button/      # Another component
│   │       ├── index.tsx
│   │       └── __tests__/
│   │           └── Button.test.tsx
│   └── pages/           # Page-specific components
│       └── home/        # Home page components
│           ├── components/  # Page-specific components
│           │   ├── FileList/
│           │   │   ├── index.tsx
│           │   │   └── __tests__/
│           │   │       └── FileList.test.tsx
│           │   └── StatusBar/
│           │       ├── index.tsx
│           │       └── __tests__/
│           │           └── StatusBar.test.tsx
│           ├── hooks/      # Page-specific hooks
│           │   ├── useFileData/
│           │   │   ├── index.ts
│           │   │   └── __tests__/
│           │   │       └── useFileData.test.ts
│           │   └── useStatus/
│           │       ├── index.ts
│           │       └── __tests__/
│           │           └── useStatus.test.ts
│           └── utils/      # Page-specific utilities
│               ├── formatData.ts
│               └── __tests__/
│                   └── formatData.test.ts
├── lib/                 # Framework-level utilities
│   └── utils.ts         # Common utilities (e.g., Tailwind helpers)
├── types/               # TypeScript type definitions
│   └── nem12/           # NEM12 specific types
├── utils/               # Application-specific utilities
│   ├── nem12/           # NEM12 processing utilities
│   └── sql/             # SQL generation utilities
└── __tests__/           # Non-component tests
    ├── integration/     # Integration tests
    ├── api/             # API endpoint tests
    ├── utils/           # Utility function tests
    └── e2e/             # End-to-end tests
```

### Readability & Maintainability

1. **Clear Separation of Concerns**

   - Each module has a single responsibility
   - Business logic is isolated from API handling
   - Utility functions are pure and testable
   - Clear boundaries between layers

2. **Type Safety**

   - Comprehensive TypeScript types for all entities
   - Strict type checking enabled
   - Interface-driven development
   - Self-documenting code through types

3. **Modular Architecture**

   - Small, focused modules
   - Clear dependency direction
   - Easy to test individual components
   - Simple to extend or modify functionality

4. **Configuration**

   - Use ESLint for code linting
   - Use Prettier for code formatting

5. **Tests**

   - Tests are co-located with the code they test
   - Clear ownership of tests by each module
   - Easy to find and maintain tests
   - Clear separation between unit and integration tests

### Design Patterns & Conventions

1. **Design Patterns**

   - Observer Pattern for real-time updates (Server Side - Subject, Client Side - Observer)

2. **Coding Conventions**

   - PascalCase for React component folders and files (e.g., `FileUpload/`, `Button.tsx`)
   - kebab-case for utility folders and files (e.g., `file-upload.ts`, `data-processor.ts`)
   - camelCase for non-component JavaScript/TypeScript files (e.g., `useFileUpload.ts`, `formatDate.ts`)
   - Clear directory structure
   - Meaningful variable and function names
   - Comprehensive JSDoc comments

3. **Documentation Practices**

   - README with setup and usage instructions
   - Inline code documentation
   - Type definitions as documentation

4. **Quality Assurance**

   - Pre-commit hooks for linting and type checking
   - ESLint and Prettier for consistent formatting

### Areas for Improvement

1. Add proper form validation
2. Add notification/toast for better feedback to improve UX
3. Implement comprehensive test coverage
4. Add performance testing for file processing
5. Write more descriptive commit messages

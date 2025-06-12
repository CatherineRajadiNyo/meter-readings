# Flo Energy - Meter Readings Processing System

A Next.js application for processing and storing NEM12 meter data files. This system provides an API endpoint for uploading and processing NEM12 files, with real-time progress updates and SQL generation for database storage.

## Features

- NEM12 file validation and processing
- Real-time progress updates during file processing
- SQL statement generation for database storage
- Edge runtime support for improved performance
- Type-safe implementation with TypeScript
- Modular and maintainable code structure

## Project Structure

```
src/
├── app/                    # Next.js application routes
│   └── api/               # API endpoints
│       └── nem12/         # NEM12 processing endpoints
├── types/                 # TypeScript type definitions
│   └── nem12/            # NEM12 specific types
├── utils/                 # Utility functions
│   ├── nem12/            # NEM12 processing utilities
│   └── sql/              # SQL generation utilities
└── __tests__/            # Test files
```

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

## Development

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Use Prettier for code formatting

### Testing

Run tests:

```bash
yarn test
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

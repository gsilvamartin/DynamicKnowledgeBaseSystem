# Dynamic Knowledge Base System

A RESTful API for managing interconnected topics and resources with version control, user roles, and permissions.

## Features

- Topic management with hierarchical structure
- Resource management with different types (video, article, PDF, link)
- Version control for topics
- User role-based access control (Admin, Editor, Viewer)
- Request validation and error handling
- Comprehensive logging
- TypeScript support
- Test coverage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dynamic-knowledge-base-system.git
cd dynamic-knowledge-base-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Building for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Topics

- `POST /api/topics` - Create a new topic
- `GET /api/topics/:id` - Get a topic by ID
- `PUT /api/topics/:id` - Update a topic
- `DELETE /api/topics/:id` - Delete a topic
- `GET /api/topics/:id/versions` - Get topic versions
- `GET /api/topics/:id/version/:version` - Get specific version
- `GET /api/topics/:id/hierarchy` - Get topic hierarchy
- `GET /api/topics/:startId/path/:endId` - Find shortest path between topics

### Resources

- `POST /api/resources` - Create a new resource
- `GET /api/resources/:id` - Get a resource by ID
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource
- `GET /api/resources/topic/:topicId` - Get resources by topic
- `GET /api/resources/type/:type` - Get resources by type

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/role/:role` - Get users by role

## Project Structure

```
src/
├── controllers/     # Request handlers
├── interfaces/      # TypeScript interfaces
├── middleware/      # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 
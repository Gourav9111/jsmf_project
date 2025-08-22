# Overview

Jay Shree Mahakal Finance Service (JSMF) is a comprehensive loan management platform serving customers, DSA (Direct Sales Agent) partners, and administrators. The application provides loan origination services including personal loans, business loans, home loans, and loan against property, with features for application management, partner onboarding, and administrative oversight.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a React-based frontend with TypeScript, built using Vite as the build tool. The architecture follows a component-based design with:
- **UI Framework**: Shadcn/ui components with Radix UI primitives for consistent, accessible interface elements
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The backend is built on Express.js with TypeScript, following a RESTful API pattern:
- **Server Framework**: Express.js with middleware for session management, logging, and error handling
- **Session Management**: Express-session with PostgreSQL session store for user authentication
- **API Structure**: Role-based routing with middleware for authentication and authorization (admin, DSA, user roles)
- **Development Setup**: Hot reload with Vite integration for seamless development experience

## Data Storage Solutions
- **Database**: PostgreSQL as the primary database with Neon as the serverless provider
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Design**: Relational model with tables for users, loan applications, DSA partners, leads, and contact queries
- **Data Validation**: Zod schemas for runtime type checking and API validation

## Authentication and Authorization
- **Session-based Authentication**: Server-side sessions stored in PostgreSQL
- **Role-based Access Control**: Three distinct user roles (admin, DSA, user) with specific permissions
- **Middleware Protection**: Route-level authentication and role verification
- **Security**: Password hashing with bcrypt and secure session configuration

## External Dependencies

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Replit Integration**: Development environment with cartographer plugin and runtime error overlay

### UI and Styling Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants management

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **Drizzle Kit**: Database schema management and migrations

### External Integrations
- **Google Fonts**: Web fonts for typography (DM Sans, Architects Daughter, Fira Code, Geist Mono)
- **Unsplash**: Stock photography for service illustrations
- **Replit Services**: Development banner and cartographer for debugging

The application is designed as a monorepo with shared schema definitions, enabling type safety across client and server boundaries while maintaining clear separation of concerns between different user roles and their respective dashboards.
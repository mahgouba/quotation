# Vehicle Quotation System

## Overview

This is a full-stack vehicle quotation system built with React and Express. The application allows users to create, manage, and export vehicle price quotations with a focus on Arabic language support and right-to-left (RTL) layout. The system features a modern UI built with shadcn/ui components and Tailwind CSS, with backend support for data persistence using PostgreSQL and Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks with TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Build Tool**: Vite for development and building
- **Language Support**: Arabic (RTL) with English fallback

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **API Style**: RESTful API structure
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development**: tsx for TypeScript execution

### Key Design Decisions

1. **Monorepo Structure**: The application uses a monorepo approach with shared types and schemas between client and server
2. **Type Safety**: Full TypeScript implementation across the stack with shared type definitions
3. **Component Architecture**: Modular UI components using shadcn/ui for consistency and maintainability
4. **Database First**: Database schema defined in shared directory for type safety
5. **Modern Tooling**: Vite for fast development, ESBuild for production builds

## Key Components

### Frontend Components
- **VehicleQuotation**: Main application component for creating and managing quotations
- **UI Components**: Complete shadcn/ui component library including forms, dialogs, tables, etc.
- **Shared Types**: TypeScript definitions shared between client and server

### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Handler**: Express route registration system
- **Database Schema**: Drizzle ORM schema definitions
- **Middleware**: Request logging and error handling

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Extensible Design**: Schema designed to accommodate additional vehicle quotation entities

## Data Flow

1. **Client Request**: React components make API calls using TanStack React Query
2. **Server Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM manages database interactions with type safety
4. **Response Handling**: JSON responses with proper error handling and logging
5. **State Management**: React Query handles caching and state synchronization

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Radix UI, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Utilities**: date-fns, lucide-react icons

### Backend Dependencies
- **Database**: Neon PostgreSQL, Drizzle ORM
- **Web Framework**: Express.js
- **Development**: tsx, esbuild for building
- **Validation**: Zod for schema validation

### Development Tools
- **Build System**: Vite with React plugin
- **Code Quality**: TypeScript for type checking
- **Development Experience**: Replit-specific plugins for enhanced development

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds the React application to `dist/public`
2. **Server Build**: esbuild bundles the Express server to `dist/index.js`
3. **Asset Handling**: Static assets served from built client directory

### Environment Configuration
- **Development**: Local development with tsx and Vite dev server
- **Production**: Node.js server serving built static files
- **Database**: PostgreSQL connection via environment variables

### Database Migration
- **Schema Management**: Drizzle Kit for database migrations
- **Push Strategy**: Direct schema push for development/staging environments

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Enhanced quotation system with:
  * Professional A4-style layout with action buttons in separate header section
  * PDF header with company logo, QR code, and company information
  * Enhanced WhatsApp integration with custom phone number input
  * PDF export directly downloads and can be shared via WhatsApp
  * Company information management (name, address, phone, email, logo)
  * QR code generation for quotation details
  * Improved file upload interface with click-to-upload functionality
  * Real-time price calculations with Arabic number-to-words conversion
- July 03, 2025. Database integration:
  * PostgreSQL database with comprehensive schema for quotations, customers, vehicles, and companies
  * Full CRUD API endpoints for all entities
  * Database storage layer with Drizzle ORM
  * Save functionality integrated with database
  * Complete quotation management with relational data
- July 03, 2025. Search and specifications enhancement:
  * Added comprehensive search page with QR code scanning capability
  * Integrated detailed vehicle specifications database based on make/model/year
  * Auto-population of vehicle specifications when selecting make, model, and year
  * Navigation header with links between main form and search functionality
  * Enhanced quotations API to include customer, vehicle, and company details for search
  * Arabic vehicle specifications including engine, power, dimensions, and features
- July 03, 2025. Vehicle Management System:
  * Created dedicated vehicle management page for data administration
  * Added comprehensive form for adding new vehicle specifications
  * Implemented filtering system by make, model, and year
  * Database schema for vehicle specifications with complete CRUD operations
  * Tabbed interface with specifications management and summary statistics
  * Full navigation integration between all system pages
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
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
- July 03, 2025. Enhanced Data Management System:
  * Added sales representatives management with company associations
  * Enhanced company data with registration and tax numbers
  * Created comprehensive data management page with three main tabs
  * Simplified vehicle specifications form (make/model/year/engine + formatted specifications)
  * Complete CRUD operations for sales representatives and companies
  * Integrated filtering and statistics across all data types
  * Full API endpoints for sales representatives management
  * Added navigation back buttons to all secondary pages
  * Fixed all TypeScript and API integration issues
- July 03, 2025. Enhanced Company Integration:
  * Added company logo upload functionality to data management system
  * Enhanced company selection interface in main quotation page with prominent company picker
  * Removed statistics cards for cleaner data management interface
  * Company logos now display in selection dropdowns and quotation headers
  * Improved company data integration with PDF generation and quotation headers
  * Streamlined sales representative management without company associations
- July 03, 2025. Company Branding & Color Customization:
  * Added company color customization fields (primary, secondary, text, background)
  * Enhanced database schema with color fields for companies
  * Implemented live color preview in company management interface
  * Applied company colors automatically to PDF quotation headers and content
  * Custom color picker interface with hex code input support
  * Real-time theme application to quotation design based on selected company
- July 03, 2025. Company Stamp Integration:
  * Added company stamp upload functionality to data management interface
  * Enhanced database schema with stamp field for companies
  * Integrated company stamp display in PDF quotation headers (watermark style)
  * Added stamp column to company management table
  * Company stamps appear in natural size in quotation signature area
  * Automatic stamp application when company is selected for quotations
- July 03, 2025. Simplified Interface:
  * Removed stamp and signature upload sections from main quotation form
  * Removed stamp upload from company data management interface
  * Removed stamp column from company management table
  * Simplified PDF signature area to focus on company stamp from database only
  * Cleaner interface focusing on essential quotation data
- July 03, 2025. Advanced PDF Templating System:
  * Implemented comprehensive PDF template engine with 4 predefined layouts (modern, classic, minimal, corporate)
  * Added custom template editor with color picker, layout options, and typography controls
  * Integrated template selector component with live preview functionality
  * Advanced PDF generation using jsPDF with RTL support and Arabic text handling
  * Template customization includes header styles, table formats, spacing, and visual elements
  * PDF preview and export functionality with template-specific file naming
  * Sales representative integration with template system for personalized quotations
- July 05, 2025. Enhanced PDF System & Data Management:
  * Added automatic quotation numbering system to database schema and PDF generation
  * Enhanced PDF templates with detailed vehicle specifications display
  * Integrated sales representative data in PDF footer sections
  * Added company stamp/seal upload functionality and positioning in PDF (bottom right)
  * Removed signature fields and replaced with company seal integration
  * Fixed action buttons functionality in data management interfaces
  * Enhanced delete operations for vehicle specifications and sales representatives
  * Improved PDF layout with better organization of specifications and company branding
- July 05, 2025. PDF Template Redesign to Match User Sample:
  * Completely redesigned PDF layout to match provided template format
  * Added date headers (issue date right, deadline left) at top of document
  * Repositioned company logo to top-right and quotation number to top-left
  * Added formal Arabic greeting section: "تحية طيبة وبعد"
  * Enhanced vehicle specifications display with comprehensive technical details
  * Redesigned pricing summary as boxed section at bottom of quotation
  * Added formal terms and conditions section with delivery and warranty info
  * Improved company signature section with proper Arabic business closing
  * Removed template selector interface for simplified user experience
- July 05, 2025. Complete Template System Removal:
  * Removed entire PDF template engine and related files (pdf-templates.ts)
  * Created simplified PDF generator (pdf-generator.ts) with direct PDF creation
  * Eliminated template selection interface and related components
  * Updated quotation page to use simplified PDF generation
  * Streamlined codebase by removing template-related variables and functions
  * Maintained modern design with black header/footer, gold accents, and professional layout
- July 05, 2025. ALBARIMI-Style PDF Design Implementation:
  * Completely redesigned PDF to match ALBARIMI corporate template format
  * Implemented dark teal (#00627F) and gold (#C79C45) color scheme
  * Added proper Arabic RTL layout with company logo placement
  * Created structured sections: header, customer/vehicle data, specifications, pricing summary
  * Added comprehensive offer summary with detailed pricing breakdown
  * Integrated representative information, QR code, and terms/conditions
  * Included signature area and professional footer with contact information
  * Optimized for A4 printing with proper spacing and professional appearance
- July 05, 2025. Vehicle Brand Logo PNG Upload System:
  * Changed vehicle logo input from URL to PNG file upload in data management interface
  * Added file validation to accept only PNG format for brand logos
  * Enhanced vehicle specifications table to display uploaded brand logos
  * Integrated logo upload functionality for both new and existing vehicle specifications
  * Updated quotation preview to show brand logos from database entries
  * Added visual feedback with logo preview in management interface
- July 05, 2025. PDF Layout Improvements and Three-Column Footer:
  * Fixed company name display in PDF header to show proper Arabic names
  * Redesigned bottom section with three organized columns in single row
  * Right column: Sales representative information (name, phone, email)
  * Center column: Terms and conditions summary with key points
  * Left column: Price summary with QR code and signature area
  * Improved spacing and alignment for better professional appearance
  * Enhanced readability with proper section titles and clear data organization
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
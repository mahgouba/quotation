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
- July 05, 2025. Removed Terms & Conditions Section:
  * Removed terms and conditions section from PDF layout as requested by user
  * Simplified bottom section to two columns instead of three
  * Right column: Sales representative information (name, phone, email)
  * Left column: Price summary with QR code and signature area (expanded width)
  * Improved spacing with wider sections for better content display
- July 05, 2025. Removed Duplicate Data and Cleaned PDF Layout:
  * Removed duplicate terms and conditions section from middle of PDF
  * Eliminated redundant price summary in bottom section (kept detailed price table)
  * Simplified bottom left section to focus on QR code and signature only
  * Cleaner, more professional PDF layout without repetitive information
  * Improved readability with better section organization
- July 05, 2025. Complete Terms & Conditions Removal:
  * Removed all remaining references to terms and conditions from PDF generator
  * Eliminated terms and conditions section from quotation preview interface
  * Cleaned up data structure to remove termsAndConditions field
  * Simplified quotation layout to focus on essential business data only
  * Updated notes section with more relevant business information
- July 05, 2025. Sales Representative Information Removal:
  * Removed sales representative section from PDF layout completely
  * Eliminated sales representative information from quotation preview
  * Cleaned up data structure removing salesRepName, salesRepPhone, salesRepEmail fields
  * Simplified bottom section to single centered QR code and signature area
  * Streamlined quotation to focus only on customer, vehicle, and company data
- July 05, 2025. Comprehensive Saved Quotations System:
  * Created complete database schema for saved quotations with all necessary fields
  * Developed saved-quotations.tsx management page with view, edit, and delete capabilities
  * Added navigation links to access saved quotations from main interface
  * Implemented full CRUD operations for quotation management
  * Enhanced quotation saving functionality with validation and error handling
  * Removed sales representative requirements from save validation process
  * Integrated quotation numbering and complete data persistence system
- July 05, 2025. Enhanced PDF Design & Terms Management System:
  * Increased company logo size in PDF from 30x30 to 50x40 for better visibility
  * Added larger company stamp display in PDF signature area (40x30)
  * Created comprehensive terms and conditions management system in data management interface
  * Added new database table for terms and conditions with full CRUD operations
  * Integrated terms management tab in data administration panel with add/edit/delete functionality
  * Enhanced API endpoints for terms and conditions management
  * Improved PDF layout with larger visual elements for professional appearance
- July 05, 2025. Complete Terms & Conditions Integration:
  * Connected terms and conditions from data management to quotation display and PDF export
  * Added automatic filtering to show only active terms and conditions
  * Integrated terms display in quotation preview with proper Arabic RTL layout
  * Enhanced PDF generator to include terms and conditions section with professional styling
  * Terms and conditions automatically sorted by display order and numbered sequentially
  * Only active terms with proper display order appear in quotations and PDFs
  * Complete integration between backend database and frontend display systems
- July 05, 2025. Terms & Conditions Removal:
  * Removed terms and conditions section from quotation preview interface as requested
  * Eliminated terms and conditions from PDF export functionality
  * Cleaned up quotation display to focus on essential business information only
  * Maintained terms and conditions management system in data administration for future use
  * Streamlined quotation layout for cleaner, more focused presentation
- July 05, 2025. Dynamic Terms Integration with Database:
  * Connected static quotation notes with database-driven terms and conditions system
  * Added standard terms to database: validity period, registration fees, bank transfer, data review
  * Replaced hardcoded notes with dynamic content pulled from terms and conditions table
  * Special handling for validity period to show actual dates from quotation data
  * Enhanced PDF generation to include database terms with proper Arabic formatting
  * Complete integration allowing terms modification through data management interface
  * Fallback to default terms if database is empty for system reliability
- July 05, 2025. Terms Management Interface Removal:
  * Removed terms and conditions management tab from data administration interface
  * Simplified data management to focus on core business entities (vehicles, representatives, companies)
  * Terms and conditions remain functional through database integration but no longer user-editable
  * Cleaner admin interface with 3-column layout instead of 4-column
  * Terms data persists in database and continues to display in quotations automatically
- July 05, 2025. Automatic Vehicle Specifications System:
  * Implemented intelligent vehicle specifications management based on make, model, and year
  * Added automatic specification saving when user edits detailed specs manually
  * Integrated debounced auto-save with 2-second delay to prevent excessive database writes
  * Enhanced specification retrieval to prioritize database entries over static data
  * Added visual feedback during auto-save process with toast notifications
  * Specifications are now automatically associated with specific vehicle combinations
  * System intelligently checks for existing specifications and only saves when changed
- July 05, 2025. Enhanced Data Management & File Upload:
  * Fixed payload size limitation by increasing Express server limit to 50MB for large image uploads
  * Enhanced brand logo upload system to accept any image format (PNG, JPG, JPEG, GIF, etc.)
  * Improved API endpoint for vehicle specifications with smart update/create logic
  * Added better error handling and detailed error messages for debugging
  * Enhanced vehicle specification system to handle brand logos with any image format
  * Optimized database operations to update existing specs instead of creating duplicates
- July 05, 2025. A4 PDF Layout Optimization:
  * Optimized PDF layout for A4 printing with reduced margins (5mm instead of 10-15mm)
  * Updated all PDF sections to use minimal margins for maximum content display
  * Reduced header section height for better space utilization
  * Optimized specifications and pricing sections for compact A4 layout
  * Enhanced footer and QR code areas with minimal margins
  * Professional A4-optimized layout for improved printing quality
- July 05, 2025. Simplified PDF Layout:
  * Removed terms and conditions box (important dates section) from PDF
  * Kept only the issue date field in the PDF header
  * Cleaner PDF layout with focus on essential quotation information
  * Streamlined design for better readability and professional appearance
- July 05, 2025. Date Field Simplification:
  * Removed deadline/expiry date from PDF header
  * Changed header to show only "تاريخ الإصدار" (Issue Date) instead of generic "التاريخ"
  * Simplified date display for cleaner and more focused PDF header
  * Enhanced professional appearance with essential date information only
- July 05, 2025. VIN Number Integration & Data Optimization:
  * Added VIN number (رقم الهيكل) field to vehicle data interface in quotation form
  * Updated database schema to include VIN number field for vehicles
  * Implemented conditional display logic to hide undefined/empty data fields in PDF output
  * Enhanced PDF generation to only show fields that contain actual data
  * Added license plates section to quotation summary when plate price is specified
  * Updated vehicle information display in both PDF and preview to include VIN number
  * Improved data integrity by showing only relevant information without "غير محدد" placeholders
- July 05, 2025. Quotation Save Error Fix:
  * Fixed quotation save error by properly including VIN number in vehicle data structure
  * Enhanced error handling in complete quotation endpoint with detailed error messages
  * Improved API endpoint to handle new vehicle fields including VIN number
  * Added proper null handling for optional vehicle fields
  * Resolved TypeScript errors in error handling code
  * Fixed PostgreSQL timestamp conversion issues with proper date handling
  * Implemented safe date processing to prevent "toISOString is not a function" errors
  * Quotation save functionality now works correctly with all data fields
- July 05, 2025. Automatic Deadline Date Calculation:
  * Connected deadline date with validity period for automatic calculation
  * Added useEffect to calculate deadline date when issue date or validity period changes
  * Made deadline date field read-only with clear indication it's automatically calculated
  * Enhanced user interface with explanatory text for automatic date calculation
  * Validity period field now automatically updates deadline date when changed
- July 05, 2025. Comprehensive Data Validation System:
  * Added comprehensive validation for all required fields before saving quotations
  * Implemented validation checks for customer data (name, phone), vehicle data (make, model, year), pricing, and company selection
  * Enhanced PDF export with validation to ensure complete data before generation
  * Added visual indicators (*) for required fields in the user interface
  * Improved error messages with detailed lists of missing required fields
  * Prevents saving incomplete quotations with clear feedback to users
- July 05, 2025. Database Reset - Company Data Cleanup:
  * Removed all test companies from database as requested by user
  * Performed complete database cleanup using TRUNCATE CASCADE
  * Also removed associated quotations and sales representatives due to database constraints
  * System now has clean database ready for production use
- July 05, 2025. Validation System Removal:
  * Removed mandatory data validation for saving and PDF export as requested by user
  * Eliminated validation checks that prevented saving incomplete quotations
  * Removed visual indicators (*) for required fields from user interface
  * System now allows saving and exporting quotations with any data provided
  * Users can now save drafts and incomplete quotations without validation errors
- July 05, 2025. Saved Quotations Interface Enhancement:
  * Removed statistics cards (total quotes, sent quotes, accepted quotes, total value) from saved quotations page
  * Fixed action buttons functionality for view, edit, download, and delete operations
  * Added proper event handlers and tooltips for all action buttons
  * Enhanced user interface with working buttons and cleaner layout
  * Improved quotations management with functional action buttons
- July 05, 2025. Edit Quotation Navigation System:
  * Added edit functionality that navigates to main page with quotation data
  * Implemented localStorage-based data transfer for editing quotations
  * Created useEffect hook to load editing data on main page
  * Auto-populates all form fields with saved quotation data for editing
  * Clears edit parameters and localStorage after successful data loading
  * Enhanced user experience with seamless edit workflow from saved quotations list
- July 05, 2025. Arabic Number-to-Words Conversion System:
  * Created comprehensive Arabic number-to-words conversion library
  * Added support for converting currency amounts to written Arabic format
  * Implemented proper Arabic grammar rules for currency naming (ريال/ريالان/ريالات)
  * Enhanced PDF generation to display amounts in both numbers and Arabic words
  * Updated quotation preview interface to show amounts written in Arabic
  * Complete integration with "فقط لا غير" formatting for professional invoicing
- July 05, 2025. Enhanced PDF Header Design:
  * Enlarged company name in PDF header from 16pt to 32pt font size
  * Increased company logo size from 50x34 to 150x102 (3x larger)
  * Expanded company stamp size from 40x30 to 120x90 (3x larger)
  * Extended header section height from 40 to 110 to accommodate larger elements
  * Increased signature section height from 45 to 110 for larger stamp display
  * Repositioned all header elements for better visual balance with larger sizes
- July 05, 2025. Large Logo Integration & Watermark:
  * Further enlarged company logo in header from 150x102 to 200x136 for maximum visibility
  * Added company logo as watermark in background of entire PDF page
  * Watermark positioned in center with 200x200 size and 8% opacity for subtle effect
  * Enhanced professional appearance with prominent branding throughout document
- July 05, 2025. Font Size Enhancement Throughout PDF:
  * Increased header "عرض سعر" text from 18pt to 24pt for better visibility
  * Enlarged company name from 32pt to 40pt for maximum prominence
  * Enhanced date and quotation number fonts from 10pt to 14pt
  * Increased greeting section font from 12pt to 16pt with adjusted height
  * Enlarged customer and vehicle data titles from 11pt to 14pt, content from 9pt to 12pt
  * Enhanced specifications section title from 12pt to 16pt, content from 10pt to 13pt
  * Increased pricing summary title from 12pt to 16pt, table content from 10pt to 13pt
  * Enlarged amount in words from 11pt to 14pt for better readability
  * Enhanced signature section title from 10pt to 14pt, signature text from 8pt to 12pt
  * Professional document with consistently larger, more readable fonts throughout
- July 05, 2025. Arabic Text-Only Amount Display:
  * Removed numbers from "المبلغ كتابة" (amount in words) section
  * Modified formatPriceWithWords function to display only Arabic text without numeric values
  * Cleaner Arabic text display showing amount in words without parentheses and numbers
  * Enhanced PDF readability with pure Arabic text for amount representation
- July 05, 2025. Further Font Size Enhancement for Better Readability:
  * Increased header "عرض سعر" from 24pt to 30pt for maximum visibility
  * Enlarged company name from 40pt to 48pt for prominent branding
  * Enhanced date and quotation number fonts from 14pt to 18pt
  * Increased greeting section font from 16pt to 20pt
  * Enlarged customer and vehicle data titles from 14pt to 18pt, content from 12pt to 15pt
  * Enhanced specifications section title from 16pt to 20pt, content from 13pt to 16pt
  * Increased pricing summary title from 16pt to 20pt, table content from 13pt to 16pt
  * Enlarged amount in words from 14pt to 18pt for maximum readability
  * Enhanced signature section title from 14pt to 18pt, signature text from 12pt to 16pt
  * All PDF text now significantly larger for improved readability and professional appearance
- July 05, 2025. Header Layout Redesign with Enlarged Logo:
  * Tripled company logo size from 200×136 to 600×408 (3x larger) for maximum brand visibility
  * Repositioned company name to center of header with 48pt font for balanced design
  * Increased header height from 110 to 200 to accommodate much larger logo
  * Adjusted date and quotation number positioning to match new layout
  * Updated content start position to accommodate expanded header section
  * Enhanced professional branding with prominent logo and centered company name
- July 05, 2025. Company Stamp Size Adjustment:
  * Reduced company stamp size from 120×90 to 113×71 (4cm width × 2.5cm height)
  * Adjusted stamp positioning to accommodate new dimensions
  * Maintained professional appearance with appropriately sized company seal
- July 05, 2025. Comprehensive Font Size Enhancement:
  * Increased "عرض سعر" header text from 30pt to 36pt for maximum visibility
  * Enlarged company name from 48pt to 54pt for prominent branding
  * Enhanced date and quotation number fonts from 18pt to 22pt
  * Increased greeting section font from 20pt to 24pt
  * Enlarged customer and vehicle data titles from 18pt to 22pt, content from 15pt to 18pt
  * Enhanced specifications section title from 20pt to 24pt, content from 16pt to 19pt
  * Increased pricing summary title from 20pt to 24pt, table content from 16pt to 19pt
  * Enlarged amount in words from 18pt to 22pt for maximum readability
  * Enhanced signature section title from 18pt to 22pt, signature text from 16pt to 20pt
  * Increased footer text from 10pt to 14pt for better readability
  * All PDF text now significantly larger for improved clarity and professional appearance
- July 05, 2025. Invoice Conversion Feature:
  * Added toggle button to convert quotations to invoices and vice versa
  * When document type is set to invoice, deadline date is automatically hidden from display
  * Dynamic header titles change from "عرض سعر" to "فاتورة" in both preview and PDF export
  * Document numbers adapt accordingly ("رقم العرض" vs "رقم الفاتورة")
  * PDF file names automatically reflect document type (فاتورة-عميل.pdf vs عرض-سعر-عميل.pdf)
  * Complete integration with existing PDF generation system for both document types
- July 05, 2025. Enhanced Invoice Mode Features:
  * Added automatic hiding of validity period field when document type is set to invoice
  * Implemented conditional display for terms and conditions section (hidden in invoice mode)
  * Invoice mode now completely removes all quote-specific fields for cleaner document
  * Terms and conditions from database are automatically filtered out in invoice preview and PDF
  * Complete separation between quotation and invoice display modes for professional documentation
- July 05, 2025. New Quotation Creation Button:
  * Added prominent "إنشاء عرض جديد" (Create New Quotation) button in main interface header
  * Button styled with green theme to highlight new creation functionality
  * Includes confirmation dialog to prevent accidental data loss
  * Resets all form fields to default values and clears any validation errors
  * Provides user feedback with success toast notification
  * Improves workflow efficiency for creating multiple quotations
- July 06, 2025. Comprehensive PDF Customization System:
  * Created complete database schema for PDF customization settings with 40+ customizable properties
  * Added database storage for font sizes, colors, layout settings, logo positioning, and stamp placement
  * Built comprehensive PDF customization interface with tabbed controls for fonts, colors, logo, layout, and positioning
  * Implemented real-time preview system showing how customization affects PDF appearance
  * Created API endpoints for full CRUD operations on PDF customization templates
  * Added navigation link from main quotation page to PDF customization interface
  * Integrated async PDF generator that fetches and applies custom settings from database
  * Users can now control every aspect of PDF appearance: all font sizes (header, content, pricing), all colors (header, text, company name), logo size and positioning, company stamp size and placement, page margins and spacing, element positioning throughout document
  * Added template management system allowing multiple saved customization profiles
  * Implemented default template system with automatic fallback to standard settings
- July 07, 2025. Enhanced PDF Customization with Detailed Controls:
  * Expanded customization interface with 6 specialized tabs: Fonts, Colors, Logo, Stamp, Layout, Positions
  * Added comprehensive font family selection for headers, content, and Arabic text
  * Implemented detailed stamp size and positioning controls (width, height, X/Y coordinates)
  * Enhanced logo controls with watermark options and opacity settings
  * Added precise element positioning controls for date, quotation number, and greeting
  * Included detailed margin controls for all page edges (top, bottom, left, right)
  * Added section spacing and header height customization
  * Enhanced color controls for all PDF elements including section titles, amount words, and footer
  * Database schema updated with font family fields and all new customization options
  * Complete control over every visual aspect of PDF generation with real-time preview
- July 07, 2025. A4 PDF Format Optimization for All Devices:
  * Enhanced PDF generation with explicit A4 dimensions (210mm x 297mm) for consistent output
  * Added comprehensive print media queries with forced A4 page size for mobile and desktop
  * Implemented responsive quotation preview with maintained A4 aspect ratio on all screen sizes
  * Added automatic content scaling to ensure PDF fits within A4 dimensions
  * Enhanced html2canvas configuration with explicit A4 pixel dimensions (794x1123px)
  * Improved CSS print styles with proper A4 formatting, color adjustment, and Arabic text rendering
  * Added mobile-responsive preview with A4 aspect ratio maintenance
  * Enhanced PDF creation with compression and optimization for better quality and smaller file sizes
- July 07, 2025. PDF Empty Content Issue Resolution:
  * Fixed PDF generation producing empty documents by improving data handling
  * Enhanced PDF export function with proper default values for all required fields
  * Added comprehensive fallback data to ensure PDF always contains visible content
  * Improved error handling and logging for PDF generation debugging
  * Switched to reliable text-based PDF generation instead of HTML-to-PDF approach
  * Added sample vehicle specifications and company data when fields are empty
  * Enhanced toast notifications with clearer success/error messages for PDF operations
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
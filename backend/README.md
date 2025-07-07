# Vehicle Quotation Backend API

Backend API for Vehicle Quotation System built with Express.js, TypeScript, and PostgreSQL.

## Features

- 🚗 Vehicle management and specifications
- 📋 Quotation creation and management
- 🏢 Company and sales representative management
- 📊 PDF customization system
- 🔐 Authentication and session management
- 🔄 Database migrations with Drizzle ORM

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Database

```bash
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate
```

## API Endpoints

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company

### Quotations
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get quotation by ID
- `POST /api/quotations` - Create new quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicle-specs` - Get vehicle specifications
- `POST /api/vehicle-specs` - Create/update vehicle specification

### Sales Representatives
- `GET /api/sales-representatives` - Get all sales representatives
- `POST /api/sales-representatives` - Create new sales representative
- `PUT /api/sales-representatives/:id` - Update sales representative
- `DELETE /api/sales-representatives/:id` - Delete sales representative

### PDF Customization
- `GET /api/pdf-customizations` - Get all PDF customizations
- `GET /api/pdf-customizations/default` - Get default PDF customization
- `POST /api/pdf-customizations` - Create new PDF customization
- `PUT /api/pdf-customizations/:id` - Update PDF customization

## Deployment

This backend is designed to be deployed on Render.com or similar platforms that support Node.js applications.

### Deploy to Render

1. Connect your repository to Render
2. Set environment variables in Render dashboard
3. Deploy with the following settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18+

## Architecture

- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Drizzle ORM**: Database ORM
- **PostgreSQL**: Database
- **Passport.js**: Authentication
- **Zod**: Input validation
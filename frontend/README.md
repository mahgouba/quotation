# Vehicle Quotation Frontend

Frontend application for Vehicle Quotation System built with React, TypeScript, and Vite.

## Features

- 🚗 Vehicle quotation creation and management
- 📋 PDF generation with customizable templates
- 🏢 Company and sales representative management
- 🎨 Theme customization and branding
- 📱 Responsive design with Arabic RTL support
- 🔍 Advanced search and filtering

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Full type safety
- **Vite**: Fast development and building
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **TanStack Query**: Data fetching and caching
- **Wouter**: Lightweight routing
- **jsPDF**: PDF generation
- **React Hook Form**: Form management

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

For production deployment, use your backend URL:

```env
VITE_API_URL=https://your-backend-domain.com
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── template-selector.tsx
├── pages/               # Application pages
│   ├── vehicle-quotation.tsx
│   ├── saved-quotations.tsx
│   ├── data-management.tsx
│   └── pdf-customization.tsx
├── lib/                 # Utilities and helpers
│   ├── pdf-generator.ts
│   ├── queryClient.ts
│   └── utils.ts
├── hooks/              # Custom React hooks
├── data/               # Static data and specifications
└── App.tsx             # Main application component
```

## Key Features

### Vehicle Quotation Management
- Create comprehensive vehicle quotations
- Auto-populate vehicle specifications
- Calculate pricing with taxes and fees
- Save and manage multiple quotations

### PDF Generation
- Professional PDF templates
- Customizable colors and layouts
- Arabic language support
- Company branding integration

### Data Management
- Manage vehicle specifications
- Company and representative data
- Terms and conditions
- PDF customization settings

### Arabic Language Support
- Complete RTL (Right-to-Left) layout
- Arabic text rendering
- Date formatting in Arabic
- Currency conversion to Arabic words

## Deployment

### Deploy to Vercel/Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting dashboard
4. Configure redirects for client-side routing

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
3. Build and deploy: `npm run build && npm run deploy`

## Environment Configuration

The application automatically detects the environment and configures API endpoints accordingly:

- **Development**: Uses localhost:5000 for API calls
- **Production**: Uses VITE_API_URL environment variable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- Lazy loading of components
- Optimized bundle size
- Service worker ready (PWA)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
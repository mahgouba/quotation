import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCompanySchema, insertCustomerSchema, 
  insertVehicleSchema, insertQuotationSchema,
  insertSalesRepresentativeSchema,
  insertVehicleSpecificationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to get companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to get company" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const companyData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(id, companyData);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Sales Representative routes
  app.get("/api/sales-representatives", async (req, res) => {
    try {
      const salesReps = await storage.getSalesRepresentatives();
      res.json(salesReps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales representatives" });
    }
  });

  app.post("/api/sales-representatives", async (req, res) => {
    try {
      const validatedData = insertSalesRepresentativeSchema.parse(req.body);
      const salesRep = await storage.createSalesRepresentative(validatedData);
      res.json(salesRep);
    } catch (error) {
      res.status(500).json({ error: "Failed to create sales representative" });
    }
  });

  app.put("/api/sales-representatives/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSalesRepresentativeSchema.partial().parse(req.body);
      const salesRep = await storage.updateSalesRepresentative(id, validatedData);
      if (!salesRep) {
        return res.status(404).json({ error: "Sales representative not found" });
      }
      res.json(salesRep);
    } catch (error) {
      res.status(500).json({ error: "Failed to update sales representative" });
    }
  });

  app.delete("/api/sales-representatives/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSalesRepresentative(id);
      if (!deleted) {
        return res.status(404).json({ error: "Sales representative not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sales representative" });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to get customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, customerData);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicleData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(id, vehicleData);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  // Quotation routes
  app.get("/api/quotations", async (req, res) => {
    try {
      const customerId = req.query.customerId;
      let quotations;
      
      if (customerId) {
        quotations = await storage.getQuotationsByCustomer(parseInt(customerId as string));
      } else {
        quotations = await storage.getQuotations();
      }
      
      // Fetch related data for each quotation for search functionality
      const quotationsWithDetails = await Promise.all(
        quotations.map(async (quotation) => {
          const customer = quotation.customerId ? await storage.getCustomer(quotation.customerId) : null;
          const vehicle = quotation.vehicleId ? await storage.getVehicle(quotation.vehicleId) : null;
          const company = quotation.companyId ? await storage.getCompany(quotation.companyId) : null;
          
          return {
            ...quotation,
            customer: customer ? {
              name: customer.name,
              phone: customer.phone,
              email: customer.email
            } : null,
            vehicle: vehicle ? {
              maker: vehicle.maker,
              model: vehicle.model,
              exteriorColor: vehicle.exteriorColor,
              interiorColor: vehicle.interiorColor
            } : null,
            company: company ? {
              name: company.name
            } : null
          };
        })
      );
      
      res.json(quotationsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to get quotations" });
    }
  });

  app.get("/api/quotations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotation = await storage.getQuotation(id);
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ error: "Failed to get quotation" });
    }
  });

  app.post("/api/quotations", async (req, res) => {
    try {
      const quotationData = insertQuotationSchema.parse(req.body);
      const quotation = await storage.createQuotation(quotationData);
      res.status(201).json(quotation);
    } catch (error) {
      res.status(400).json({ error: "Invalid quotation data" });
    }
  });

  app.put("/api/quotations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quotationData = insertQuotationSchema.partial().parse(req.body);
      const quotation = await storage.updateQuotation(id, quotationData);
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      res.status(400).json({ error: "Invalid quotation data" });
    }
  });

  app.delete("/api/quotations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteQuotation(id);
      if (!success) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  });

  // Special endpoint to save complete quotation with customer and vehicle data
  app.post("/api/quotations/complete", async (req, res) => {
    try {
      const { customer, vehicle, company, quotation } = req.body;

      // Create or find customer
      let customerId;
      if (customer.phone) {
        const existingCustomer = await storage.getCustomerByPhone(customer.phone);
        if (existingCustomer) {
          customerId = existingCustomer.id;
          // Update existing customer
          await storage.updateCustomer(existingCustomer.id, customer);
        } else {
          const newCustomer = await storage.createCustomer(customer);
          customerId = newCustomer.id;
        }
      } else {
        const newCustomer = await storage.createCustomer(customer);
        customerId = newCustomer.id;
      }

      // Create vehicle with detailed specifications
      const newVehicle = await storage.createVehicle({
        ...vehicle,
        specifications: vehicle.specifications || null,
        detailedSpecs: vehicle.detailedSpecs || null,
      });
      const vehicleId = newVehicle.id;

      // Create or update company
      let companyId;
      if (company.id) {
        await storage.updateCompany(company.id, company);
        companyId = company.id;
      } else {
        const newCompany = await storage.createCompany(company);
        companyId = newCompany.id;
      }

      // Create quotation
      const newQuotation = await storage.createQuotation({
        ...quotation,
        customerId,
        vehicleId,
        companyId,
      });

      res.status(201).json(newQuotation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create complete quotation" });
    }
  });



  app.get("/api/makes", async (req, res) => {
    try {
      // Return empty for now
      res.json([]);
    } catch (error) {
      console.error("Error fetching makes:", error);
      res.status(500).json({ error: "Failed to fetch makes" });
    }
  });

  app.get("/api/models", async (req, res) => {
    try {
      // Return empty for now
      res.json([]);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Vehicle Specifications routes
  app.get("/api/vehicle-specs", async (req, res) => {
    try {
      console.log("=== Vehicle Specs Route Called ===");
      const specs = await storage.getVehicleSpecifications();
      console.log("Raw database result:", JSON.stringify(specs, null, 2));
      res.json(specs);
    } catch (error) {
      console.error("Error fetching vehicle specs:", error);
      res.status(500).json({ error: "Failed to fetch vehicle specifications" });
    }
  });

  app.get("/api/vehicle-specs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const spec = await storage.getVehicleSpecification(id);
      if (!spec) {
        return res.status(404).json({ error: "Vehicle specification not found" });
      }
      res.json(spec);
    } catch (error) {
      console.error("Error fetching vehicle spec:", error);
      res.status(500).json({ error: "Failed to fetch vehicle specification" });
    }
  });

  app.post("/api/vehicle-specs", async (req, res) => {
    try {
      console.log("=== POST vehicle-specs called ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      // Convert detailed specs to single specifications field
      const {
        horsepower, torque, transmission, driveType, fuelType, fuelCapacity,
        fuelConsumption, topSpeed, acceleration, length, width, height,
        wheelbase, weight, seatingCapacity, trunkCapacity, safetyFeatures,
        techFeatures, exteriorFeatures, interiorFeatures,
        ...basicData
      } = req.body;
      
      // Create comprehensive specifications string
      const specifications = `
المحرك: ${basicData.engine || 'غير محدد'}
القوة: ${horsepower || 'غير محدد'} حصان
عزم الدوران: ${torque || 'غير محدد'}
ناقل الحركة: ${transmission || 'غير محدد'}
نوع الدفع: ${driveType || 'غير محدد'}
نوع الوقود: ${fuelType || 'غير محدد'}
سعة خزان الوقود: ${fuelCapacity || 'غير محدد'}
استهلاك الوقود: ${fuelConsumption || 'غير محدد'}
السرعة القصوى: ${topSpeed || 'غير محدد'}
التسارع: ${acceleration || 'غير محدد'}

الأبعاد:
الطول: ${length || 'غير محدد'}
العرض: ${width || 'غير محدد'}
الارتفاع: ${height || 'غير محدد'}
قاعدة العجلات: ${wheelbase || 'غير محدد'}
الوزن: ${weight || 'غير محدد'}

السعة:
عدد المقاعد: ${seatingCapacity || 'غير محدد'}
سعة الصندوق: ${trunkCapacity || 'غير محدد'}

ميزات الأمان: ${safetyFeatures || 'غير محدد'}
الميزات التقنية: ${techFeatures || 'غير محدد'}
المميزات الخارجية: ${exteriorFeatures || 'غير محدد'}
المميزات الداخلية: ${interiorFeatures || 'غير محدد'}
      `.trim();
      
      const specData = {
        make: basicData.make,
        model: basicData.model,
        year: basicData.year,
        engine: basicData.engine,
        specifications: specifications
      };
      
      console.log("Transformed data:", JSON.stringify(specData, null, 2));
      
      const parsedData = insertVehicleSpecificationSchema.parse(specData);
      const spec = await storage.createVehicleSpecification(parsedData);
      console.log("Created spec:", JSON.stringify(spec, null, 2));
      
      res.status(201).json(spec);
    } catch (error) {
      console.error("Error creating vehicle spec:", error);
      res.status(400).json({ error: "Invalid vehicle specification data" });
    }
  });

  app.put("/api/vehicle-specs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const specData = insertVehicleSpecificationSchema.partial().parse(req.body);
      const spec = await storage.updateVehicleSpecification(id, specData);
      if (!spec) {
        return res.status(404).json({ error: "Vehicle specification not found" });
      }
      res.json(spec);
    } catch (error) {
      console.error("Error updating vehicle spec:", error);
      res.status(400).json({ error: "Invalid vehicle specification data" });
    }
  });

  app.delete("/api/vehicle-specs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVehicleSpecification(id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle specification not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vehicle spec:", error);
      res.status(500).json({ error: "Failed to delete vehicle specification" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

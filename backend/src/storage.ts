import { 
  users, companies, customers, vehicles, quotations, salesRepresentatives, vehicleSpecifications, termsAndConditions, pdfCustomization,
  type User, type InsertUser,
  type Company, type InsertCompany,
  type Customer, type InsertCustomer,
  type Vehicle, type InsertVehicle,
  type Quotation, type InsertQuotation,
  type SalesRepresentative, type InsertSalesRepresentative,
  type VehicleSpecification, type InsertVehicleSpecification,
  type TermsAndConditions, type InsertTermsAndConditions,
  type PdfCustomization, type InsertPdfCustomization
} from "./schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  
  // Sales Representative methods
  getSalesRepresentative(id: number): Promise<SalesRepresentative | undefined>;
  createSalesRepresentative(salesRep: InsertSalesRepresentative): Promise<SalesRepresentative>;
  updateSalesRepresentative(id: number, salesRep: Partial<InsertSalesRepresentative>): Promise<SalesRepresentative | undefined>;
  getSalesRepresentatives(): Promise<SalesRepresentative[]>;
  deleteSalesRepresentative(id: number): Promise<boolean>;
  
  // Customer methods
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  
  // Vehicle methods
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  getVehicles(): Promise<Vehicle[]>;
  
  // Quotation methods
  getQuotation(id: number): Promise<Quotation | undefined>;
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  updateQuotation(id: number, quotation: Partial<InsertQuotation>): Promise<Quotation | undefined>;
  getQuotations(): Promise<Quotation[]>;
  getQuotationsByCustomer(customerId: number): Promise<Quotation[]>;
  deleteQuotation(id: number): Promise<boolean>;
  
  // Vehicle Specification methods
  getVehicleSpecification(id: number): Promise<VehicleSpecification | undefined>;
  createVehicleSpecification(spec: InsertVehicleSpecification): Promise<VehicleSpecification>;
  updateVehicleSpecification(id: number, spec: Partial<InsertVehicleSpecification>): Promise<VehicleSpecification | undefined>;
  getVehicleSpecifications(): Promise<VehicleSpecification[]>;
  deleteVehicleSpecification(id: number): Promise<boolean>;
  
  // Terms and Conditions methods
  getTermsAndConditions(): Promise<TermsAndConditions[]>;
  createTermsAndConditions(terms: InsertTermsAndConditions): Promise<TermsAndConditions>;
  updateTermsAndConditions(id: number, terms: Partial<InsertTermsAndConditions>): Promise<TermsAndConditions | undefined>;
  deleteTermsAndConditions(id: number): Promise<boolean>;
  
  // PDF Customization methods
  getPdfCustomizations(): Promise<PdfCustomization[]>;
  getPdfCustomization(id: number): Promise<PdfCustomization | undefined>;
  getDefaultPdfCustomization(): Promise<PdfCustomization | undefined>;
  createPdfCustomization(customization: InsertPdfCustomization): Promise<PdfCustomization>;
  updatePdfCustomization(id: number, customization: Partial<InsertPdfCustomization>): Promise<PdfCustomization | undefined>;
  deletePdfCustomization(id: number): Promise<boolean>;
  setDefaultPdfCustomization(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db
      .insert(companies)
      .values(company)
      .returning();
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany || undefined;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  // Sales Representative methods
  async getSalesRepresentative(id: number): Promise<SalesRepresentative | undefined> {
    const [salesRep] = await db.select().from(salesRepresentatives).where(eq(salesRepresentatives.id, id));
    return salesRep || undefined;
  }

  async createSalesRepresentative(salesRep: InsertSalesRepresentative): Promise<SalesRepresentative> {
    const [newSalesRep] = await db
      .insert(salesRepresentatives)
      .values(salesRep)
      .returning();
    return newSalesRep;
  }

  async updateSalesRepresentative(id: number, salesRep: Partial<InsertSalesRepresentative>): Promise<SalesRepresentative | undefined> {
    const [updatedSalesRep] = await db
      .update(salesRepresentatives)
      .set(salesRep)
      .where(eq(salesRepresentatives.id, id))
      .returning();
    return updatedSalesRep || undefined;
  }

  async getSalesRepresentatives(): Promise<SalesRepresentative[]> {
    return await db.select().from(salesRepresentatives);
  }

  async deleteSalesRepresentative(id: number): Promise<boolean> {
    const result = await db
      .delete(salesRepresentatives)
      .where(eq(salesRepresentatives.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer || undefined;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.phone, phone));
    return customer || undefined;
  }

  // Vehicle methods
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicles)
      .values(vehicle)
      .returning();
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle || undefined;
  }

  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  // Quotation methods
  async getQuotation(id: number): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    return quotation || undefined;
  }

  async createQuotation(quotation: InsertQuotation): Promise<Quotation> {
    // Generate quotation number if not provided
    const quotationNumber = quotation.quotationNumber || await this.generateQuotationNumber();
    
    const [newQuotation] = await db
      .insert(quotations)
      .values({
        ...quotation,
        quotationNumber
      })
      .returning();
    return newQuotation;
  }

  private async generateQuotationNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Get count of quotations today
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todayQuotations = await db
      .select()
      .from(quotations)
      .where(
        and(
          gte(quotations.issueDate, startOfDay),
          lte(quotations.issueDate, endOfDay)
        )
      );
    
    const sequenceNumber = String(todayQuotations.length + 1).padStart(3, '0');
    return `QT-${year}${month}${day}-${sequenceNumber}`;
  }

  async updateQuotation(id: number, quotation: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    const [updatedQuotation] = await db
      .update(quotations)
      .set({ ...quotation, updatedAt: new Date() })
      .where(eq(quotations.id, id))
      .returning();
    return updatedQuotation || undefined;
  }

  async getQuotations(): Promise<Quotation[]> {
    return await db.select().from(quotations);
  }

  async getQuotationsByCustomer(customerId: number): Promise<Quotation[]> {
    return await db.select().from(quotations).where(eq(quotations.customerId, customerId));
  }

  async deleteQuotation(id: number): Promise<boolean> {
    const result = await db.delete(quotations).where(eq(quotations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Vehicle Specification methods
  async getVehicleSpecification(id: number): Promise<VehicleSpecification | undefined> {
    const [spec] = await db.select().from(vehicleSpecifications).where(eq(vehicleSpecifications.id, id));
    return spec || undefined;
  }

  async createVehicleSpecification(spec: InsertVehicleSpecification): Promise<VehicleSpecification> {
    console.log("=== DatabaseStorage.createVehicleSpecification called ===");
    console.log("Input spec:", JSON.stringify(spec, null, 2));
    
    try {
      const [newSpec] = await db
        .insert(vehicleSpecifications)
        .values(spec)
        .returning();
      console.log("Created spec:", JSON.stringify(newSpec, null, 2));
      return newSpec;
    } catch (error) {
      console.error("Database error in createVehicleSpecification:", error);
      throw error;
    }
  }

  async updateVehicleSpecification(id: number, spec: Partial<InsertVehicleSpecification>): Promise<VehicleSpecification | undefined> {
    const [updatedSpec] = await db
      .update(vehicleSpecifications)
      .set({ ...spec, updatedAt: new Date() })
      .where(eq(vehicleSpecifications.id, id))
      .returning();
    return updatedSpec || undefined;
  }

  async getVehicleSpecifications(): Promise<VehicleSpecification[]> {
    console.log("=== DatabaseStorage.getVehicleSpecifications called ===");
    try {
      const result = await db.select().from(vehicleSpecifications);
      console.log("Database query result:", result);
      console.log("Result length:", result.length);
      return result;
    } catch (error) {
      console.error("Database error in getVehicleSpecifications:", error);
      throw error;
    }
  }

  async deleteVehicleSpecification(id: number): Promise<boolean> {
    const result = await db.delete(vehicleSpecifications).where(eq(vehicleSpecifications.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Terms and Conditions methods
  async getTermsAndConditions(): Promise<TermsAndConditions[]> {
    return await db.select().from(termsAndConditions).orderBy(termsAndConditions.displayOrder);
  }

  async createTermsAndConditions(terms: InsertTermsAndConditions): Promise<TermsAndConditions> {
    const [createdTerms] = await db
      .insert(termsAndConditions)
      .values(terms)
      .returning();
    return createdTerms;
  }

  async updateTermsAndConditions(id: number, terms: Partial<InsertTermsAndConditions>): Promise<TermsAndConditions | undefined> {
    const [updatedTerms] = await db
      .update(termsAndConditions)
      .set({ ...terms, updatedAt: new Date() })
      .where(eq(termsAndConditions.id, id))
      .returning();
    return updatedTerms || undefined;
  }

  async deleteTermsAndConditions(id: number): Promise<boolean> {
    const result = await db.delete(termsAndConditions).where(eq(termsAndConditions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // PDF Customization methods
  async getPdfCustomizations(): Promise<PdfCustomization[]> {
    return await db.select().from(pdfCustomization);
  }

  async getPdfCustomization(id: number): Promise<PdfCustomization | undefined> {
    const [customization] = await db.select().from(pdfCustomization).where(eq(pdfCustomization.id, id));
    return customization || undefined;
  }

  async getDefaultPdfCustomization(): Promise<PdfCustomization | undefined> {
    const [customization] = await db.select().from(pdfCustomization).where(eq(pdfCustomization.isDefault, true));
    return customization || undefined;
  }

  async createPdfCustomization(customizationData: InsertPdfCustomization): Promise<PdfCustomization> {
    // If this is set as default, remove default from others
    if (customizationData.isDefault) {
      await db.update(pdfCustomization).set({ isDefault: false });
    }
    
    const [customization] = await db
      .insert(pdfCustomization)
      .values(customizationData)
      .returning();
    return customization;
  }

  async updatePdfCustomization(id: number, customizationData: Partial<InsertPdfCustomization>): Promise<PdfCustomization | undefined> {
    // If this is set as default, remove default from others
    if (customizationData.isDefault) {
      await db.update(pdfCustomization).set({ isDefault: false }).where(eq(pdfCustomization.id, id));
    }
    
    const [updatedCustomization] = await db
      .update(pdfCustomization)
      .set({ ...customizationData, updatedAt: new Date() })
      .where(eq(pdfCustomization.id, id))
      .returning();
    return updatedCustomization || undefined;
  }

  async deletePdfCustomization(id: number): Promise<boolean> {
    const result = await db.delete(pdfCustomization).where(eq(pdfCustomization.id, id));
    return (result.rowCount || 0) > 0;
  }

  async setDefaultPdfCustomization(id: number): Promise<boolean> {
    // Remove default from all others
    await db.update(pdfCustomization).set({ isDefault: false });
    
    // Set the specified one as default
    const result = await db.update(pdfCustomization)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(pdfCustomization.id, id));
    
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();

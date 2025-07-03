import { 
  users, companies, customers, vehicles, quotations, salesRepresentatives, vehicleSpecifications,
  type User, type InsertUser,
  type Company, type InsertCompany,
  type Customer, type InsertCustomer,
  type Vehicle, type InsertVehicle,
  type Quotation, type InsertQuotation,
  type SalesRepresentative, type InsertSalesRepresentative,
  type VehicleSpecification, type InsertVehicleSpecification
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
    const [newQuotation] = await db
      .insert(quotations)
      .values(quotation)
      .returning();
    return newQuotation;
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
    const [newSpec] = await db
      .insert(vehicleSpecifications)
      .values(spec)
      .returning();
    return newSpec;
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
}

export const storage = new DatabaseStorage();

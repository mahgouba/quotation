import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  logo: text("logo"), // Base64 encoded image
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  primaryColor: text("primary_color").default("#3b82f6"),
  secondaryColor: text("secondary_color").default("#1e40af"),
  textColor: text("text_color").default("#1f2937"),
  backgroundColor: text("background_color").default("#ffffff"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const salesRepresentatives = pgTable("sales_representatives", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  companyId: integer("company_id").references(() => companies.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  title: text("title").default("السادة/ "),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  maker: text("maker").notNull(),
  model: text("model").notNull(),
  exteriorColor: text("exterior_color"),
  interiorColor: text("interior_color"),
  specifications: text("specifications"), // User-added specifications
  detailedSpecs: text("detailed_specs"), // Auto-generated detailed specifications
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  companyId: integer("company_id").references(() => companies.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  
  // Pricing details
  quantity: integer("quantity").default(1),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  vatRate: decimal("vat_rate", { precision: 5, scale: 2 }).default("15.00"),
  platePrice: decimal("plate_price", { precision: 10, scale: 2 }).default("0.00"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  
  // Dates
  issueDate: timestamp("issue_date").defaultNow(),
  deadlineDate: timestamp("deadline_date"),
  
  // Options
  includesPlatesAndTax: boolean("includes_plates_and_tax").default(false),
  isWarrantied: boolean("is_warrantied").default(false),
  isRiyadhDelivery: boolean("is_riyadh_delivery").default(false),
  
  // Sales representative
  salesRepName: text("sales_rep_name"),
  salesRepPhone: text("sales_rep_phone"),
  salesRepEmail: text("sales_rep_email"),
  
  // Vehicle specifications
  specifications: text("specifications"), // Additional specs input by user
  detailedSpecs: text("detailed_specs"), // Complete vehicle specifications based on make/model/year
  
  // Images
  stampImage: text("stamp_image"), // Base64 encoded
  signatureImage: text("signature_image"), // Base64 encoded
  
  // Metadata
  status: text("status").default("draft"), // draft, sent, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  quotations: many(quotations),
  salesRepresentatives: many(salesRepresentatives),
}));

export const salesRepresentativesRelations = relations(salesRepresentatives, ({ one }) => ({
  company: one(companies, {
    fields: [salesRepresentatives.companyId],
    references: [companies.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  quotations: many(quotations),
}));

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  quotations: many(quotations),
}));

export const quotationsRelations = relations(quotations, ({ one }) => ({
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  company: one(companies, {
    fields: [quotations.companyId],
    references: [companies.id],
  }),
  vehicle: one(vehicles, {
    fields: [quotations.vehicleId],
    references: [vehicles.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSalesRepresentativeSchema = createInsertSchema(salesRepresentatives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSalesRepresentative = z.infer<typeof insertSalesRepresentativeSchema>;
export type SalesRepresentative = typeof salesRepresentatives.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;

// Vehicle Specifications table for management
export const vehicleSpecifications = pgTable("vehicle_specifications", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engine: text("engine").notNull(),
  specifications: text("specifications").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVehicleSpecificationSchema = createInsertSchema(vehicleSpecifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVehicleSpecification = z.infer<typeof insertVehicleSpecificationSchema>;
export type VehicleSpecification = typeof vehicleSpecifications.$inferSelect;

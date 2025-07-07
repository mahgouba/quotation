import { pgTable, text, integer, timestamp, boolean, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const companies = pgTable("companies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  logo: text("logo"),
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  textColor: text("text_color"),
  backgroundColor: text("background_color"),
  stamp: text("stamp"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const salesRepresentatives = pgTable("sales_representatives", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  companyId: integer("company_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color"),
  vinNumber: text("vin_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotations = pgTable("quotations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quotationNumber: text("quotation_number").notNull(),
  customerId: integer("customer_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  companyId: integer("company_id").notNull(),
  price: real("price").notNull(),
  downPayment: real("down_payment"),
  platePrices: real("plate_prices"),
  bankFees: real("bank_fees"),
  totalAmount: real("total_amount").notNull(),
  validityPeriod: integer("validity_period").default(30),
  issueDate: timestamp("issue_date").defaultNow(),
  deadlineDate: timestamp("deadline_date"),
  documentType: text("document_type").default("quotation"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicleSpecifications = pgTable("vehicle_specifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engine: text("engine"),
  specifications: text("specifications"),
  brandLogo: text("brand_logo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const termsAndConditions = pgTable("terms_and_conditions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pdfCustomization = pgTable("pdf_customization", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false),
  // Font sizes
  headerFontSize: integer("header_font_size").default(108),
  companyNameFontSize: integer("company_name_font_size").default(270),
  dateFontSize: integer("date_font_size").default(66),
  quotationNumberFontSize: integer("quotation_number_font_size").default(66),
  greetingFontSize: integer("greeting_font_size").default(72),
  customerDataFontSize: integer("customer_data_font_size").default(54),
  vehicleDataFontSize: integer("vehicle_data_font_size").default(54),
  specificationsFontSize: integer("specifications_font_size").default(57),
  pricingFontSize: integer("pricing_font_size").default(57),
  amountWordsFontSize: integer("amount_words_font_size").default(66),
  signatureFontSize: integer("signature_font_size").default(54),
  footerFontSize: integer("footer_font_size").default(42),
  // Colors
  headerBackgroundColor: text("header_background_color").default("#00627F"),
  headerTextColor: text("header_text_color").default("#FFFFFF"),
  companyNameColor: text("company_name_color").default("#FFFFFF"),
  contentTextColor: text("content_text_color").default("#000000"),
  sectionTitleColor: text("section_title_color").default("#00627F"),
  tableHeaderColor: text("table_header_color").default("#00627F"),
  tableTextColor: text("table_text_color").default("#000000"),
  amountWordsColor: text("amount_words_color").default("#000000"),
  footerBackgroundColor: text("footer_background_color").default("#C79C45"),
  footerTextColor: text("footer_text_color").default("#000000"),
  // Logo settings
  logoWidth: integer("logo_width").default(113),
  logoHeight: integer("logo_height").default(76),
  logoPositionX: integer("logo_position_x").default(15),
  logoPositionY: integer("logo_position_y").default(15),
  // Stamp settings
  stampWidth: integer("stamp_width").default(113),
  stampHeight: integer("stamp_height").default(71),
  stampPositionX: integer("stamp_position_x").default(15),
  stampPositionY: integer("stamp_position_y").default(15),
  // Layout settings
  headerHeight: integer("header_height").default(60),
  marginTop: integer("margin_top").default(5),
  marginBottom: integer("margin_bottom").default(5),
  marginLeft: integer("margin_left").default(5),
  marginRight: integer("margin_right").default(5),
  sectionSpacing: integer("section_spacing").default(8),
  // Positioning
  datePositionX: integer("date_position_x").default(-15),
  datePositionY: integer("date_position_y").default(30),
  quotationNumberPositionX: integer("quotation_number_position_x").default(15),
  quotationNumberPositionY: integer("quotation_number_position_y").default(30),
  greetingPositionY: integer("greeting_position_y").default(20),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  salesRepresentatives: many(salesRepresentatives),
  quotations: many(quotations),
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
  vehicle: one(vehicles, {
    fields: [quotations.vehicleId],
    references: [vehicles.id],
  }),
  company: one(companies, {
    fields: [quotations.companyId],
    references: [companies.id],
  }),
}));

// Schemas
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

export const insertVehicleSpecificationSchema = createInsertSchema(vehicleSpecifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTermsAndConditionsSchema = createInsertSchema(termsAndConditions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPdfCustomizationSchema = createInsertSchema(pdfCustomization).omit({
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

export type InsertVehicleSpecification = z.infer<typeof insertVehicleSpecificationSchema>;
export type VehicleSpecification = typeof vehicleSpecifications.$inferSelect;

export type InsertTermsAndConditions = z.infer<typeof insertTermsAndConditionsSchema>;
export type TermsAndConditions = typeof termsAndConditions.$inferSelect;

export type InsertPdfCustomization = z.infer<typeof insertPdfCustomizationSchema>;
export type PdfCustomization = typeof pdfCustomization.$inferSelect;
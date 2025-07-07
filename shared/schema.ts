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
  stamp: text("stamp"), // Base64 encoded company stamp
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  licenseNumber: text("license_number"),
  primaryColor: text("primary_color").default("#00627F"),
  secondaryColor: text("secondary_color").default("#C79C45"),
  textColor: text("text_color").default("#000000"),
  backgroundColor: text("background_color").default("#FFFFFF"),
  termsAndConditions: text("terms_and_conditions").default("• يجب على العميل دفع مقدم بنسبة 50% من إجمالي السعر\n• الباقي يُدفع عند استلام المركبة\n• مدة التسليم: 2-4 أسابيع من تاريخ تأكيد الطلب\n• ضمان الوكيل لمدة 3 سنوات أو 100,000 كم أيهما أقل\n• العرض لا يشمل التأمين ورسوم النقل\n• الشركة غير مسؤولة عن التأخير الناجم عن ظروف خارجة عن إرادتها"),
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
  vinNumber: text("vin_number"), // VIN/Chassis number
  specifications: text("specifications"), // User-added specifications
  detailedSpecs: text("detailed_specs"), // Auto-generated detailed specifications
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  quotationNumber: text("quotation_number").notNull(),
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
  vehicleSpecifications: text("vehicle_specifications"),
  
  // Vehicle specifications
  specifications: text("specifications"), // Additional specs input by user
  detailedSpecs: text("detailed_specs"), // Complete vehicle specifications based on make/model/year
  
  // Complete quotation data
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerIdNumber: text("customer_id_number"),
  carMaker: text("car_maker"),
  carModel: text("car_model"),
  carYear: text("car_year"),
  vinNumber: text("vin_number"),
  whatsappNumber: text("whatsapp_number"),
  validityPeriod: integer("validity_period").default(30),
  
  // Additional pricing fields
  insurancePrice: decimal("insurance_price", { precision: 10, scale: 2 }).default("0.00"),
  additionalServicesPrice: decimal("additional_services_price", { precision: 10, scale: 2 }).default("0.00"),
  
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
  brandLogo: text("brand_logo"),
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

// Terms and Conditions table for management
export const termsAndConditions = pgTable("terms_and_conditions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTermsAndConditionsSchema = createInsertSchema(termsAndConditions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTermsAndConditions = z.infer<typeof insertTermsAndConditionsSchema>;
export type TermsAndConditions = typeof termsAndConditions.$inferSelect;

// PDF Customization Settings
export const pdfCustomization = pgTable("pdf_customization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Setting template name
  
  // Font Settings
  headerFontSize: integer("header_font_size").default(108),
  companyNameFontSize: integer("company_name_font_size").default(162),
  dateFontSize: integer("date_font_size").default(66),
  greetingFontSize: integer("greeting_font_size").default(72),
  sectionTitleFontSize: integer("section_title_font_size").default(66),
  contentFontSize: integer("content_font_size").default(54),
  specificationsTitleFontSize: integer("specifications_title_font_size").default(72),
  specificationsContentFontSize: integer("specifications_content_font_size").default(57),
  pricingTitleFontSize: integer("pricing_title_font_size").default(72),
  pricingContentFontSize: integer("pricing_content_font_size").default(57),
  amountWordsFontSize: integer("amount_words_font_size").default(66),
  signatureFontSize: integer("signature_font_size").default(60),
  footerFontSize: integer("footer_font_size").default(42),
  
  // Color Settings
  headerBackgroundColor: text("header_background_color").default("#00627F"),
  headerTextColor: text("header_text_color").default("#FFFFFF"),
  companyNameColor: text("company_name_color").default("#C79C45"),
  contentTextColor: text("content_text_color").default("#000000"),
  sectionTitleColor: text("section_title_color").default("#00627F"),
  amountWordsColor: text("amount_words_color").default("#C79C45"),
  footerBackgroundColor: text("footer_background_color").default("#C79C45"),
  footerTextColor: text("footer_text_color").default("#000000"),
  
  // Logo Settings
  logoWidth: integer("logo_width").default(600),
  logoHeight: integer("logo_height").default(408),
  logoPositionX: integer("logo_position_x").default(-300), // Relative to right edge
  logoPositionY: integer("logo_position_y").default(3),
  showWatermark: boolean("show_watermark").default(true),
  watermarkOpacity: decimal("watermark_opacity", { precision: 3, scale: 2 }).default("0.08"),
  
  // Stamp Settings
  stampWidth: integer("stamp_width").default(113),
  stampHeight: integer("stamp_height").default(71),
  stampPositionX: integer("stamp_position_x").default(-125), // Relative to section
  stampPositionY: integer("stamp_position_y").default(15),
  
  // Layout Settings
  headerHeight: integer("header_height").default(200),
  sectionSpacing: integer("section_spacing").default(20),
  marginTop: integer("margin_top").default(5),
  marginLeft: integer("margin_left").default(5),
  marginRight: integer("margin_right").default(5),
  marginBottom: integer("margin_bottom").default(5),
  
  // Element Positions
  datePositionX: integer("date_position_x").default(-8),
  datePositionY: integer("date_position_y").default(175),
  quotationNumberPositionX: integer("quotation_number_position_x").default(8),
  quotationNumberPositionY: integer("quotation_number_position_y").default(175),
  greetingPositionY: integer("greeting_position_y").default(14),
  
  // Font Family Settings
  headerFontFamily: text("header_font_family").default("Arial"),
  contentFontFamily: text("content_font_family").default("Arial"),
  arabicFontFamily: text("arabic_font_family").default("Arial"),
  
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPdfCustomizationSchema = createInsertSchema(pdfCustomization).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPdfCustomization = z.infer<typeof insertPdfCustomizationSchema>;
export type PdfCustomization = typeof pdfCustomization.$inferSelect;

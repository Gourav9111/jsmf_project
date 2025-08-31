import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "admin", "dsa", "user"
  fullName: text("full_name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  city: text("city"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  loanType: text("loan_type").notNull(), // "personal", "business", "home", "lap", "working-capital"
  amount: decimal("amount", { precision: 12, scale: 2 }),
  tenure: integer("tenure"), // in months
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).default("7.5"),
  status: text("status").default("pending"), // "pending", "approved", "rejected", "under-review"
  assignedDsaId: varchar("assigned_dsa_id").references(() => users.id),
  monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }),
  employmentType: text("employment_type"), // "salaried", "self-employed", "business"
  purpose: text("purpose"),
  documents: text("documents"), // JSON string of uploaded documents
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dsaPartners = pgTable("dsa_partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  experience: text("experience"),
  background: text("background"),
  profilePicture: text("profile_picture"), // URL to uploaded profile picture
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("2.0"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0"),
  totalLeads: integer("total_leads").default(0),
  successfulLeads: integer("successful_leads").default(0),
  kycStatus: text("kyc_status").default("pending"), // "pending", "verified", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email"),
  loanType: text("loan_type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  city: text("city"),
  source: text("source").default("website"), // "website", "referral", "advertisement"
  status: text("status").default("new"), // "new", "contacted", "qualified", "converted", "closed"
  assignedDsaId: varchar("assigned_dsa_id").references(() => users.id),
  assignedAt: timestamp("assigned_at"),
  convertedAt: timestamp("converted_at"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactQueries = pgTable("contact_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  email: text("email"),
  loanType: text("loan_type"),
  message: text("message").notNull(),
  status: text("status").default("new"), // "new", "responded", "closed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  fullName: true,
  mobileNumber: true,
  city: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).pick({
  loanType: true,
  amount: true,
  tenure: true,
  monthlyIncome: true,
  employmentType: true,
  purpose: true,
});

export const insertDsaPartnerSchema = createInsertSchema(dsaPartners).pick({
  experience: true,
  background: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  mobileNumber: true,
  email: true,
  loanType: true,
  amount: true,
  city: true,
  source: true,
});

export const insertContactQuerySchema = createInsertSchema(contactQueries).pick({
  name: true,
  mobileNumber: true,
  email: true,
  loanType: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertDsaPartner = z.infer<typeof insertDsaPartnerSchema>;
export type DsaPartner = typeof dsaPartners.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertContactQuery = z.infer<typeof insertContactQuerySchema>;
export type ContactQuery = typeof contactQueries.$inferSelect;

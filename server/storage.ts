import { 
  users, 
  loanApplications, 
  dsaPartners, 
  leads, 
  contactQueries,
  type User, 
  type InsertUser,
  type LoanApplication,
  type InsertLoanApplication,
  type DsaPartner,
  type InsertDsaPartner,
  type Lead,
  type InsertLead,
  type ContactQuery,
  type InsertContactQuery
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  // Loan application operations
  createLoanApplication(application: InsertLoanApplication & { userId: string }): Promise<LoanApplication>;
  getLoanApplications(): Promise<LoanApplication[]>;
  getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]>;
  getLoanApplicationsByDsa(dsaId: string): Promise<LoanApplication[]>;
  getLoanApplicationsByMobile(mobileNumber: string): Promise<LoanApplication[]>;
  updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication>;
  
  // DSA partner operations
  createDsaPartner(partner: InsertDsaPartner & { userId: string }): Promise<DsaPartner>;
  getDsaPartners(): Promise<DsaPartner[]>;
  getDsaPartnerByUserId(userId: string): Promise<DsaPartner | undefined>;
  updateDsaPartner(id: string, updates: Partial<DsaPartner>): Promise<DsaPartner>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadsByDsa(dsaId: string): Promise<Lead[]>;
  assignLeadToDsa(leadId: string, dsaId: string): Promise<Lead>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  
  // Contact query operations
  createContactQuery(query: InsertContactQuery): Promise<ContactQuery>;
  getContactQueries(): Promise<ContactQuery[]>;
  updateContactQuery(id: string, updates: Partial<ContactQuery>): Promise<ContactQuery>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private loanApplications: Map<string, LoanApplication> = new Map();
  private dsaPartners: Map<string, DsaPartner> = new Map();
  private leads: Map<string, Lead> = new Map();
  private contactQueries: Map<string, ContactQuery> = new Map();

  constructor() {
    this.initializeDefaultUsers();
  }

  private async initializeDefaultUsers() {
    // Create admin user
    const adminId = randomUUID();
    const hashedPassword = await bcrypt.hash("Harsh@9131", 10);
    this.users.set(adminId, {
      id: adminId,
      username: "harsh@jsmf.in",
      email: "harsh@jsmf.in",
      password: hashedPassword,
      role: "admin",
      fullName: "Harsh Kumar",
      mobileNumber: "+91 91626 207918",
      city: "Bhopal",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      role: insertUser.role || "user",
      city: insertUser.city || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Loan application operations
  async createLoanApplication(application: InsertLoanApplication & { userId: string }): Promise<LoanApplication> {
    const id = randomUUID();
    const loanApp: LoanApplication = {
      ...application,
      id,
      userId: application.userId,
      amount: application.amount || null,
      tenure: application.tenure || null,
      monthlyIncome: application.monthlyIncome || null,
      employmentType: application.employmentType || null,
      purpose: application.purpose || null,
      interestRate: "7.5",
      status: "pending",
      assignedDsaId: null,
      documents: null,
      remarks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.loanApplications.set(id, loanApp);
    return loanApp;
  }

  async getLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values());
  }

  async getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values()).filter(app => app.userId === userId);
  }

  async getLoanApplicationsByDsa(dsaId: string): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values()).filter(app => app.assignedDsaId === dsaId);
  }

  async getLoanApplicationsByMobile(mobileNumber: string): Promise<LoanApplication[]> {
    const userWithMobile = Array.from(this.users.values()).find(user => user.mobileNumber === mobileNumber);
    if (!userWithMobile) return [];
    
    return Array.from(this.loanApplications.values()).filter(app => app.userId === userWithMobile.id);
  }

  async updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication> {
    const application = this.loanApplications.get(id);
    if (!application) throw new Error("Application not found");
    
    const updatedApp = { ...application, ...updates, updatedAt: new Date() };
    this.loanApplications.set(id, updatedApp);
    return updatedApp;
  }

  // DSA partner operations
  async createDsaPartner(partner: InsertDsaPartner & { userId: string }): Promise<DsaPartner> {
    const id = randomUUID();
    const dsaPartner: DsaPartner = {
      ...partner,
      id,
      userId: partner.userId,
      experience: partner.experience || null,
      background: partner.background || null,
      profilePicture: null,
      commissionRate: "2.0",
      totalEarnings: "0",
      totalLeads: 0,
      successfulLeads: 0,
      kycStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dsaPartners.set(id, dsaPartner);
    return dsaPartner;
  }

  async getDsaPartners(): Promise<DsaPartner[]> {
    return Array.from(this.dsaPartners.values());
  }

  async getDsaPartnerByUserId(userId: string): Promise<DsaPartner | undefined> {
    return Array.from(this.dsaPartners.values()).find(partner => partner.userId === userId);
  }

  async updateDsaPartner(id: string, updates: Partial<DsaPartner>): Promise<DsaPartner> {
    const partner = this.dsaPartners.get(id);
    if (!partner) throw new Error("DSA partner not found");
    
    const updatedPartner = { ...partner, ...updates, updatedAt: new Date() };
    this.dsaPartners.set(id, updatedPartner);
    return updatedPartner;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const newLead: Lead = {
      ...lead,
      id,
      email: lead.email || null,
      amount: lead.amount || null,
      city: lead.city || null,
      source: lead.source || "website",
      status: "new",
      assignedDsaId: null,
      assignedAt: null,
      convertedAt: null,
      remarks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadsByDsa(dsaId: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.assignedDsaId === dsaId);
  }

  async assignLeadToDsa(leadId: string, dsaId: string): Promise<Lead> {
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { 
      ...lead, 
      assignedDsaId: dsaId, 
      assignedAt: new Date(),
      updatedAt: new Date() 
    };
    this.leads.set(leadId, updatedLead);
    return updatedLead;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    
    const updatedLead = { ...lead, ...updates, updatedAt: new Date() };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Contact query operations
  async createContactQuery(query: InsertContactQuery): Promise<ContactQuery> {
    const id = randomUUID();
    const contactQuery: ContactQuery = {
      ...query,
      id,
      email: query.email || null,
      loanType: query.loanType || null,
      status: "new",
      createdAt: new Date(),
    };
    this.contactQueries.set(id, contactQuery);
    return contactQuery;
  }

  async getContactQueries(): Promise<ContactQuery[]> {
    return Array.from(this.contactQueries.values());
  }

  async updateContactQuery(id: string, updates: Partial<ContactQuery>): Promise<ContactQuery> {
    const query = this.contactQueries.get(id);
    if (!query) throw new Error("Contact query not found");
    
    const updatedQuery = { ...query, ...updates };
    this.contactQueries.set(id, updatedQuery);
    return updatedQuery;
  }
}

// Database storage implementation
export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const userData = {
      ...insertUser,
      password: hashedPassword,
      role: insertUser.role || "user",
    };
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(users).set({...updates, updatedAt: new Date()}).where(eq(users.id, id)).returning();
    if (!result[0]) throw new Error("User not found");
    return result[0];
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Loan application operations
  async createLoanApplication(application: InsertLoanApplication & { userId: string }): Promise<LoanApplication> {
    const result = await db.insert(loanApplications).values(application).returning();
    return result[0];
  }

  async getLoanApplications(): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications);
  }

  async getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
  }

  async getLoanApplicationsByDsa(dsaId: string): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications).where(eq(loanApplications.assignedDsaId, dsaId));
  }

  async getLoanApplicationsByMobile(mobileNumber: string): Promise<LoanApplication[]> {
    const userList = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    if (!userList.length) return [];
    
    const userIds = userList.map(u => u.id);
    const applications = [];
    for (const userId of userIds) {
      const userApps = await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
      applications.push(...userApps);
    }
    return applications;
  }

  async updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication> {
    const result = await db.update(loanApplications).set({...updates, updatedAt: new Date()}).where(eq(loanApplications.id, id)).returning();
    if (!result[0]) throw new Error("Application not found");
    return result[0];
  }

  // DSA partner operations
  async createDsaPartner(partner: InsertDsaPartner & { userId: string }): Promise<DsaPartner> {
    const result = await db.insert(dsaPartners).values(partner).returning();
    return result[0];
  }

  async getDsaPartners(): Promise<DsaPartner[]> {
    return await db.select().from(dsaPartners);
  }

  async getDsaPartnerByUserId(userId: string): Promise<DsaPartner | undefined> {
    const result = await db.select().from(dsaPartners).where(eq(dsaPartners.userId, userId)).limit(1);
    return result[0];
  }

  async updateDsaPartner(id: string, updates: Partial<DsaPartner>): Promise<DsaPartner> {
    const result = await db.update(dsaPartners).set({...updates, updatedAt: new Date()}).where(eq(dsaPartners.id, id)).returning();
    if (!result[0]) throw new Error("DSA partner not found");
    return result[0];
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadsByDsa(dsaId: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.assignedDsaId, dsaId));
  }

  async assignLeadToDsa(leadId: string, dsaId: string): Promise<Lead> {
    const result = await db.update(leads).set({ assignedDsaId: dsaId, assignedAt: new Date(), updatedAt: new Date() }).where(eq(leads.id, leadId)).returning();
    if (!result[0]) throw new Error("Lead not found");
    return result[0];
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const result = await db.update(leads).set({...updates, updatedAt: new Date()}).where(eq(leads.id, id)).returning();
    if (!result[0]) throw new Error("Lead not found");
    return result[0];
  }

  // Contact query operations
  async createContactQuery(query: InsertContactQuery): Promise<ContactQuery> {
    const result = await db.insert(contactQueries).values(query).returning();
    return result[0];
  }

  async getContactQueries(): Promise<ContactQuery[]> {
    return await db.select().from(contactQueries);
  }

  async updateContactQuery(id: string, updates: Partial<ContactQuery>): Promise<ContactQuery> {
    const result = await db.update(contactQueries).set(updates).where(eq(contactQueries.id, id)).returning();
    if (!result[0]) throw new Error("Contact query not found");
    return result[0];
  }
}

export const storage = new DbStorage();

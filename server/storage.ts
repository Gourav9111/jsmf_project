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
    const hashedPassword = await bcrypt.hash("Harsh@9191", 10);
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

export const storage = new MemStorage();

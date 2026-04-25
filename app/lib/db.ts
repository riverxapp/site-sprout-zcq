// In-memory persistence layer for CRM app
// Data is stored in a JSON object and persisted to a file for development.

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const seedData = {
  users: [
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  customers: [
    {
      id: 'cust-1',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '555-0100',
      company: 'Acme Corp',
      stage: 'active',
      ownerId: 'user-1',
      notes: 'Initial contact made.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cust-2',
      name: 'Globex Inc.',
      email: 'info@globex.com',
      phone: '555-0200',
      company: 'Globex Inc.',
      stage: 'lead',
      ownerId: 'user-1',
      notes: 'Interested in our product.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0300',
      source: 'web',
      status: 'new',
      ownerId: 'user-1',
      notes: 'Website inquiry.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'lead-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-0400',
      source: 'referral',
      status: 'contacted',
      ownerId: 'user-1',
      notes: 'Referred by existing customer.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  deals: [
    {
      id: 'deal-1',
      title: 'Acme Corp - Enterprise Plan',
      value: 50000,
      stage: 'negotiation',
      customerId: 'cust-1',
      ownerId: 'user-1',
      notes: 'Negotiating contract terms.',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'deal-2',
      title: 'Globex Inc. - Basic Plan',
      value: 10000,
      stage: 'prospecting',
      customerId: 'cust-2',
      ownerId: 'user-1',
      notes: 'Initial proposal sent.',
      closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Follow up with Acme Corp',
      description: 'Call contact to discuss pricing.',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigneeId: 'user-1',
      relatedEntityType: 'customer',
      relatedEntityId: 'cust-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Send proposal to Globex',
      description: 'Prepare and send the finalized proposal.',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assigneeId: 'user-1',
      relatedEntityType: 'lead',
      relatedEntityId: 'lead-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  notes: [
    {
      id: 'note-1',
      content: 'Had a great call with the Acme team. They are interested in the enterprise plan.',
      entityType: 'customer',
      entityId: 'cust-1',
      authorId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'note-2',
      content: 'Jane seems very interested. Follow up next week.',
      entityType: 'lead',
      entityId: 'lead-2',
      authorId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Load or initialize data
let data: typeof seedData;

function loadData(): typeof seedData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load data, falling back to seed:', e);
  }
  return JSON.parse(JSON.stringify(seedData));
}

function saveData(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

data = loadData();

// Generic CRUD helpers
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function now(): string {
  return new Date().toISOString();
}

function getAll<T>(collection: keyof typeof data): T[] {
  return data[collection] as unknown as T[];
}

function getById<T extends { id: string }>(collection: keyof typeof data, id: string): T | undefined {
  const items = data[collection] as unknown as T[];
  return items.find(item => item.id === id);
}

function create<T extends { id?: string }>(collection: keyof typeof data, item: T): T {
  const newItem = {
    ...item,
    id: item.id || generateId(),
    createdAt: now(),
    updatedAt: now(),
  } as unknown as typeof data[keyof typeof data][0];
  (data[collection] as any[]).push(newItem);
  saveData();
  return newItem as unknown as T;
}

function update<T extends { id: string }>(collection: keyof typeof data, id: string, updates: Partial<T>): T | null {
  const items = data[collection] as unknown as T[];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  const updated = {
    ...items[index],
    ...updates,
    id, // prevent id overwrite
    updatedAt: now(),
  };
  (data[collection] as any[])[index] = updated;
  saveData();
  return updated as T;
}

function remove(collection: keyof typeof data, id: string): boolean {
  const items = data[collection] as any[];
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  saveData();
  return true;
}

// Seed function
function seed(): void {
  data = JSON.parse(JSON.stringify(seedData));
  saveData();
}

// User-specific methods
export function getUserByEmail(email: string) {
  const users = getAll<any>('users');
  return users.find(u => u.email === email) || null;
}

// Customer-specific methods
export function getCustomers(params?: { search?: string; stage?: string; page?: number; limit?: number }) {
  let customers = getAll<any>('customers');
  if (params?.search) {
    const s = params.search.toLowerCase();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.company.toLowerCase().includes(s)
    );
  }
  if (params?.stage && params.stage !== 'all') {
    customers = customers.filter(c => c.stage === params.stage);
  }
  const total = customers.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const paginated = customers.slice(start, start + limit);
  return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getCustomerById(id: string) {
  return getById<any>('customers', id) || null;
}

export function createCustomer(customer: any) {
  return create('customers', customer);
}

export function updateCustomer(id: string, updates: any) {
  return update<any>('customers', id, updates);
}

export function deleteCustomer(id: string) {
  return remove('customers', id);
}

// Lead-specific methods
export function getLeads(params?: { search?: string; status?: string; source?: string; page?: number; limit?: number }) {
  let leads = getAll<any>('leads');
  if (params?.search) {
    const s = params.search.toLowerCase();
    leads = leads.filter(l =>
      l.name.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s)
    );
  }
  if (params?.status && params.status !== 'all') {
    leads = leads.filter(l => l.status === params.status);
  }
  if (params?.source && params.source !== 'all') {
    leads = leads.filter(l => l.source === params.source);
  }
  const total = leads.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const paginated = leads.slice(start, start + limit);
  return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getLeadById(id: string) {
  return getById<any>('leads', id) || null;
}

export function createLead(lead: any) {
  return create('leads', lead);
}

export function updateLead(id: string, updates: any) {
  return update<any>('leads', id, updates);
}

export function deleteLead(id: string) {
  return remove('leads', id);
}

export function convertLeadToCustomer(leadId: string) {
  const lead = getLeadById(leadId);
  if (!lead) return null;
  const customer = createCustomer({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    stage: 'lead',
    ownerId: lead.ownerId,
    notes: `Converted from lead (source: ${lead.source})`,
  });
  deleteLead(leadId);
  return customer;
}

// Deal-specific methods
export function getDeals(params?: { stage?: string; page?: number; limit?: number }) {
  let deals = getAll<any>('deals');
  if (params?.stage && params.stage !== 'all') {
    deals = deals.filter(d => d.stage === params.stage);
  }
  const total = deals.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const paginated = deals.slice(start, start + limit);
  return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getDealById(id: string) {
  return getById<any>('deals', id) || null;
}

export function createDeal(deal: any) {
  return create('deals', deal);
}

export function updateDeal(id: string, updates: any) {
  return update<any>('deals', id, updates);
}

export function deleteDeal(id: string) {
  return remove('deals', id);
}

// Task-specific methods
export function getTasks(params?: { status?: string; assigneeId?: string; priority?: string; page?: number; limit?: number }) {
  let tasks = getAll<any>('tasks');
  if (params?.status && params.status !== 'all') {
    tasks = tasks.filter(t => t.status === params.status);
  }
  if (params?.assigneeId && params.assigneeId !== 'all') {
    tasks = tasks.filter(t => t.assigneeId === params.assigneeId);
  }
  if (params?.priority && params.priority !== 'all') {
    tasks = tasks.filter(t => t.priority === params.priority);
  }
  const total = tasks.length;
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + limit);
  return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getTaskById(id: string) {
  return getById<any>('tasks', id) || null;
}

export function createTask(task: any) {
  return create('tasks', task);
}

export function updateTask(id: string, updates: any) {
  return update<any>('tasks', id, updates);
}

export function deleteTask(id: string) {
  return remove('tasks', id);
}

// Note-specific methods
export function getNotes(entityType?: string, entityId?: string) {
  let notes = getAll<any>('notes');
  if (entityType) {
    notes = notes.filter(n => n.entityType === entityType);
  }
  if (entityId) {
    notes = notes.filter(n => n.entityId === entityId);
  }
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createNote(note: any) {
  return create('notes', note);
}

// Dashboard stats
export function getDashboardStats() {
  const customers = getAll<any>('customers');
  const leads = getAll<any>('leads');
  const deals = getAll<any>('deals');
  const tasks = getAll<any>('tasks');
  return {
    totalCustomers: customers.length,
    totalLeads: leads.length,
    totalDeals: deals.length,
    totalTasks: tasks.length,
    dealsByStage: {
      prospecting: deals.filter(d => d.stage === 'prospecting').length,
      negotiation: deals.filter(d => d.stage === 'negotiation').length,
      closed_won: deals.filter(d => d.stage === 'closed_won').length,
      closed_lost: deals.filter(d => d.stage === 'closed_lost').length,
    },
    tasksByStatus: {
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    },
  };
}

// Expose seed for testing
export { seed };

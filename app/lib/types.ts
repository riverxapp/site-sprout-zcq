export type CustomerStage = "lead" | "qualified" | "opportunity" | "customer" | "churned";
export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type DealStage = "prospecting" | "negotiation" | "closed_won" | "closed_lost";
export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type EntityType = "customer" | "lead" | "deal" | "task";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  stage: CustomerStage;
  notes?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  customerId: string;
  closeDate?: string;
  notes?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  entityType: EntityType;
  entityId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBData {
  users: User[];
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  notes: Note[];
}

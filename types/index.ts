export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive" | "prospect"
  value: number
  lastContact: string
  source: string
  tags: string[]
  notes: string
  createdAt: string
}

export interface Deal {
  id: string
  title: string
  company: string
  value: number
  probability: number
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  expectedCloseDate: string
  customerId: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  leadScore: number
  status: "new" | "contacted" | "qualified" | "unqualified"
  source: string
  tags: string[]
  lastContact: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  type: "call" | "email" | "meeting" | "follow-up" | "demo" | "proposal" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  dueDate: string
  dueTime?: string
  customerId?: string
  dealId?: string
  contactId?: string
  assignedTo: string
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  notes?: string
  reminderMinutes?: number // Minutes before due time to send reminder
}

export interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "note" | "deal_created" | "deal_updated" | "task_created" | "task_completed"
  title: string
  description: string
  customerId?: string
  dealId?: string
  contactId?: string
  taskId?: string
  createdAt: string
}

export interface Metrics {
  totalCustomers: number
  activeDeals: number
  monthlyRevenue: number
  conversionRate: number
  totalContacts: number
  qualifiedLeads: number
  pendingTasks: number
  overdueTasks: number
  completedTasksThisWeek: number
}

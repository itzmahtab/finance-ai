export type User = {
  id: string;
  email: string;
  fullName: string | null;
  profession: string | null;
  country: string | null;
  currency: string | null;
  monthlySalary: number | null;
  currentSavings: number | null;
  riskTolerance: 'low' | 'medium' | 'high';
  financialGoals: string[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  type: 'need' | 'want' | 'saving' | 'investment';
  icon: string | null;
  color: string | null;
  isDefault: boolean;
};

export type Transaction = {
  id: string;
  userId: string;
  categoryId: number;
  amount: number;
  type: 'income' | 'expense';
  description: string | null;
  transactionDate: string;
  isRecurring: boolean;
  recurrencePeriod: 'monthly' | 'weekly' | 'yearly' | null;
  createdAt: string;
};

export type Budget = {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  month: number;
  year: number;
  strategy: '50_30_20' | 'custom';
  createdAt: string;
};

export type BudgetItem = {
  id: string;
  budgetId: string;
  categoryId: number;
  allocatedAmount: number;
  spentAmount: number;
  percentage: number;
};

export type Investment = {
  id: string;
  userId: string;
  name: string;
  type: 'stocks' | 'etf' | 'mutual_fund' | 'retirement' | 'crypto' | 'other';
  investedAmount: number;
  currentValue: number;
  startDate: string;
  platform: string | null;
  notes: string | null;
  updatedAt: string;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number | null;
  targetDate: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'goal_milestone' | 'insight' | 'reminder' | 'system';
  isRead: boolean;
  metadata: Record<string, any> | null;
  createdAt: string;
};

export type AIConversation = {
  id: string;
  userId: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  contextType: 'general' | 'budget' | 'investment' | 'goal';
  createdAt: string;
  updatedAt: string;
};

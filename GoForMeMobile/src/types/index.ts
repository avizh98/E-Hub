// User Types
export type UserRole = 'requester' | 'helper';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HelperProfile extends User {
  governmentId?: string;
  idVerificationStatus: 'pending' | 'verified' | 'rejected';
  vehicleType?: 'bicycle' | 'motorbike' | 'car' | 'walking';
  currentLocation?: Location;
  isAvailable: boolean;
  completedTasks: number;
  earnings: number;
}

// Task Types
export type TaskCategory = 'shopping' | 'pharmacy' | 'pickup-delivery' | 'other';
export type TaskStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
export type TaskUrgency = 'asap' | 'scheduled';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
}

export interface Task {
  id: string;
  requesterId: string;
  helperId?: string;
  category: TaskCategory;
  title: string;
  description: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  urgency: TaskUrgency;
  scheduledTime?: Date;
  estimatedDuration: number; // in minutes
  budget: number;
  serviceFee: number;
  totalAmount: number;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  attachments?: string[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: 'text' | 'image' | 'voice';
  attachmentUrl?: string;
  isRead: boolean;
  sentAt: Date;
}

// Payment Types
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payment {
  id: string;
  taskId: string;
  amount: number;
  tip?: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

// Rating Types
export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  review?: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'task_request' | 'task_accepted' | 'task_completed' | 'payment_received' | 'new_message';
  data?: any;
  isRead: boolean;
  createdAt: Date;
}
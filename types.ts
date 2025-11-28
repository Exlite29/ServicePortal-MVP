export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type JobStatus = 'Queued' | 'Scheduled' | 'Work In Progress' | 'Completed' | 'Cancelled';

export interface Attachment {
  uuid: string;
  filename: string;
  mime_type: string;
  url: string;
  size_kb: number;
}

export interface Message {
  uuid: string;
  sender_type: 'CLIENT' | 'STAFF';
  sender_name: string;
  message: string;
  created_at: string; // ISO String
}

export interface Job {
  uuid: string;
  job_number: string;
  status: JobStatus;
  description: string;
  address: string;
  scheduled_date?: string; // ISO String
  technician_name?: string;
  attachments: Attachment[];
  messages: Message[];
}

export type ViewState = 'LOGIN' | 'LIST' | 'DETAIL';
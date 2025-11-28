import { Job, Message, User } from '../types';
import { MOCK_JOBS, MOCK_USER } from './mockData';

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class PortalService {
  private jobs: Job[] = [...MOCK_JOBS];

  async login(email: string, phone: string): Promise<User> {
    await delay(800);
    // In a real app, this would hit the Express backend which verifies credentials
    if (email && phone) {
      return MOCK_USER;
    }
    throw new Error('Invalid credentials');
  }

  async getJobs(): Promise<Job[]> {
    await delay(600);
    // In real app: GET /api/jobs
    return this.jobs;
  }

  async getJobDetails(uuid: string): Promise<Job | undefined> {
    await delay(400);
    return this.jobs.find(j => j.uuid === uuid);
  }

  async sendMessage(jobUuid: string, text: string): Promise<Message> {
    await delay(500);
    
    const newMessage: Message = {
      uuid: `msg_${Date.now()}`,
      sender_type: 'CLIENT',
      sender_name: MOCK_USER.name,
      message: text,
      created_at: new Date().toISOString()
    };

    // Update local state to persist within session
    const jobIndex = this.jobs.findIndex(j => j.uuid === jobUuid);
    if (jobIndex > -1) {
      this.jobs[jobIndex].messages = [...this.jobs[jobIndex].messages, newMessage];
    }

    return newMessage;
  }
}

export const portalService = new PortalService();
import { Job } from '../types';

export const MOCK_USER = {
  id: 'u_123',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '0400123456'
};

export const MOCK_JOBS: Job[] = [
  {
    uuid: 'job_001',
    job_number: 'J-1024',
    status: 'Scheduled',
    description: 'Residential HVAC Inspection and Filter Replacement',
    address: '123 Maple Street, Springfield',
    scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    technician_name: 'Mike Ross',
    attachments: [
      {
        uuid: 'att_1',
        filename: 'invoice_estimate.pdf',
        mime_type: 'application/pdf',
        url: 'https://picsum.photos/200/300', // Placeholder
        size_kb: 450
      }
    ],
    messages: [
      {
        uuid: 'msg_1',
        sender_type: 'STAFF',
        sender_name: 'Dispatch',
        message: 'Hi Alex, confirming your appointment for tomorrow at 10 AM.',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  },
  {
    uuid: 'job_002',
    job_number: 'J-1021',
    status: 'Completed',
    description: 'Emergency Leak Repair - Kitchen Sink',
    address: '123 Maple Street, Springfield',
    scheduled_date: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    technician_name: 'Harvey Specter',
    attachments: [
      {
        uuid: 'att_2',
        filename: 'before_repair.jpg',
        mime_type: 'image/jpeg',
        url: 'https://picsum.photos/400/300',
        size_kb: 2100
      },
      {
        uuid: 'att_3',
        filename: 'after_repair.jpg',
        mime_type: 'image/jpeg',
        url: 'https://picsum.photos/401/300',
        size_kb: 2300
      }
    ],
    messages: [
      {
        uuid: 'msg_2',
        sender_type: 'CLIENT',
        sender_name: 'Alex Johnson',
        message: 'The leak is getting worse, please hurry!',
        created_at: new Date(Date.now() - 604900000).toISOString()
      },
      {
        uuid: 'msg_3',
        sender_type: 'STAFF',
        sender_name: 'Harvey Specter',
        message: 'On my way now. ETA 15 mins.',
        created_at: new Date(Date.now() - 604850000).toISOString()
      }
    ]
  },
  {
    uuid: 'job_003',
    job_number: 'J-1025',
    status: 'Queued',
    description: 'Annual Electrical Safety Check',
    address: '123 Maple Street, Springfield',
    technician_name: 'Pending Assignment',
    attachments: [],
    messages: []
  }
];
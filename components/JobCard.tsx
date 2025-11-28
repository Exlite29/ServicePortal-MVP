import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Queued': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
          {job.job_number}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
        {job.description}
      </h3>
      
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="truncate">{job.address}</span>
        </div>
        
        {job.scheduled_date && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>{new Date(job.scheduled_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
         <span>{job.messages.length} Messages</span>
         <span>{job.attachments.length} Files</span>
      </div>
    </div>
  );
};
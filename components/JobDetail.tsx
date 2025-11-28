import React, { useState, useEffect, useRef } from 'react';
import { Job, Message } from '../types';
import { Button } from './Button';
import { portalService } from '../services/portalService';
import { GoogleGenAI } from "@google/genai";

interface JobDetailProps {
  job: Job;
  onBack: () => void;
  onUpdateJob: (updatedJob: Job) => void;
}

type Tab = 'overview' | 'messages' | 'files';

export const JobDetail: React.FC<JobDetailProps> = ({ job, onBack, onUpdateJob }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [job.messages, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const sentMsg = await portalService.sendMessage(job.uuid, newMessage);
      const updatedJob = { ...job, messages: [...job.messages, sentMsg] };
      onUpdateJob(updatedJob);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Using Gemini to draft a polite message
  const handleAISuggestion = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not found in environment for AI features.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Context: I am a customer communicating with a service technician about a job: "${job.description}".
        The current status is ${job.status}.
        Last message from them (if any): "${job.messages.length > 0 ? job.messages[job.messages.length - 1].message : 'None'}".
        Task: Write a short, polite, professional follow-up message asking about the timeline or thanking them. Max 20 words.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      if (response.text) {
        setNewMessage(response.text.trim());
      }
    } catch (e) {
      console.error("AI generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">{job.job_number}</h2>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              {job.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate">{job.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 flex space-x-6">
        {(['overview', 'messages', 'files'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                  <p className="mt-1 text-slate-700">{job.description}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</label>
                  <p className="mt-1 text-slate-700">{job.status}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Technician</label>
                  <p className="mt-1 text-slate-700">{job.technician_name || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Scheduled Date</label>
                  <p className="mt-1 text-slate-700">
                    {job.scheduled_date 
                      ? new Date(job.scheduled_date).toLocaleString() 
                      : 'Not scheduled yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Location</h3>
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <p className="text-slate-800 font-medium text-lg">{job.address}</p>
                  <p className="text-slate-500 text-sm mt-1">Directions available via standard maps.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {job.attachments.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-400">
                No attachments found.
              </div>
            ) : (
              job.attachments.map(att => (
                <div key={att.uuid} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-3 relative">
                     {/* Using placeholder images as per instructions */}
                     <img src={att.url} alt={att.filename} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                     </div>
                  </div>
                  <p className="text-sm font-medium text-slate-700 truncate" title={att.filename}>{att.filename}</p>
                  <p className="text-xs text-slate-400">{att.size_kb} KB</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-col h-[calc(100vh-220px)]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {job.messages.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  No messages yet. Start a conversation.
                </div>
              )}
              {job.messages.map((msg) => {
                const isClient = msg.sender_type === 'CLIENT';
                return (
                  <div key={msg.uuid} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isClient 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${isClient ? 'text-teal-200' : 'text-slate-400'}`}>
                        {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-50 border-transparent focus:bg-white rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                />
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAISuggestion}
                    disabled={isGenerating}
                    title="Generate AI Reply"
                >
                  {isGenerating ? '...' : '✨'}
                </Button>
                <Button type="submit" disabled={!newMessage.trim() || isSending} isLoading={isSending}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
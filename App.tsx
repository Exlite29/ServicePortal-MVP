import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { JobCard } from './components/JobCard';
import { JobDetail } from './components/JobDetail';
import { portalService } from './services/portalService';
import { User, Job, ViewState } from './types';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  // Load jobs when user logs in
  useEffect(() => {
    if (user && view === 'LIST') {
      loadJobs();
    }
  }, [user, view]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await portalService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('LIST');
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setView('DETAIL');
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setView('LIST');
    // Refresh jobs to show new messages if any
    loadJobs();
  };

  const handleLogout = () => {
    setUser(null);
    setJobs([]);
    setSelectedJob(null);
    setView('LOGIN');
  };

  const handleJobUpdate = (updatedJob: Job) => {
    setSelectedJob(updatedJob);
    // Update the list state as well
    setJobs(prevJobs => prevJobs.map(j => j.uuid === updatedJob.uuid ? updatedJob : j));
  };

  if (view === 'LOGIN') {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="bg-primary text-white shadow-md z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">SP</div>
             <span className="font-semibold text-lg tracking-tight">ServicePortal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-teal-100">Hi, {user?.name.split(' ')[0]}</span>
            <button 
              onClick={handleLogout}
              className="text-sm bg-teal-800/50 hover:bg-teal-800 px-3 py-1.5 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {view === 'LIST' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
                <Button variant="ghost" onClick={loadJobs} isLoading={isLoading}>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </Button>
              </div>

              {isLoading && jobs.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white rounded-xl shadow-sm animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map(job => (
                    <JobCard key={job.uuid} job={job} onClick={handleJobClick} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'DETAIL' && selectedJob && (
          <div className="absolute inset-0 z-10 bg-slate-50">
            <JobDetail 
              job={selectedJob} 
              onBack={handleBackToList} 
              onUpdateJob={handleJobUpdate}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
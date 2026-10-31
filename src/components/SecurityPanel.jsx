import { useCallback, useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : 'https://passend.onrender.com');

const activityLabels = {
  created: 'Created a vault entry',
  updated: 'Updated a vault entry',
  deleted: 'Deleted a vault entry',
  favorited: 'Added a vault entry to favorites',
  unfavorited: 'Removed a vault entry from favorites'
};

const formatActivityTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(date);
};

const SecurityPanel = () => {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activityError, setActivityError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadActivity = useCallback(async (showLoading = true) => {
    if (!user?.id) return;

    if (showLoading) setIsLoading(true);
    setActivityError('');
    try {
      const token = await getToken();
      if (!token) throw new Error('Authentication token unavailable');
      const response = await fetch(`${API_URL}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Unable to load recent activity');
      setActivities(await response.json());
    } catch (error) {
      setActivityError(error.message || 'Unable to load recent activity');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [getToken, user]);

  const handleSignOutAll = async () => {
    if (!window.confirm('Sign out all other devices?')) return;

    setIsSigningOut(true);
    try {
      await signOut({ signOutOfOtherSessions: true });
      toast.success('Other sessions signed out');
    } catch (error) {
      toast.error(error.message || 'Unable to sign out other sessions');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <details className='relative' onToggle={(event) => { if (event.currentTarget.open) loadActivity(); }}>
      <summary className='list-none cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-[#4c4a70] transition hover:bg-[#f4effb] hover:text-[#7c3aed]'>
        <span className="flex items-center gap-2"><i className="bi bi-shield-lock" aria-hidden="true"></i> Security</span>
      </summary>
      <div className='security-popover absolute right-0 top-12 z-60 rounded-2xl border border-[#e8e1f0] bg-white text-left text-[#1b2140] shadow-[0_16px_40px_rgba(52,32,91,0.16)]'>
        <div className='security-header'>
          <div className="security-header-copy">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">Security center</p>
            <h2 className='font-bold text-lg'>Account security</h2>
          </div>
          <button type='button' onClick={handleSignOutAll} disabled={isSigningOut} className='security-signout rounded-md px-2 py-1 text-xs font-semibold text-[#7c3aed] transition hover:bg-[#f4effb] disabled:opacity-50 disabled:cursor-not-allowed' title="Sign out of other devices">
            {isSigningOut ? 'Signing out...' : 'Sign out other devices'}
          </button>
        </div>
        <div className='security-activity border-t border-[#e8e1f0]'>
          <div className='security-activity-heading'>
            <h3 className='font-semibold'>Recent activity</h3>
            <button type='button' onClick={loadActivity} className='rounded-md px-2 py-1 text-xs font-semibold text-[#7c3aed] transition hover:bg-[#f4effb]' title="Refresh recent activity">Refresh</button>
          </div>
          {isLoading && <p className='security-status text-sm text-gray-600'>Loading activity...</p>}
          {!isLoading && activityError && <p className='security-status text-sm text-red-700' role='alert'>{activityError}</p>}
          {!isLoading && !activityError && activities.length === 0 && <p className='security-status text-sm text-gray-600'>No recent activity.</p>}
          {!isLoading && !activityError && activities.length > 0 && (
            <ul className='security-activity-list space-y-2 overflow-y-auto'>
              {activities.map((activity, index) => (
                <li key={`${activity.createdAt}-${index}`} className='security-activity-item border-l-2 border-[#c4a8f3] text-sm'>
                  <p className='font-semibold'>{activityLabels[activity.action] || 'Vault activity'}</p>
                  <time className='text-xs text-[#77748d]' dateTime={activity.createdAt}>
                    {formatActivityTime(activity.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
};

export default SecurityPanel;

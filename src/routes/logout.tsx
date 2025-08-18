import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, Waves } from 'lucide-react';
import { supabase } from '~/services/supabase';

export const Route = createFileRoute('/logout')({
  component: LogoutComponent,
});

function LogoutComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        // Redirect to home page after successful logout
        navigate({ to: '/' });
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if there's an error
        navigate({ to: '/' });
      }
    };

    // Execute logout immediately when component mounts
    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-sea via-abyss to-ocean-deep flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Waves className="w-16 h-16 text-bio-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Logging Out</h2>
        <p className="text-gray-400">Returning to the surface...</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-bio-blue">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Redirecting...</span>
        </div>
      </motion.div>
    </div>
  );
}

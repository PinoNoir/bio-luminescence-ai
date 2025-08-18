import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Auth } from '~/components';
import { supabase } from '~/services/supabase';

export const Route = createFileRoute('/signup')({
  component: SignupComp,
});

function SignupComp() {
  const navigate = useNavigate();
  
  const signupMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      return { success: true };
    },
    onSuccess: () => {
      // Redirect to home page after successful signup
      navigate({ to: '/' });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-deep-sea via-abyss to-ocean-deep flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Join{' '}
            <span className="text-bio-blue animate-bio-glow-subtle">
              Bio Glow
            </span>
          </h1>
          <p className="text-gray-400">Begin your bioluminescent adventure</p>
        </div>
        
        <Auth
          actionText="Create Account"
          status={signupMutation.status}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            signupMutation.mutate({ email, password });
          }}
          afterSubmit={
            signupMutation.error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center"
              >
                {signupMutation.error.message}
              </motion.div>
            ) : (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <motion.a
                    href="/login"
                    className="text-bio-blue hover:text-bio-cyan transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign in here
                  </motion.a>
                </p>
              </div>
            )
          }
        />
      </div>
    </motion.div>
  );
}

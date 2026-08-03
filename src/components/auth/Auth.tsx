const inputClass =
  'w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-bio-blue/60 transition-colors';

function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
}: {
  actionText: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  status: 'pending' | 'idle' | 'success' | 'error'
  afterSubmit?: React.ReactNode
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(e)
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest font-data text-white/40 mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-widest font-data text-white/40 mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'pending'}
          className="w-full px-6 py-3 rounded font-medium text-[#0B1426] bg-bio-blue transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'pending' ? 'Working…' : actionText}
        </button>
        {afterSubmit ? afterSubmit : null}
      </form>
    </div>
  )
}

export default Auth;

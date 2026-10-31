'use client';

import {useRef, useState, type ReactNode, type FormEvent} from 'react';
import {useRouter} from 'next/navigation';

type Props = {action: (form: FormData) => Promise<void>; children: ReactNode; className?: string; label: string; successMessage?: string};

export default function SaveForm({action, children, className, label, successMessage = 'Opgeslagen. Je wijziging staat op de website.'}: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const locked = useRef(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const form = new FormData(event.currentTarget);
    locked.current = true;
    setBusy(true);
    setFailed(false);
    setMessage('Bezig met opslaan…');
    try {
      await action(form);
      setMessage(successMessage);
      router.refresh();
    } catch {
      setFailed(true);
      setMessage('Opslaan is niet gelukt. Je invoer staat er nog. Controleer de gegevens en je verbinding en probeer opnieuw.');
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  return <form className={className} aria-label={label} aria-busy={busy} onSubmit={submit}>
    <fieldset className="cms-save-fields" disabled={busy}>{children}</fieldset>
    {message && <p className={`cms-save-message${failed ? ' is-error' : ''}`} role={failed ? 'alert' : 'status'}>{message}</p>}
  </form>;
}

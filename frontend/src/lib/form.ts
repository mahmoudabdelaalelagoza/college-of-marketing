import { requireSupabase, supabaseError } from './supabase';

export interface FormResult {
  ok: boolean;
  message: string;
}

export async function submitMarketingForm(
  form: HTMLFormElement,
  submitPath: string,
): Promise<FormResult> {
  const formData = new FormData(form);

  const honeypotFields = ['website_alt', 'phone_alt'];
  const hasHoneypotValue = honeypotFields.some((field) =>
    String(formData.get(field) ?? '').trim().length > 0,
  );

  if (hasHoneypotValue) {
    return { ok: true, message: '' };
  }

  honeypotFields.forEach((field) => formData.delete(field));

  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string' && value.length > 0) {
      payload[key] = value.trim();
    }
  });

  try {
    if (submitPath.includes('newsletter')) return submitNewsletter(payload);
    return submitLead(payload);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'We could not send that just now. Please try again.' };
  }
}

async function submitLead(payload: Record<string, string>): Promise<FormResult> {
  const client = requireSupabase();
  const email = payload.email || '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  const { error } = await client.from('lead_submissions').insert({
    name: payload.name || payload.full_name || 'Website visitor',
    email,
    organisation: payload.organisation || payload.company || null,
    interest: payload.interest || payload.programme || null,
    message: payload.message || payload.notes || null,
    source: payload.source || 'website',
  });

  if (error) return { ok: false, message: supabaseError(error, 'We could not send that just now. Please try again.') };
  return { ok: true, message: '' };
}

async function submitNewsletter(payload: Record<string, string>): Promise<FormResult> {
  const client = requireSupabase();
  const email = payload.email || '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  const { error } = await client.from('newsletter_subscriptions').upsert({
    email,
    source: payload.source || 'website-newsletter',
  }, { onConflict: 'email' });

  if (error) return { ok: false, message: supabaseError(error, 'We could not subscribe that email just now.') };
  return { ok: true, message: '' };
}

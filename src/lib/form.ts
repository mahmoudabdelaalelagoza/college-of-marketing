export interface FormResult {
  ok: boolean;
  message: string;
}

/**
 * Submits a marketing form to an internal API route.
 * Neon credentials must stay on the server, so the browser only posts to `/api/*`.
 * In local Vite development, where serverless API routes are not running, entries
 * are queued in localStorage so the UI can still be tested before Neon is connected.
 */
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
    // Looks like a bot: give the same generic feedback, but send nothing.
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
    const response = await fetch(submitPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true, message: '' };
    }

    if (shouldQueueLocally(response.status)) {
      queueLocally(submitPath, payload);
      return { ok: true, message: '' };
    }

    const responseText = await response.text();
    return { ok: false, message: responseText || 'We could not send that just now. Please try again.' };
  } catch {
    if (isLocalHost()) {
      queueLocally(submitPath, payload);
      return { ok: true, message: '' };
    }

    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
}

function shouldQueueLocally(status: number): boolean {
  return isLocalHost() && (status === 404 || status === 503 || status === 501);
}

function isLocalHost(): boolean {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function queueLocally(submitPath: string, payload: Record<string, string>): void {
  const key = 'kbc:pending-form-submissions';
  const existing = window.localStorage.getItem(key);
  const submissions = existing ? JSON.parse(existing) as unknown[] : [];
  submissions.push({
    submitPath,
    payload,
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(key, JSON.stringify(submissions));
}

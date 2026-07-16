import 'server-only';

type HandleHunterDbAction = 'create_search' | 'create_order' | 'mark_webhook_sent';

export async function callHandleHunterDb<T>(
  action: HandleHunterDbAction,
  payload: Record<string, unknown>,
): Promise<T> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const internalKey = process.env.HANDLEHUNTER_INTERNAL_KEY;

  if (!supabaseUrl || !internalKey) {
    throw new Error('HandleHunter database gateway is not configured');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/handlehunter-db`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-handlehunter-key': internalKey,
    },
    body: JSON.stringify({ action, payload }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HandleHunter database gateway returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

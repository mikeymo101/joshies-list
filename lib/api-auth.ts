import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `jl_${crypto.randomBytes(32).toString('hex')}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const prefix = key.slice(0, 10);
  return { key, hash, prefix };
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function validateApiKey(request: Request): Promise<{ valid: boolean; contractorId: string | null }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer jl_')) {
    return { valid: false, contractorId: null };
  }

  const key = authHeader.slice(7); // Remove "Bearer "
  const hash = hashApiKey(key);

  const admin = createAdminClient();
  const { data: apiKey } = await admin
    .from('api_keys')
    .select('contractor_id, is_active')
    .eq('key_hash', hash)
    .single();

  if (!apiKey || !apiKey.is_active) {
    return { valid: false, contractorId: null };
  }

  // Update last used
  await admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', hash);

  return { valid: true, contractorId: apiKey.contractor_id };
}

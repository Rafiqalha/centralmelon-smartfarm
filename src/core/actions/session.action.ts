'use server';

import { cookies } from 'next/headers';
import { decrypt, SessionPayload } from '@/lib/auth';

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null;
    return await decrypt(sessionCookie);
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

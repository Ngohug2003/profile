import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  if (isSupabaseConfigured) {
    try {
      const dbStart = Date.now();
      const { error } = await supabase.from('projects').select('id').limit(1);
      if (!error) {
        dbLatencyMs = Date.now() - dbStart;
        dbStatus = 'healthy';
      } else {
        dbStatus = 'unhealthy';
      }
    } catch {
      dbStatus = 'unhealthy';
    }
  } else {
    dbStatus = 'not_configured';
  }

  const isHealthy = dbStatus === 'healthy' || dbStatus === 'not_configured';
  const totalDurationMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        provider: 'Supabase Cloud',
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      responseTimeMs: totalDurationMs,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

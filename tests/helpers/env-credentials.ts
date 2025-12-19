import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface RealCredentials {
  agent700AppPasswordApi: {
    baseUrl?: string;
    appPassword?: string;
  };
  n8nApi?: {
    apiKey?: string;
    baseUrl?: string;
  };
}

export function getRealCredentials(): RealCredentials | null {
  // Check if .env variables are available
  const hasEnvVars = process.env.APP_Password || process.env.APP_PASSWORD;
  
  if (!hasEnvVars) {
    return null; // Fall back to mocked credentials
  }

  return {
    agent700AppPasswordApi: {
      baseUrl: process.env.API_BASE_URL || process.env.BASE_URL || 'https://api.agent700.ai',
      appPassword: (process.env.APP_Password || process.env.APP_PASSWORD)?.replace(/^"|"$/g, ''), // Remove quotes
    },
    n8nApi: {
      apiKey: process.env.N8N_API_KEY,
      baseUrl: process.env.N8N_API_BASE_URL || 'http://localhost:5678',
    },
  };
}

export function hasRealCredentials(): boolean {
  return getRealCredentials() !== null;
}


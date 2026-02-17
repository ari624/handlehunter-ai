import { ResultItem } from './types';

export function normalizeToHandle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function generateCandidates(baseName: string): string[] {
  return [
    baseName,
    `get${baseName}`,
    `try${baseName}`,
    `${baseName}hq`,
    `the${baseName}`,
    `${baseName}app`,
  ];
}

export function generateMockSocialResults(baseName: string): ResultItem[] {
  const platforms = [
    { platform: 'instagram', prefix: '@' },
    { platform: 'tiktok', prefix: '@' },
    { platform: 'x', prefix: '@' },
    { platform: 'youtube', prefix: '@' },
  ];

  return platforms.map((p) => ({
    type: 'social' as const,
    name: `${p.prefix}${baseName}`,
    platform: p.platform,
    // TODO: REAL_API — Replace with actual social handle availability checking
    available: Math.random() > 0.4,
    competition: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
    notes: null,
    owned: false,
    selected: false,
  }));
}

export async function checkDomainAvailability(
  domain: string,
  apiKey: string
): Promise<boolean | null> {
  try {
    const res = await fetch(
      `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}&credits=DA`
    );
    const data = await res.json();
    return data?.DomainInfo?.domainAvailability === 'AVAILABLE';
  } catch {
    return null;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { normalizeToHandle, generateCandidates, generateMockSocialResults, checkDomainAvailability } from '@/lib/search';
import { ResultItem } from '@/lib/types';
import { callHandleHunterDb } from '@/lib/handlehunter-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandName, tlds, socials } = body;

    if (!brandName || typeof brandName !== 'string') {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const baseName = normalizeToHandle(brandName);
    if (!baseName) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const candidates = generateCandidates(baseName);
    const selectedTlds: string[] = tlds || ['.com', '.ai', '.io', '.co'];
    const selectedSocials: string[] = socials || ['instagram', 'tiktok', 'x', 'youtube'];

    const results: ResultItem[] = [];
    const apiKey = process.env.WHOISXML_API_KEY;

    // Check domains
    for (const candidate of candidates) {
      for (const tld of selectedTlds) {
        const domain = `${candidate}${tld}`;
        let available: boolean | null = null;

        if (apiKey) {
          available = await checkDomainAvailability(domain, apiKey);
        } else {
          // Mock mode when no API key
          available = Math.random() > 0.5;
        }

        results.push({
          type: 'domain',
          name: domain,
          platform: tld.replace('.', ''),
          available,
          competition: available === false
            ? (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)]
            : null,
          notes: available === false && Math.random() > 0.7
            ? `Premium domain - est. $${(Math.floor(Math.random() * 50) + 5) * 100}`
            : null,
          owned: false,
          selected: false,
        });
      }
    }

    // Check social handles (mocked for v1)
    if (selectedSocials.length > 0) {
      for (const candidate of candidates) {
        const socialResults = generateMockSocialResults(candidate);
        const filtered = socialResults.filter((r) =>
          selectedSocials.includes(r.platform)
        );
        results.push(...filtered);
      }
    }

    // Save to Supabase
    let searchRecord: { id: string };
    try {
      searchRecord = await callHandleHunterDb<{ id: string }>('create_search', {
        brand_name: brandName,
        domains_checked: selectedTlds,
        socials_checked: selectedSocials,
        results,
      });
    } catch (dbError) {
      console.error('Database gateway error:', dbError);
      // Return results anyway with a temp ID
      return NextResponse.json({
        searchId: `temp-${Date.now()}`,
        brandName,
        results,
      });
    }

    return NextResponse.json({
      searchId: searchRecord.id,
      brandName,
      results,
    });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

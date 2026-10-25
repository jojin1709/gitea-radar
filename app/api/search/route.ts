import { NextRequest, NextResponse } from 'next/server';
import { normalizeRepository } from '../../../crawler/normalization/normalize-repository';
import { classifyRepository } from '../../../crawler/categories/classify-repository';
import { filterRepository } from '../../../crawler/filtering/repository-filter';
import { Repository } from '../../../types/repository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get('q')?.trim() || '';
  const q = rawQ.slice(0, 100);

  if (!q) {
    return NextResponse.json({ repos: [], total: 0 });
  }

  try {
    const baseUrl = (process.env.GITEA_API_URL || 'https://gitea.com').replace(/\/+$/, '');
    const token = process.env.GITEA_TOKEN;
    const url = `${baseUrl}/api/v1/repos/search?q=${encodeURIComponent(q)}&limit=50&sort=stars&order=desc`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'GiteaRadar-LiveSync/1.0',
    };
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ repos: [], total: 0 });
    }

    const json = await res.json();
    const rawList = Array.isArray(json.data) ? json.data : [];

    const repos: Repository[] = [];

    for (const raw of rawList) {
      const check = filterRepository(raw);
      if (!check.allowed) continue;

      const repo = normalizeRepository(raw, null);
      repo.categories = classifyRepository(repo);
      repos.push(repo);
    }

    return NextResponse.json({ repos, total: repos.length });
  } catch (err) {
    console.error('Live search sync error:', err);
    return NextResponse.json({ repos: [], total: 0 });
  }
}

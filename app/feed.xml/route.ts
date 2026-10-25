import { NextResponse } from 'next/server';
import { getTrendingRepositories } from '../../lib/repositories';

export async function GET() {
  const trending = getTrendingRepositories().slice(0, 30);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gitea-radar.vercel.app';
  const now = new Date().toUTCString();

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  };

  const itemsXml = trending
    .map((repo) => {
      const repoUrl = `${siteUrl}/repository/${repo.owner.username}/${repo.name}`;
      const desc = escapeXml(repo.description || `Explore ${repo.fullName} on Gitea Radar.`);
      const title = escapeXml(`${repo.fullName} (★ ${repo.stars.toLocaleString()})`);
      const pubDate = new Date(repo.updatedAt).toUTCString();
      const categoryTag =
        repo.categories && repo.categories.length > 0
          ? `      <category>${escapeXml(repo.categories[0])}</category>`
          : '';

      return `    <item>
      <title>${title}</title>
      <link>${repoUrl}</link>
      <guid isPermaLink="true">${repoUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
${categoryTag}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Gitea Radar — Trending Repositories</title>
    <link>${siteUrl}</link>
    <description>Real-time trending open-source projects discovered across the Gitea ecosystem.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

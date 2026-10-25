import { runCrawler } from '../crawler/index';

async function main() {
  try {
    const result = await runCrawler({
      pageSize: 35,
      pagesPerPass: 3,
      fetchReleasesLimit: 40,
    });
    console.log(`[SUCCESS] Crawler completed successfully with ${result.totalRepositories} repositories.`);
    process.exit(0);
  } catch (error) {
    console.error('[FATAL] Crawler encountered an unrecoverable error:', error);
    process.exit(1);
  }
}

main();

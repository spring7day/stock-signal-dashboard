// Vercel Serverless Function - 종목 검색
// NOTE: 일부 국내 사이트(네이버 등)는 서버리스 환경에서 차단/HTML 응답이 나올 수 있어
// 안정성을 위해 Yahoo Finance 검색을 기본으로 사용합니다.
export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query, market } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });

  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=12&newsCount=0`;
    const yahooRes = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StockSignalDashboard/1.0)'
      }
    });

    // Yahoo가 JSON이 아닌 경우(드물지만) 대비
    const text = await yahooRes.text();
    let yahooData;
    try {
      yahooData = JSON.parse(text);
    } catch {
      throw new Error(`Yahoo returned non-JSON (status ${yahooRes.status})`);
    }

    const quotes = Array.isArray(yahooData?.quotes) ? yahooData.quotes : [];

    let results = quotes
      .filter(q => q && q.symbol)
      .map(q => {
        const sym = q.symbol;
        const isKR = sym.endsWith('.KS') || sym.endsWith('.KQ');
        const inferredMarket = isKR ? 'KR' : 'US';

        return {
          market: inferredMarket,
          symbol: isKR ? sym.replace(/\.(KS|KQ)$/, '') : sym,
          name: q.longname || q.shortname || sym,
          category: q.quoteType || (isKR ? 'KR' : 'US')
        };
      });

    // market 파라미터가 있으면 필터
    if (market === 'KR' || market === 'US') {
      results = results.filter(r => r.market === market);
    }

    // 중복 symbol 제거
    const seen = new Set();
    results = results.filter(r => {
      const key = `${r.market}:${r.symbol}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return res.status(200).json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed', message: error.message });
  }
}

// Vercel Serverless Function - 종목 검색
// - 한글 검색: KRX KIND 기업목록(다운로드 HTML, EUC-KR)을 파싱해서 종목명→코드 검색
// - 영문/티커 검색: Yahoo Finance 검색
import iconv from 'iconv-lite';

let krxCache = null;
let krxCacheLoadedAt = 0;

async function loadKrxList() {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (krxCache && Date.now() - krxCacheLoadedAt < ONE_DAY) return krxCache;

  const url = 'https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13';
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StockSignalDashboard/1.0)',
      'Accept': '*/*'
    }
  });
  const ab = await r.arrayBuffer();
  const decoded = iconv.decode(Buffer.from(ab), 'euc-kr');

  // 매우 단순한 HTML table 파싱 (첫 td=회사명, 세번째 td=종목코드)
  const rows = decoded.split(/<tr>/i).slice(1);
  const list = [];
  for (const row of rows) {
    const tds = row.split(/<td[^>]*>/i).slice(1).map(x => x.split(/<\/td>/i)[0]);
    if (tds.length < 3) continue;
    const name = tds[0].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const code = tds[2].replace(/<[^>]+>/g, '').trim();
    if (!name || !code) continue;
    // 6자리 코드만
    const symbol = code.replace(/[^0-9]/g, '');
    if (symbol.length !== 6) continue;
    list.push({ market: 'KR', symbol, name, category: 'KRX' });
  }

  krxCache = list;
  krxCacheLoadedAt = Date.now();
  return krxCache;
}

function isKorean(text) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query, market } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });

  try {
    let results = [];

    // 1) 한글 검색이면 KRX 목록에서 검색
    if (isKorean(query)) {
      const krx = await loadKrxList();
      const q = query.trim();
      results = results.concat(
        krx.filter(s => s.name.includes(q) || s.symbol.includes(q)).slice(0, 10)
      );
    }

    // 2) Yahoo Finance (영문/티커 검색 강점)
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=12&newsCount=0`;
    const yahooRes = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StockSignalDashboard/1.0)'
      }
    });

    const yText = await yahooRes.text();
    let yahooData;
    try {
      yahooData = JSON.parse(yText);
    } catch {
      throw new Error(`Yahoo returned non-JSON (status ${yahooRes.status})`);
    }

    const quotes = Array.isArray(yahooData?.quotes) ? yahooData.quotes : [];

    results = results.concat(
      quotes
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
        })
    );

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

// Vercel Serverless Function - 종목 검색
export default async function handler(req, res) {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { query, market } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    try {
        let results = [];

        if (market === 'KR' || !market) {
            // 한국 주식 검색 (네이버 금융 API 사용)
            const naverUrl = `https://m.stock.naver.com/api/search/searchListJson?keyword=${encodeURIComponent(query)}`;
            const naverRes = await fetch(naverUrl);
            const naverData = await naverRes.json();

            if (naverData.result && naverData.result.length > 0) {
                results = results.concat(
                    naverData.result.slice(0, 10).map(item => ({
                        market: 'KR',
                        symbol: item.cd,
                        name: item.nm,
                        category: item.tp || '주식'
                    }))
                );
            }
        }

        if (market === 'US' || !market) {
            // 미국 주식 검색 (Yahoo Finance API)
            const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
            const yahooRes = await fetch(yahooUrl);
            const yahooData = await yahooRes.json();

            if (yahooData.quotes && yahooData.quotes.length > 0) {
                results = results.concat(
                    yahooData.quotes.slice(0, 10).map(item => ({
                        market: 'US',
                        symbol: item.symbol,
                        name: item.longname || item.shortname || item.symbol,
                        category: item.quoteType || 'EQUITY'
                    }))
                );
            }
        }

        return res.status(200).json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Search failed', message: error.message });
    }
}

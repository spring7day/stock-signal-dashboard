// Vercel Serverless Function - 주가 데이터
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { symbol, market } = req.query;

    if (!symbol || !market) {
        return res.status(400).json({ error: 'Symbol and market required' });
    }

    try {
        let yahooSymbol = symbol;
        
        // 한국 주식은 .KS 또는 .KQ 추가
        if (market === 'KR') {
            yahooSymbol = symbol + '.KS'; // 기본 KOSPI
        }

        // Yahoo Finance API
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=3mo`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error('No data available');
        }

        const result = data.chart.result[0];
        const quote = result.indicators.quote[0];
        const closes = quote.close.filter(p => p !== null);

        if (closes.length === 0) {
            throw new Error('No price data');
        }

        const currentPrice = closes[closes.length - 1];
        const previousPrice = closes[closes.length - 2] || currentPrice;
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        // --- Forward-looking data (analyst/consensus) ---
        // NOTE: Some tickers/markets may not have analyst coverage on Yahoo.
        let forward = { available: false };
        try {
            const qsUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooSymbol)}?modules=price,recommendationTrend,financialData,earningsTrend`;
            const qsRes = await fetch(qsUrl);
            const qsJson = await qsRes.json();
            const r = qsJson?.quoteSummary?.result?.[0];

            const rec = r?.recommendationTrend?.trend?.[0];
            const fd = r?.financialData;
            const et = r?.earningsTrend?.trend?.[0];
            const price = r?.price;

            const strongBuy = Number(rec?.strongBuy ?? 0);
            const buy = Number(rec?.buy ?? 0);
            const hold = Number(rec?.hold ?? 0);
            const sell = Number(rec?.sell ?? 0);
            const strongSell = Number(rec?.strongSell ?? 0);
            const total = strongBuy + buy + hold + sell + strongSell;

            const analystScore = total > 0
                ? (strongBuy * 1.0 + buy * 0.75 + hold * 0.5 + sell * 0.25 + strongSell * 0.0) / total
                : null;

            const targetMean = fd?.targetMeanPrice?.raw ?? null;
            const upsidePct = (targetMean && currentPrice)
                ? ((targetMean - currentPrice) / currentPrice)
                : null;

            const earningsGrowth = et?.growth?.raw ?? null;

            forward = {
                available: analystScore !== null || targetMean !== null || earningsGrowth !== null,
                analyst: total > 0 ? { strongBuy, buy, hold, sell, strongSell, total, score: analystScore } : null,
                targetMeanPrice: targetMean,
                upsidePct,
                earningsGrowth,
                currency: price?.currency ?? null,
                asOf: Date.now()
            };
        } catch (e) {
            forward = { available: false };
        }

        return res.status(200).json({
            price: currentPrice,
            change,
            changePercent,
            historicalPrices: closes,
            forward,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Stock data error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch stock data', 
            message: error.message 
        });
    }
}

// 실제 API 연동 버전 (script.js를 이 파일로 교체하여 사용)
// Yahoo Finance API 사용 (CORS 우회 프록시 필요)

const PASSWORD_HASH = 'your-password-here';
let stocks = JSON.parse(localStorage.getItem('stocks') || '[]');
let isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

// CORS 프록시 (무료 서비스, 실제 운영 시 자체 프록시 서버 권장)
const CORS_PROXY = 'https://corsproxy.io/?';

window.onload = () => {
    if (isLoggedIn) {
        showDashboard();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
};

function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === PASSWORD_HASH) {
        sessionStorage.setItem('loggedIn', 'true');
        isLoggedIn = true;
        showDashboard();
    } else {
        document.getElementById('error-msg').textContent = '비밀번호가 올바르지 않습니다.';
    }
}

document.getElementById('password-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

function logout() {
    sessionStorage.removeItem('loggedIn');
    location.reload();
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    loadStocks();
    startAutoUpdate();
}

function addStock() {
    const market = document.getElementById('market-select').value;
    const symbol = document.getElementById('symbol-input').value.trim().toUpperCase();
    const name = document.getElementById('name-input').value.trim();

    if (!symbol || !name) {
        alert('종목코드와 종목명을 모두 입력해주세요.');
        return;
    }

    if (stocks.find(s => s.symbol === symbol && s.market === market)) {
        alert('이미 등록된 종목입니다.');
        return;
    }

    stocks.push({ market, symbol, name });
    saveStocks();
    loadStocks();

    document.getElementById('symbol-input').value = '';
    document.getElementById('name-input').value = '';
}

function deleteStock(market, symbol) {
    if (confirm('정말 삭제하시겠습니까?')) {
        stocks = stocks.filter(s => !(s.symbol === symbol && s.market === market));
        saveStocks();
        loadStocks();
    }
}

function saveStocks() {
    localStorage.setItem('stocks', JSON.stringify(stocks));
}

async function loadStocks() {
    const container = document.getElementById('stocks-container');
    
    if (stocks.length === 0) {
        container.innerHTML = '<div class="loading">등록된 종목이 없습니다. 위에서 종목을 추가해주세요.</div>';
        return;
    }

    container.innerHTML = '<div class="loading">데이터를 불러오는 중...</div>';

    const stockCards = await Promise.all(
        stocks.map(stock => createStockCard(stock))
    );

    container.innerHTML = stockCards.join('');
    updateLastUpdateTime();
}

async function createStockCard(stock) {
    try {
        const data = await fetchStockData(stock);
        const signals = calculateSignals(data);
        
        const priceChange = data.change || 0;
        const priceChangePercent = data.changePercent || 0;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeSymbol = priceChange >= 0 ? '▲' : '▼';

        return `
            <div class="stock-card">
                <div class="stock-header">
                    <div class="stock-info">
                        <h3>${stock.name}</h3>
                        <div class="symbol">${stock.market === 'KR' ? '🇰🇷' : '🇺🇸'} ${stock.symbol}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteStock('${stock.market}', '${stock.symbol}')">삭제</button>
                </div>

                <div class="price-info">
                    <div class="current-price">${formatPrice(data.price, stock.market)}</div>
                    <div class="price-change ${changeClass}">
                        ${changeSymbol} ${Math.abs(priceChange).toFixed(2)} (${priceChangePercent.toFixed(2)}%)
                    </div>
                </div>

                <div class="signals">
                    <div class="signal">
                        <div class="signal-label">매수 신호</div>
                        <div class="signal-light ${signals.buy.color}">
                            ${signals.buy.emoji}
                        </div>
                        <div class="signal-score">${signals.buy.score}/100</div>
                    </div>
                    <div class="signal">
                        <div class="signal-label">매도 신호</div>
                        <div class="signal-light ${signals.sell.color}">
                            ${signals.sell.emoji}
                        </div>
                        <div class="signal-score">${signals.sell.score}/100</div>
                    </div>
                </div>

                <div class="indicators">
                    <div class="indicator-row">
                        <span class="indicator-label">RSI (14)</span>
                        <span class="indicator-value" style="color: ${getRSIColor(data.indicators.rsi)}">${data.indicators.rsi.toFixed(2)}</span>
                    </div>
                    <div class="indicator-row">
                        <span class="indicator-label">MACD</span>
                        <span class="indicator-value" style="color: ${data.indicators.macd > 0 ? '#51cf66' : '#ff6b6b'}">${data.indicators.macd.toFixed(2)}</span>
                    </div>
                    <div class="indicator-row">
                        <span class="indicator-label">볼린저밴드</span>
                        <span class="indicator-value">${data.indicators.bollinger}</span>
                    </div>
                    <div class="indicator-row">
                        <span class="indicator-label">20일 이평선</span>
                        <span class="indicator-value" style="color: ${data.price > data.indicators.ma20 ? '#51cf66' : '#ff6b6b'}">${formatPrice(data.indicators.ma20, stock.market)}</span>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(`Error loading ${stock.symbol}:`, error);
        return `
            <div class="stock-card">
                <div class="stock-header">
                    <div class="stock-info">
                        <h3>${stock.name}</h3>
                        <div class="symbol">${stock.market === 'KR' ? '🇰🇷' : '🇺🇸'} ${stock.symbol}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteStock('${stock.market}', '${stock.symbol}')">삭제</button>
                </div>
                <div class="loading" style="color: #ff6b6b;">데이터 로드 실패</div>
            </div>
        `;
    }
}

// 실제 Yahoo Finance 데이터 가져오기
async function fetchStockData(stock) {
    try {
        // 한국 주식은 .KS 또는 .KQ 추가
        let yahooSymbol = stock.symbol;
        if (stock.market === 'KR') {
            // KOSPI는 .KS, KOSDAQ은 .KQ
            yahooSymbol = stock.symbol + '.KS'; // 기본값 KOSPI
        }

        // Yahoo Finance API 엔드포인트
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=3mo`;
        
        const response = await fetch(CORS_PROXY + encodeURIComponent(url));
        const data = await response.json();

        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            throw new Error('데이터를 가져올 수 없습니다');
        }

        const result = data.chart.result[0];
        const quote = result.indicators.quote[0];
        const timestamps = result.timestamp;
        const closes = quote.close.filter(p => p !== null);

        const currentPrice = closes[closes.length - 1];
        const previousPrice = closes[closes.length - 2];
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        // 기술적 지표 계산
        const indicators = {
            rsi: calculateRSI(closes, 14),
            macd: calculateMACD(closes),
            ma20: calculateMA(closes, 20),
            ma50: calculateMA(closes, 50),
            bollinger: getBollingerPosition(closes, currentPrice)
        };

        return {
            price: currentPrice,
            change,
            changePercent,
            historicalPrices: closes,
            indicators
        };

    } catch (error) {
        console.error('API Error:', error);
        // 실패 시 시뮬레이션 데이터로 폴백
        return fetchStockDataSimulation(stock);
    }
}

// 폴백용 시뮬레이션 데이터
function fetchStockDataSimulation(stock) {
    const basePrice = Math.random() * 100000 + 10000;
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const changePercent = (change / basePrice) * 100;
    
    const historicalPrices = generateHistoricalPrices(basePrice, 50);
    
    const indicators = {
        rsi: calculateRSI(historicalPrices, 14),
        macd: calculateMACD(historicalPrices),
        ma20: calculateMA(historicalPrices, 20),
        ma50: calculateMA(historicalPrices, 50),
        bollinger: getBollingerPosition(historicalPrices, basePrice)
    };

    return {
        price: basePrice,
        change,
        changePercent,
        historicalPrices,
        indicators
    };
}

function generateHistoricalPrices(currentPrice, days) {
    const prices = [];
    let price = currentPrice;
    
    for (let i = days; i > 0; i--) {
        price = price * (1 + (Math.random() - 0.5) * 0.03);
        prices.push(price);
    }
    
    return prices;
}

// 기술적 지표 계산 함수들 (동일)
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function calculateMACD(prices) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    return ema12 - ema26;
}

function calculateEMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1];
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
    
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
}

function calculateMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1];
    
    const recentPrices = prices.slice(-period);
    return recentPrices.reduce((a, b) => a + b) / period;
}

function getBollingerPosition(prices, currentPrice) {
    const ma20 = calculateMA(prices, 20);
    const stdDev = calculateStdDev(prices.slice(-20));
    const upperBand = ma20 + (stdDev * 2);
    const lowerBand = ma20 - (stdDev * 2);
    
    if (currentPrice > upperBand) return '상단 돌파';
    if (currentPrice < lowerBand) return '하단 돌파';
    if (currentPrice > ma20) return '상단';
    return '하단';
}

function calculateStdDev(prices) {
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / prices.length;
    return Math.sqrt(variance);
}

function calculateSignals(data) {
    let buyScore = 0;
    let sellScore = 0;

    // RSI 분석
    if (data.indicators.rsi < 30) buyScore += 30;
    else if (data.indicators.rsi < 40) buyScore += 20;
    else if (data.indicators.rsi < 50) buyScore += 10;
    
    if (data.indicators.rsi > 70) sellScore += 30;
    else if (data.indicators.rsi > 60) sellScore += 20;
    else if (data.indicators.rsi > 50) sellScore += 10;

    // MACD 분석
    if (data.indicators.macd > 0) {
        buyScore += 25;
    } else {
        sellScore += 25;
    }

    // 전문가/시장전망(Forward-looking) 분석 (이동평균 점수는 제외)
    const f = data.forward;
    if (f && f.available) {
        const aScore = f.analyst?.score;
        if (typeof aScore === 'number') {
            if (aScore >= 0.70) buyScore += 10;
            else if (aScore >= 0.58) buyScore += 7;
            else if (aScore >= 0.50) buyScore += 4;
            else if (aScore <= 0.35) sellScore += 10;
            else if (aScore <= 0.45) sellScore += 7;
            else sellScore += 4;
        }

        const up = f.upsidePct;
        if (typeof up === 'number') {
            if (up >= 0.20) buyScore += 10;
            else if (up >= 0.10) buyScore += 7;
            else if (up >= 0.03) buyScore += 4;
            else if (up <= -0.10) sellScore += 10;
            else if (up <= -0.03) sellScore += 7;
            else if (up < 0) sellScore += 4;
        }

        const eg = f.earningsGrowth;
        if (typeof eg === 'number') {
            if (eg >= 0.15) buyScore += 5;
            else if (eg >= 0.05) buyScore += 3;
            else if (eg <= -0.10) sellScore += 5;
            else if (eg <= -0.03) sellScore += 3;
        }
    } else {
        buyScore += 12;
        sellScore += 12;
    }

    // 볼린저밴드 분석
    const bollinger = data.indicators.bollinger;
    if (bollinger === '하단 돌파') buyScore += 20;
    else if (bollinger === '하단') buyScore += 10;
    else if (bollinger === '상단 돌파') sellScore += 20;
    else if (bollinger === '상단') sellScore += 10;

    buyScore = Math.min(100, buyScore);
    sellScore = Math.min(100, sellScore);

    return {
        buy: {
            score: buyScore,
            color: buyScore >= 70 ? 'green' : buyScore >= 40 ? 'yellow' : 'red',
            emoji: buyScore >= 70 ? '🟢' : buyScore >= 40 ? '🟡' : '🔴'
        },
        sell: {
            score: sellScore,
            color: sellScore >= 70 ? 'green' : sellScore >= 40 ? 'yellow' : 'red',
            emoji: sellScore >= 70 ? '🟢' : sellScore >= 40 ? '🟡' : '🔴'
        }
    };
}

function formatPrice(price, market) {
    if (market === 'KR') {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(price);
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }
}

function getRSIColor(rsi) {
    if (rsi < 30) return '#51cf66';
    if (rsi > 70) return '#ff6b6b';
    return '#ffd43b';
}

function updateLastUpdateTime() {
    const now = new Date();
    document.getElementById('last-update').textContent = 
        `마지막 업데이트: ${now.toLocaleTimeString('ko-KR')}`;
}

function startAutoUpdate() {
    setInterval(() => {
        if (isLoggedIn) {
            loadStocks();
        }
    }, 5 * 60 * 1000);
}

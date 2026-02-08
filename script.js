// 비밀번호 (SHA-256 해시로 저장 권장, 여기서는 간단히 처리)
const PASSWORD_HASH = 'jh170715@'; // 이 값을 원하는 비밀번호로 변경하세요

// 저장된 종목 목록
let stocks = JSON.parse(localStorage.getItem('stocks') || '[]');
let isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

// 초기화
window.onload = () => {
    if (isLoggedIn) {
        showDashboard();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
};

// 로그인 체크
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

// Enter 키로 로그인
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

// 종목 추가
function addStock() {
    const market = document.getElementById('market-select').value;
    const symbol = document.getElementById('symbol-input').value.trim().toUpperCase();
    const name = document.getElementById('name-input').value.trim();

    if (!symbol || !name) {
        alert('종목코드와 종목명을 모두 입력해주세요.');
        return;
    }

    // 중복 체크
    if (stocks.find(s => s.symbol === symbol && s.market === market)) {
        alert('이미 등록된 종목입니다.');
        return;
    }

    stocks.push({ market, symbol, name });
    saveStocks();
    loadStocks();

    // 입력 필드 초기화
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

// 종목 로드 및 표시
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

// 주식 카드 생성
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

// 주식 데이터 가져오기
async function fetchStockData(stock) {
    // 실제 구현에서는 Yahoo Finance API, Alpha Vantage 등 사용
    // 여기서는 시뮬레이션 데이터 생성
    
    const basePrice = Math.random() * 100000 + 10000;
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const changePercent = (change / basePrice) * 100;
    
    // 과거 가격 데이터 시뮬레이션 (실제로는 API에서 가져옴)
    const historicalPrices = generateHistoricalPrices(basePrice, 50);
    
    // 기술적 지표 계산
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

// 과거 가격 데이터 생성 (시뮬레이션)
function generateHistoricalPrices(currentPrice, days) {
    const prices = [];
    let price = currentPrice;
    
    for (let i = days; i > 0; i--) {
        price = price * (1 + (Math.random() - 0.5) * 0.03);
        prices.push(price);
    }
    
    return prices;
}

// RSI 계산
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

// MACD 계산
function calculateMACD(prices) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    return ema12 - ema26;
}

// EMA 계산
function calculateEMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1];
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
    
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
}

// 이동평균 계산
function calculateMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1];
    
    const recentPrices = prices.slice(-period);
    return recentPrices.reduce((a, b) => a + b) / period;
}

// 볼린저밴드 위치
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

// 표준편차 계산
function calculateStdDev(prices) {
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / prices.length;
    return Math.sqrt(variance);
}

// 신호등 계산 (전문가 분석)
function calculateSignals(data) {
    let buyScore = 0;
    let sellScore = 0;

    // 1. RSI 분석 (30점 배점)
    if (data.indicators.rsi < 30) buyScore += 30;
    else if (data.indicators.rsi < 40) buyScore += 20;
    else if (data.indicators.rsi < 50) buyScore += 10;
    
    if (data.indicators.rsi > 70) sellScore += 30;
    else if (data.indicators.rsi > 60) sellScore += 20;
    else if (data.indicators.rsi > 50) sellScore += 10;

    // 2. MACD 분석 (25점 배점)
    if (data.indicators.macd > 0) {
        buyScore += 25;
    } else {
        sellScore += 25;
    }

    // 3. 이동평균 분석 (25점 배점)
    const price = data.price;
    const ma20 = data.indicators.ma20;
    const ma50 = data.indicators.ma50;

    if (price > ma20 && price > ma50) buyScore += 25;
    else if (price > ma20) buyScore += 15;
    else if (price < ma20 && price < ma50) sellScore += 25;
    else if (price < ma20) sellScore += 15;

    // 4. 볼린저밴드 분석 (20점 배점)
    const bollinger = data.indicators.bollinger;
    if (bollinger === '하단 돌파') buyScore += 20;
    else if (bollinger === '하단') buyScore += 10;
    else if (bollinger === '상단 돌파') sellScore += 20;
    else if (bollinger === '상단') sellScore += 10;

    // 점수 정규화
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

// 헬퍼 함수들
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

// 자동 업데이트 (5분마다)
function startAutoUpdate() {
    setInterval(() => {
        if (isLoggedIn) {
            loadStocks();
        }
    }, 5 * 60 * 1000); // 5분
}

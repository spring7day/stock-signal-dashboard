// 주요 종목 데이터베이스
const STOCK_DATABASE = [
    // 한국 주식 - 코스피
    { market: 'KR', symbol: '005930', name: '삼성전자', category: '반도체' },
    { market: 'KR', symbol: '000660', name: 'SK하이닉스', category: '반도체' },
    { market: 'KR', symbol: '035420', name: 'NAVER', category: '인터넷' },
    { market: 'KR', symbol: '035720', name: '카카오', category: '인터넷' },
    { market: 'KR', symbol: '005380', name: '현대차', category: '자동차' },
    { market: 'KR', symbol: '000270', name: '기아', category: '자동차' },
    { market: 'KR', symbol: '051910', name: 'LG화학', category: '화학' },
    { market: 'KR', symbol: '006400', name: '삼성SDI', category: '전지' },
    { market: 'KR', symbol: '207940', name: '삼성바이오로직스', category: '바이오' },
    { market: 'KR', symbol: '005490', name: 'POSCO홀딩스', category: '철강' },
    { market: 'KR', symbol: '068270', name: '셀트리온', category: '바이오' },
    { market: 'KR', symbol: '028260', name: '삼성물산', category: '건설' },
    { market: 'KR', symbol: '012330', name: '현대모비스', category: '자동차부품' },
    { market: 'KR', symbol: '066570', name: 'LG전자', category: '가전' },
    { market: 'KR', symbol: '003550', name: 'LG', category: '지주회사' },
    { market: 'KR', symbol: '017670', name: 'SK텔레콤', category: '통신' },
    { market: 'KR', symbol: '032830', name: '삼성생명', category: '보험' },
    { market: 'KR', symbol: '003670', name: '포스코퓨처엠', category: '2차전지소재' },
    { market: 'KR', symbol: '096770', name: 'SK이노베이션', category: '정유화학' },
    { market: 'KR', symbol: '034730', name: 'SK', category: '지주회사' },
    { market: 'KR', symbol: '018260', name: '삼성에스디에스', category: 'IT서비스' },
    { market: 'KR', symbol: '015760', name: '한국전력', category: '전기' },
    { market: 'KR', symbol: '009150', name: '삼성전기', category: '전자부품' },
    { market: 'KR', symbol: '033780', name: 'KT&G', category: '음식료' },
    { market: 'KR', symbol: '010950', name: 'S-Oil', category: '정유화학' },
    { market: 'KR', symbol: '259960', name: '크래프톤', category: '게임' },
    { market: 'KR', symbol: '352820', name: '하이브', category: '엔터테인먼트' },
    { market: 'KR', symbol: '036570', name: '엔씨소프트', category: '게임' },
    { market: 'KR', symbol: '251270', name: '넷마블', category: '게임' },
    { market: 'KR', symbol: '373220', name: 'LG에너지솔루션', category: '2차전지' },
    
    // 미국 주식
    { market: 'US', symbol: 'AAPL', name: 'Apple', category: '테크' },
    { market: 'US', symbol: 'MSFT', name: 'Microsoft', category: '테크' },
    { market: 'US', symbol: 'GOOGL', name: 'Alphabet (Google)', category: '테크' },
    { market: 'US', symbol: 'AMZN', name: 'Amazon', category: '이커머스' },
    { market: 'US', symbol: 'NVDA', name: 'NVIDIA', category: '반도체' },
    { market: 'US', symbol: 'TSLA', name: 'Tesla', category: '전기차' },
    { market: 'US', symbol: 'META', name: 'Meta (Facebook)', category: '소셜미디어' },
    { market: 'US', symbol: 'NFLX', name: 'Netflix', category: 'OTT' },
    { market: 'US', symbol: 'AMD', name: 'AMD', category: '반도체' },
    { market: 'US', symbol: 'INTC', name: 'Intel', category: '반도체' },
    { market: 'US', symbol: 'JPM', name: 'JPMorgan Chase', category: '은행' },
    { market: 'US', symbol: 'V', name: 'Visa', category: '결제' },
    { market: 'US', symbol: 'MA', name: 'Mastercard', category: '결제' },
    { market: 'US', symbol: 'DIS', name: 'Disney', category: '엔터테인먼트' },
    { market: 'US', symbol: 'NKE', name: 'Nike', category: '의류' },
    { market: 'US', symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'ETF' },
    { market: 'US', symbol: 'QQQ', name: 'Invesco QQQ (나스닥100)', category: 'ETF' },
    { market: 'US', symbol: 'VOO', name: 'Vanguard S&P 500', category: 'ETF' },
];

// 검색 함수
function searchStocks(query) {
    if (!query || query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return STOCK_DATABASE.filter(stock => {
        return stock.name.toLowerCase().includes(lowerQuery) ||
               stock.symbol.toLowerCase().includes(lowerQuery) ||
               stock.category.toLowerCase().includes(lowerQuery);
    }).slice(0, 10);
}

// 비밀번호 (SHA-256 해시로 저장 권장, 여기서는 간단히 처리)
const PASSWORD_HASH = 'jh170715@'; // 이 값을 원하는 비밀번호로 변경하세요

// 저장된 종목 목록
let stocks = JSON.parse(localStorage.getItem('stocks') || '[]');
let isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
let recommendedStocks = []; // 스캔해서 찾은 추천 종목 (매수 신호 초록)
let isScanning = false;

// 추천 종목 풀 (KOSPI 상위 + US 주요)
const RECOMMENDED_POOL = [
    // KOSPI 시총 상위
    { market: 'KR', symbol: '005930', name: '삼성전자' },
    { market: 'KR', symbol: '000660', name: 'SK하이닉스' },
    { market: 'KR', symbol: '207940', name: '삼성바이오로직스' },
    { market: 'KR', symbol: '373220', name: 'LG에너지솔루션' },
    { market: 'KR', symbol: '005380', name: '현대차' },
    { market: 'KR', symbol: '068270', name: '셀트리온' },
    { market: 'KR', symbol: '000270', name: '기아' },
    { market: 'KR', symbol: '035420', name: 'NAVER' },
    { market: 'KR', symbol: '051910', name: 'LG화학' },
    { market: 'KR', symbol: '006400', name: '삼성SDI' },
    { market: 'KR', symbol: '105560', name: 'KB금융' },
    { market: 'KR', symbol: '055550', name: '신한지주' },
    { market: 'KR', symbol: '012330', name: '현대모비스' },
    { market: 'KR', symbol: '005490', name: 'POSCO홀딩스' },
    { market: 'KR', symbol: '035720', name: '카카오' },
    { market: 'KR', symbol: '066570', name: 'LG전자' },
    { market: 'KR', symbol: '086790', name: '하나금융지주' },
    { market: 'KR', symbol: '259960', name: '크래프톤' },
    { market: 'KR', symbol: '034730', name: 'SK' },
    { market: 'KR', symbol: '012450', name: '한화에어로스페이스' },
    { market: 'KR', symbol: '017670', name: 'SK텔레콤' },
    { market: 'KR', symbol: '028260', name: '삼성물산' },
    { market: 'KR', symbol: '009830', name: '한화솔루션' },
    { market: 'KR', symbol: '032830', name: '삼성생명' },
    { market: 'KR', symbol: '003490', name: '대한항공' },
    { market: 'KR', symbol: '018260', name: '삼성에스디에스' },
    
    // 미국 주요 종목
    { market: 'US', symbol: 'AAPL', name: 'Apple' },
    { market: 'US', symbol: 'MSFT', name: 'Microsoft' },
    { market: 'US', symbol: 'GOOGL', name: 'Alphabet' },
    { market: 'US', symbol: 'AMZN', name: 'Amazon' },
    { market: 'US', symbol: 'NVDA', name: 'NVIDIA' },
    { market: 'US', symbol: 'META', name: 'Meta' },
    { market: 'US', symbol: 'TSLA', name: 'Tesla' },
    { market: 'US', symbol: 'BRK-B', name: 'Berkshire Hathaway' },
    { market: 'US', symbol: 'V', name: 'Visa' },
    { market: 'US', symbol: 'JNJ', name: 'Johnson & Johnson' },
    { market: 'US', symbol: 'WMT', name: 'Walmart' },
    { market: 'US', symbol: 'JPM', name: 'JPMorgan Chase' },
    { market: 'US', symbol: 'MA', name: 'Mastercard' },
    { market: 'US', symbol: 'PG', name: 'Procter & Gamble' },
    { market: 'US', symbol: 'UNH', name: 'UnitedHealth' },
    { market: 'US', symbol: 'HD', name: 'Home Depot' },
    { market: 'US', symbol: 'BAC', name: 'Bank of America' },
    { market: 'US', symbol: 'ABBV', name: 'AbbVie' },
    { market: 'US', symbol: 'KO', name: 'Coca-Cola' },
    { market: 'US', symbol: 'AVGO', name: 'Broadcom' },
    { market: 'US', symbol: 'PEP', name: 'PepsiCo' },
    { market: 'US', symbol: 'COST', name: 'Costco' },
    { market: 'US', symbol: 'MRK', name: 'Merck' },
    { market: 'US', symbol: 'TMO', name: 'Thermo Fisher' },
    { market: 'US', symbol: 'DIS', name: 'Disney' },
    { market: 'US', symbol: 'CSCO', name: 'Cisco' },
    { market: 'US', symbol: 'ADBE', name: 'Adobe' },
    { market: 'US', symbol: 'NFLX', name: 'Netflix' },
    { market: 'US', symbol: 'AMD', name: 'AMD' },
    { market: 'US', symbol: 'INTC', name: 'Intel' }
];

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

    // 간단보기 모드 복원
    const compact = localStorage.getItem('compactMode') === 'true';
    document.body.classList.toggle('compact', compact);
    updateCompactToggleLabel();

    loadStocks();
    startAutoUpdate();
    initializeSearch();
    
    // 추천 종목 스캔 시작 (백그라운드)
    scanRecommendedStocks();
}

function toggleCompactMode() {
    const next = !document.body.classList.contains('compact');
    document.body.classList.toggle('compact', next);
    localStorage.setItem('compactMode', String(next));
    updateCompactToggleLabel();
}

function updateCompactToggleLabel() {
    const btn = document.getElementById('compact-toggle');
    if (!btn) return;
    // 아이콘 토글: 간단보기=그리드, 자세히=리스트 느낌
    btn.textContent = document.body.classList.contains('compact') ? '▤' : '▦';
    btn.title = document.body.classList.contains('compact') ? '자세히 보기' : '간단보기';
}

function refreshAll() {
    const btn = document.getElementById('refresh-btn');
    if (btn) {
        btn.style.animation = 'spin 0.6s ease-in-out';
        setTimeout(() => { btn.style.animation = ''; }, 600);
    }
    loadStocks();
    scanRecommendedStocks();
}

// 카드 클릭(간단보기: 개별 확장/축소)
function setupCardInteractions() {
    const container = document.getElementById('stocks-container');
    if (!container) return;

    // 중복 바인딩 방지
    if (container.__boundInteractions) return;
    container.__boundInteractions = true;

    // 1) 간단보기에서 카드 클릭 시 상세 토글
    container.addEventListener('click', (e) => {
        if (!document.body.classList.contains('compact')) return;
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) return;

        const card = e.target.closest('.stock-card');
        if (!card) return;
        card.classList.toggle('expanded');
    });

}

// 검색 기능 초기화
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
    
    // 검색 결과 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            document.getElementById('search-results').classList.add('hidden');
        }
    });
}

// API 기반 검색 (실제 종목 검색)
// 실제 데이터만 사용 (시뮬레이션 완전 제거됨)

async function handleSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (!query || query.length < 1) {
        resultsContainer.classList.add('hidden');
        return;
    }

    resultsContainer.innerHTML = '<div class="search-no-results">검색 중...</div>';
    resultsContainer.classList.remove('hidden');

    let results = [];

    // 실제 API 사용
    try {
        const apiBase = window.location.hostname.includes('vercel.app') 
            ? '' 
            : 'https://stock-signal-dashboard-chi.vercel.app';
        
        const response = await fetch(`${apiBase}/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        results = data.results || [];
    } catch (error) {
        console.error('API search failed:', error);
        resultsContainer.innerHTML = '<div class="search-no-results">❌ 검색 API 오류</div>';
        return;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">검색 결과가 없습니다</div>';
        return;
    }

    const resultsHTML = results.map(stock => `
        <div class="search-result-item" onclick="selectStock('${stock.market}', '${stock.symbol}', '${stock.name.replace(/'/g, "\\'")}', '${String(stock.category || '').replace(/'/g, "\\'")}')">
            <div class="search-result-main">
                <span class="search-result-name">${stock.name}</span>
                <span class="search-result-symbol">${stock.symbol}</span>
            </div>
            <div class="search-result-info">
                <span class="search-result-market">${stock.market === 'KR' ? '🇰🇷 한국' : '🇺🇸 미국'}</span>
                <span class="search-result-category">${stock.category}</span>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = resultsHTML;
}

// 종목 선택
function selectStock(market, symbol, name, category) {
    // 중복 체크
    if (stocks.find(s => s.symbol === symbol && s.market === market)) {
        alert('이미 등록된 종목입니다.');
        return;
    }

    stocks.unshift({ market, symbol, name, category });
    saveStocks();
    loadStocks();

    // 입력 필드 초기화
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').classList.add('hidden');
}

// 종목 추가 (기존 함수, 하위 호환용)
function addStock() {
    // 검색 방식으로 변경되어 사용 안 함
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
    setupCardInteractions();
}

// 주식 카드 생성
async function createStockCard(stock) {
    try {
        const data = await fetchStockData(stock);
        // 국내 종목 등 애널리스트 커버리지가 약한 경우를 대비해 시장/업황 컨텍스트 보강
        await attachMarketContextIfNeeded(data, stock);
        const signals = calculateSignals(data);
        
        const priceChange = data.change || 0;
        const priceChangePercent = data.changePercent || 0;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const changeSymbol = priceChange >= 0 ? '▲' : '▼';

        return `
            <div class="stock-card" data-market="${stock.market}" data-symbol="${stock.symbol}" data-name="${stock.name.replace(/\"/g, '&quot;')}" data-buy-color="${signals.buy.color}">
                <div class="stock-header">
                    <div class="stock-info">
                        <h3>${stock.name} <span style="font-size:0.7rem;color:#51cf66;">✓실제</span></h3>
                        <div class="symbol">${stock.market === 'KR' ? '🇰🇷' : '🇺🇸'} ${stock.symbol}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteStock('${stock.market}', '${stock.symbol}')" title="삭제" aria-label="삭제">✕</button>
                </div>

                <div class="price-info">
                    <div class="current-price">${formatPrice(data.price, stock.market)}</div>
                    <div class="price-change ${changeClass}">
                        ${changeSymbol} ${Math.abs(priceChange).toFixed(2)} (${priceChangePercent.toFixed(2)}%)
                    </div>
                </div>

                <div class="signals">
                    <div class="signal">
                        <div class="signal-label">매수</div>
                        <div class="signal-light ${signals.buy.color}">
                            ${signals.buy.emoji}
                        </div>
                        <div class="signal-score">${signals.buy.score}/100</div>
                    </div>
                    <div class="signal">
                        <div class="signal-label">매도</div>
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
        console.error(`❌ API 오류 [${stock.symbol}]:`, error);
        return `
            <div class="stock-card">
                <div class="stock-header">
                    <div class="stock-info">
                        <h3>${stock.name}</h3>
                        <div class="symbol">${stock.market === 'KR' ? '🇰🇷' : '🇺🇸'} ${stock.symbol}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteStock('${stock.market}', '${stock.symbol}')" title="삭제" aria-label="삭제">✕</button>
                </div>
                <div class="loading" style="color: #ff6b6b;padding:1rem;">
                    ❌ 실제 데이터 로드 실패<br>
                    <small style="font-size:0.8rem;color:#888;">API 오류 또는 종목코드 확인 필요</small>
                </div>
            </div>
        `;
    }
}

// 주식 데이터 가져오기
async function fetchStockData(stock) {
    const apiBase = window.location.hostname.includes('vercel.app') 
        ? '' 
        : 'https://stock-signal-dashboard-chi.vercel.app';
    
    const response = await fetch(`${apiBase}/api/stock?symbol=${stock.symbol}&market=${stock.market}`);
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }

    const historicalPrices = data.historicalPrices;
    
    // 기술적 지표 계산
    const indicators = {
        rsi: calculateRSI(historicalPrices, 14),
        macd: calculateMACD(historicalPrices),
        ma20: calculateMA(historicalPrices, 20),
        ma50: calculateMA(historicalPrices, 50),
        bollinger: getBollingerPosition(historicalPrices, data.price)
    };

    return {
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        historicalPrices,
        indicators,
        forward: data.forward,
        isRealData: true
    };
}

// -------------------------------
// 시장/업황 컨텍스트(Forward-looking 대체)
// - 국내 종목은 애널리스트/목표주가 데이터가 비는 경우가 많아
//   "시장 동향 + 업종 시황(프록시 ETF/지수)"로 신호등 점수를 보강합니다.
// -------------------------------

const __contextCache = new Map();

function lookupCategoryFallback(stock) {
    // 저장된 종목에 category가 없을 수 있어, 내장 DB에서 보정
    const found = STOCK_DATABASE?.find(s => s.market === stock.market && s.symbol === stock.symbol);
    return stock.category || found?.category || '';
}

function getProxyByCategory(category) {
    const c = (category || '').toLowerCase();

    // 업종/테마별 "시황 프록시" (Yahoo 티커)
    // KR 종목도 글로벌 업황 영향을 많이 받는 업종은 US ETF로 근사
    if (c.includes('반도체') || c.includes('semiconductor')) return { symbol: 'SOXX', market: 'US', name: 'Semiconductor (SOXX)' };
    if (c.includes('인터넷') || c.includes('it') || c.includes('테크') || c.includes('software')) return { symbol: 'QQQ', market: 'US', name: 'Nasdaq100 (QQQ)' };
    if (c.includes('자동차')) return { symbol: 'CARZ', market: 'US', name: 'Auto (CARZ)' };
    if (c.includes('바이오') || c.includes('헬스') || c.includes('health')) return { symbol: 'XBI', market: 'US', name: 'Biotech (XBI)' };
    if (c.includes('2차전지') || c.includes('전지') || c.includes('battery')) return { symbol: 'LIT', market: 'US', name: 'Lithium & Battery (LIT)' };
    if (c.includes('정유') || c.includes('에너지') || c.includes('oil')) return { symbol: 'XLE', market: 'US', name: 'Energy (XLE)' };
    if (c.includes('은행') || c.includes('보험') || c.includes('금융') || c.includes('financial')) return { symbol: 'XLF', market: 'US', name: 'Financials (XLF)' };
    if (c.includes('철강') || c.includes('소재') || c.includes('materials')) return { symbol: 'XLB', market: 'US', name: 'Materials (XLB)' };
    if (c.includes('통신') || c.includes('telecom')) return { symbol: 'IYZ', market: 'US', name: 'Telecom (IYZ)' };
    if (c.includes('가전') || c.includes('소비재') || c.includes('consumer')) return { symbol: 'XLY', market: 'US', name: 'Consumer Discretionary (XLY)' };
    if (c.includes('게임') || c.includes('엔터') || c.includes('media')) return { symbol: 'ESPO', market: 'US', name: 'Video Games/Esports (ESPO)' };

    return null;
}

function calcReturnFromPrices(prices, lookback = 20) {
    if (!Array.isArray(prices) || prices.length < 5) return null;
    const n = Math.min(prices.length - 1, lookback);
    const start = prices[prices.length - 1 - n];
    const end = prices[prices.length - 1];
    if (!start || !end) return null;
    return (end - start) / start;
}

async function fetchSeriesCached(symbol, market) {
    const key = `${market}:${symbol}`;
    if (__contextCache.has(key)) return __contextCache.get(key);

    const p = (async () => {
        const apiBase = window.location.hostname.includes('vercel.app') ? '' : 'https://stock-signal-dashboard-chi.vercel.app';
        const r = await fetch(`${apiBase}/api/stock?symbol=${encodeURIComponent(symbol)}&market=${encodeURIComponent(market)}`);
        const j = await r.json();
        if (j.error) throw new Error(j.error);
        return j.historicalPrices;
    })();

    __contextCache.set(key, p);
    return p;
}

async function attachMarketContextIfNeeded(data, stock) {
    // 이미 forward(애널리스트/목표주가 등)가 있으면 추가 보강 불필요
    if (data?.forward?.available) return;

    const category = lookupCategoryFallback(stock);

    // 1) 시장(코스피) 모멘텀
    // Yahoo: KOSPI Composite = ^KS11
    let marketRet = null;
    try {
        const kospi = await fetchSeriesCached('^KS11', 'US');
        marketRet = calcReturnFromPrices(kospi, 20);
    } catch (e) {
        marketRet = null;
    }

    // 2) 업종/테마 프록시 모멘텀
    let sectorRet = null;
    let proxy = getProxyByCategory(category);
    try {
        if (proxy) {
            const series = await fetchSeriesCached(proxy.symbol, proxy.market);
            sectorRet = calcReturnFromPrices(series, 20);
        }
    } catch (e) {
        sectorRet = null;
        proxy = null;
    }

    data.context = {
        category,
        market: { proxy: '^KS11', ret20d: marketRet },
        sector: proxy ? { proxy: proxy.symbol, name: proxy.name, ret20d: sectorRet } : null
    };
}

// 시뮬레이션 데이터 (폴백용)
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

    // 3. 전문가/시장전망(Forward-looking) 분석 (25점 배점)
    // - 애널리스트 컨센서스(추천 비중)
    // - 목표주가 대비 업사이드
    // - (가능하면) 이익 성장률(예상)
    const f = data.forward;
    if (f && f.available) {
        // 3-1) 애널리스트 컨센서스 (최대 10점)
        const aScore = f.analyst?.score;
        if (typeof aScore === 'number') {
            if (aScore >= 0.70) buyScore += 10;
            else if (aScore >= 0.58) buyScore += 7;
            else if (aScore >= 0.50) buyScore += 4;
            else if (aScore <= 0.35) sellScore += 10;
            else if (aScore <= 0.45) sellScore += 7;
            else sellScore += 4;
        }

        // 3-2) 목표주가 업사이드 (최대 10점)
        const up = f.upsidePct;
        if (typeof up === 'number') {
            if (up >= 0.20) buyScore += 10;
            else if (up >= 0.10) buyScore += 7;
            else if (up >= 0.03) buyScore += 4;
            else if (up <= -0.10) sellScore += 10;
            else if (up <= -0.03) sellScore += 7;
            else if (up < 0) sellScore += 4;
        }

        // 3-3) 이익 성장률(예상) (최대 5점)
        const eg = f.earningsGrowth;
        if (typeof eg === 'number') {
            if (eg >= 0.15) buyScore += 5;
            else if (eg >= 0.05) buyScore += 3;
            else if (eg <= -0.10) sellScore += 5;
            else if (eg <= -0.03) sellScore += 3;
        }

        // 커버리지 부족 시(한쪽만 점수 붙는 경우) 과도한 치우침 완화
        if (buyScore === 55 && sellScore === 25) { /* no-op */ }
    } else {
        // 애널리스트 데이터가 없으면(특히 국내) 시장 동향/업종 시황 프록시로 보강
        const ctx = data.context;

        // 3-A) 시장 모멘텀 (최대 10점)
        const m = ctx?.market?.ret20d;
        if (typeof m === 'number') {
            if (m >= 0.03) buyScore += 10;
            else if (m >= 0.0) buyScore += 6;
            else if (m <= -0.03) sellScore += 10;
            else sellScore += 6;
        } else {
            buyScore += 5;
            sellScore += 5;
        }

        // 3-B) 업종/테마 프록시 모멘텀 (최대 15점)
        const s = ctx?.sector?.ret20d;
        if (typeof s === 'number') {
            if (s >= 0.05) buyScore += 15;
            else if (s >= 0.0) buyScore += 9;
            else if (s <= -0.05) sellScore += 15;
            else sellScore += 9;
        } else {
            // 업종 프록시를 못 잡으면 중립
            buyScore += 7;
            sellScore += 7;
        }
    }

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

// 추천 종목 스캔 (매수 신호 초록인 것만)
async function scanRecommendedStocks() {
    if (isScanning) return;
    isScanning = true;
    
    const ticker = document.getElementById('buy-ticker');
    const track = document.getElementById('buy-ticker-track');
    if (!ticker || !track) return;

    // 스캔 중 표시
    ticker.classList.remove('hidden');
    track.innerHTML = '<div style="padding:0.5rem;color:#888;font-size:0.85rem;">추천 종목 스캔 중... (최대 30초 소요)</div>';

    const greenStocks = [];
    let scannedCount = 0;
    let errorCount = 0;
    
    // 배치로 스캔 (동시 5개씩)
    const batchSize = 5;
    for (let i = 0; i < RECOMMENDED_POOL.length; i += batchSize) {
        const batch = RECOMMENDED_POOL.slice(i, i + batchSize);
        const results = await Promise.allSettled(
            batch.map(async (stock) => {
                try {
                    const data = await fetchStockData(stock);
                    const signals = calculateSignals(data);
                    scannedCount++;
                    if (signals.buy.color === 'green') {
                        return { ...stock, score: signals.buy.score };
                    }
                    return null;
                } catch (e) {
                    errorCount++;
                    return null;
                }
            })
        );
        
        results.forEach(r => {
            if (r.status === 'fulfilled' && r.value) {
                greenStocks.push(r.value);
            }
        });
        
        // 진행상황 업데이트
        track.innerHTML = `<div style="padding:0.5rem;color:#888;font-size:0.85rem;">스캔 중... ${scannedCount + errorCount}/${RECOMMENDED_POOL.length} (추천: ${greenStocks.length}개)</div>`;
        
        // 100ms 대기 (API 부담 줄임)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 중복 제거 (같은 market + symbol 조합)
    const uniqueStocks = [];
    const seen = new Set();
    greenStocks.forEach(s => {
        const key = `${s.market}:${s.symbol}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueStocks.push(s);
        }
    });
    
    recommendedStocks = uniqueStocks.sort((a, b) => b.score - a.score);
    isScanning = false;
    
    console.log(`[추천 스캔 완료] 총: ${RECOMMENDED_POOL.length}, 성공: ${scannedCount}, 실패: ${errorCount}, 초록: ${greenStocks.length}, 중복제거 후: ${uniqueStocks.length}`);
    updateBuyTicker();
}

// 매수(초록) 신호 티커 업데이트
function updateBuyTicker() {
    const ticker = document.getElementById('buy-ticker');
    const track = document.getElementById('buy-ticker-track');
    if (!ticker || !track) return;

    // 이미 사용자가 추가한 종목은 제외
    const userStockKeys = new Set(stocks.map(s => `${s.market}:${s.symbol}`));
    const filteredStocks = recommendedStocks.filter(s => !userStockKeys.has(`${s.market}:${s.symbol}`));

    if (filteredStocks.length === 0) {
        if (!isScanning) {
            // 스캔 완료했는데 추천 없음
            ticker.classList.remove('hidden');
            const totalMsg = recommendedStocks.length > 0 
                ? `모두 이미 추가된 종목입니다 ✓` 
                : `스캔 완료: ${RECOMMENDED_POOL.length}개 종목 중 매수 신호(초록) 없음 😢`;
            track.innerHTML = `<div style="padding:0.5rem;color:#888;font-size:0.85rem;">${totalMsg}</div>`;
        }
        return;
    }

    // 티커 HTML 생성
    const htmlOnce = filteredStocks.map(it => {
        const safeName = (it.name || '').replace(/"/g, '&quot;');
        return `
          <div class="ticker-pill" onclick="addFromTicker('${it.market}','${it.symbol}','${safeName}')" title="클릭하면 관심종목에 추가 (점수: ${it.score})">
            <span class="dot"></span>
            <span class="tname">${it.name}</span>
            <span class="tsym">${it.symbol}</span>
          </div>
        `;
    }).join('');

    // 종목이 5개 이상이면 무한 스크롤 효과를 위해 2번 반복, 그 외엔 1번만
    track.innerHTML = filteredStocks.length >= 5 ? (htmlOnce + htmlOnce) : htmlOnce;
    ticker.classList.remove('hidden');
}

function addFromTicker(market, symbol, name) {
    // 이미 있으면 맨 위로 올리기
    const idx = stocks.findIndex(s => s.market === market && s.symbol === symbol);
    if (idx >= 0) {
        const [item] = stocks.splice(idx, 1);
        stocks.unshift(item);
        saveStocks();
        loadStocks();
        return;
    }
    stocks.unshift({ market, symbol, name });
    saveStocks();
    loadStocks();
}

// 자동 업데이트 (5분마다)
function startAutoUpdate() {
    setInterval(() => {
        if (isLoggedIn) {
            loadStocks();
        }
    }, 5 * 60 * 1000); // 5분
}

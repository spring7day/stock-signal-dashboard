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
    
    // 미국 주식 - 테크
    { market: 'US', symbol: 'AAPL', name: 'Apple', category: '테크' },
    { market: 'US', symbol: 'MSFT', name: 'Microsoft', category: '테크' },
    { market: 'US', symbol: 'GOOGL', name: 'Alphabet (Google)', category: '테크' },
    { market: 'US', symbol: 'GOOG', name: 'Alphabet Class C', category: '테크' },
    { market: 'US', symbol: 'AMZN', name: 'Amazon', category: '이커머스' },
    { market: 'US', symbol: 'NVDA', name: 'NVIDIA', category: '반도체' },
    { market: 'US', symbol: 'TSLA', name: 'Tesla', category: '전기차' },
    { market: 'US', symbol: 'META', name: 'Meta (Facebook)', category: '소셜미디어' },
    { market: 'US', symbol: 'NFLX', name: 'Netflix', category: 'OTT' },
    { market: 'US', symbol: 'AMD', name: 'AMD', category: '반도체' },
    { market: 'US', symbol: 'INTC', name: 'Intel', category: '반도체' },
    { market: 'US', symbol: 'CRM', name: 'Salesforce', category: 'SaaS' },
    { market: 'US', symbol: 'ORCL', name: 'Oracle', category: '소프트웨어' },
    { market: 'US', symbol: 'ADBE', name: 'Adobe', category: '소프트웨어' },
    { market: 'US', symbol: 'CSCO', name: 'Cisco', category: '네트워킹' },
    { market: 'US', symbol: 'AVGO', name: 'Broadcom', category: '반도체' },
    { market: 'US', symbol: 'QCOM', name: 'Qualcomm', category: '반도체' },
    { market: 'US', symbol: 'TXN', name: 'Texas Instruments', category: '반도체' },
    
    // 미국 - 금융
    { market: 'US', symbol: 'JPM', name: 'JPMorgan Chase', category: '은행' },
    { market: 'US', symbol: 'BAC', name: 'Bank of America', category: '은행' },
    { market: 'US', symbol: 'WFC', name: 'Wells Fargo', category: '은행' },
    { market: 'US', symbol: 'GS', name: 'Goldman Sachs', category: '투자은행' },
    { market: 'US', symbol: 'MS', name: 'Morgan Stanley', category: '투자은행' },
    { market: 'US', symbol: 'V', name: 'Visa', category: '결제' },
    { market: 'US', symbol: 'MA', name: 'Mastercard', category: '결제' },
    { market: 'US', symbol: 'BRK.B', name: 'Berkshire Hathaway', category: '지주회사' },
    
    // 미국 - 소비재
    { market: 'US', symbol: 'DIS', name: 'Disney', category: '엔터테인먼트' },
    { market: 'US', symbol: 'NKE', name: 'Nike', category: '의류' },
    { market: 'US', symbol: 'SBUX', name: 'Starbucks', category: '음식료' },
    { market: 'US', symbol: 'MCD', name: 'McDonald\'s', category: '음식료' },
    { market: 'US', symbol: 'KO', name: 'Coca-Cola', category: '음료' },
    { market: 'US', symbol: 'PEP', name: 'PepsiCo', category: '음료' },
    { market: 'US', symbol: 'WMT', name: 'Walmart', category: '리테일' },
    { market: 'US', symbol: 'HD', name: 'Home Depot', category: '리테일' },
    { market: 'US', symbol: 'COST', name: 'Costco', category: '리테일' },
    
    // 미국 - 헬스케어
    { market: 'US', symbol: 'JNJ', name: 'Johnson & Johnson', category: '제약' },
    { market: 'US', symbol: 'UNH', name: 'UnitedHealth', category: '헬스케어' },
    { market: 'US', symbol: 'PFE', name: 'Pfizer', category: '제약' },
    { market: 'US', symbol: 'ABBV', name: 'AbbVie', category: '제약' },
    { market: 'US', symbol: 'TMO', name: 'Thermo Fisher', category: '바이오' },
    { market: 'US', symbol: 'ABT', name: 'Abbott', category: '의료기기' },
    
    // 미국 - ETF
    { market: 'US', symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'ETF' },
    { market: 'US', symbol: 'QQQ', name: 'Invesco QQQ (나스닥100)', category: 'ETF' },
    { market: 'US', symbol: 'VOO', name: 'Vanguard S&P 500', category: 'ETF' },
    { market: 'US', symbol: 'IVV', name: 'iShares Core S&P 500', category: 'ETF' },
    { market: 'US', symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'ETF' },
    { market: 'US', symbol: 'DIA', name: 'SPDR Dow Jones', category: 'ETF' },
    { market: 'US', symbol: 'IWM', name: 'iShares Russell 2000', category: 'ETF' },
    { market: 'US', symbol: 'EEM', name: 'iShares MSCI Emerging Markets', category: 'ETF' },
    { market: 'US', symbol: 'GLD', name: 'SPDR Gold Shares', category: 'ETF' },
    { market: 'US', symbol: 'SLV', name: 'iShares Silver Trust', category: 'ETF' },
    { market: 'US', symbol: 'TLT', name: 'iShares 20+ Year Treasury', category: 'ETF' },
    { market: 'US', symbol: 'VNQ', name: 'Vanguard Real Estate', category: 'ETF' },
    { market: 'US', symbol: 'XLF', name: 'Financial Select Sector', category: 'ETF' },
    { market: 'US', symbol: 'XLE', name: 'Energy Select Sector', category: 'ETF' },
    { market: 'US', symbol: 'XLK', name: 'Technology Select Sector', category: 'ETF' },
    { market: 'US', symbol: 'ARKK', name: 'ARK Innovation ETF', category: 'ETF' },
    { market: 'US', symbol: 'ARKG', name: 'ARK Genomic Revolution', category: 'ETF' },
];

// 검색 함수
function searchStocks(query) {
    if (!query || query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return STOCK_DATABASE.filter(stock => {
        return stock.name.toLowerCase().includes(lowerQuery) ||
               stock.symbol.toLowerCase().includes(lowerQuery) ||
               stock.category.toLowerCase().includes(lowerQuery);
    }).slice(0, 10); // 최대 10개 결과
}

# Vercel 배포 가이드

## 실제 API 사용을 위한 Vercel 배포

GitHub Pages는 정적 파일만 지원하므로, 실제 API 기능을 사용하려면 Vercel에 배포해야 합니다.

### 1단계: Vercel 계정 생성
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 2단계: 프로젝트 배포
1. Vercel 대시보드에서 "Add New" → "Project" 클릭
2. GitHub repository 선택: `spring7day/stock-signal-dashboard`
3. "Deploy" 클릭

### 3단계: 배포 완료
- 자동으로 배포됨 (1-2분 소요)
- URL: `https://stock-signal-dashboard.vercel.app` (또는 자동 생성된 URL)

### 4단계: 확인
- Vercel URL로 접속
- 종목 검색 시 모든 한국/미국 주식 검색 가능
- 실제 주가 데이터 표시

## 기능 차이

### GitHub Pages (현재)
- ❌ 제한된 종목만 검색 (수동 입력한 100개)
- ❌ 시뮬레이션 데이터

### Vercel (실제 API)
- ✅ 모든 한국 주식 검색 가능 (한화솔루션 등)
- ✅ 모든 미국 주식 검색 가능
- ✅ 실제 Yahoo Finance 데이터
- ✅ 실시간 주가
- ✅ 실제 기술적 지표

## 비용
- Vercel은 개인 프로젝트 무료입니다
- API 호출 제한: 월 100만 요청 (충분함)

## 도메인 (선택사항)
- 기본: `stock-signal-dashboard.vercel.app`
- 커스텀 도메인 연결 가능 (유료)

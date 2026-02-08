# 🚀 GitHub Pages 배포 가이드

## 1단계: 비밀번호 설정

먼저 `script.js` 파일을 열어서 비밀번호를 설정하세요:

```javascript
const PASSWORD_HASH = 'your-password-here'; // 원하는 비밀번호로 변경
```

예시:
```javascript
const PASSWORD_HASH = 'mySecretPass123!';
```

## 2단계: GitHub Repository 생성

1. GitHub.com에 로그인
2. 우측 상단 `+` 버튼 클릭 → `New repository`
3. Repository 이름 입력 (예: `stock-signal-dashboard`)
4. `Public`으로 설정 (GitHub Pages는 Public repo에서 무료)
5. `Create repository` 클릭

## 3단계: 코드 업로드

터미널에서 다음 명령어 실행:

```bash
cd /Users/jimin/.openclaw/workspace/stock-signal-dashboard

# GitHub repository URL로 변경하세요
git remote add origin https://github.com/YOUR_USERNAME/stock-signal-dashboard.git

git branch -M main
git push -u origin main
```

## 4단계: GitHub Pages 활성화

1. GitHub repository 페이지로 이동
2. `Settings` 탭 클릭
3. 좌측 메뉴에서 `Pages` 클릭
4. Source: `Deploy from a branch` 선택
5. Branch: `main` 선택, 폴더: `/ (root)` 선택
6. `Save` 클릭

## 5단계: 접속

몇 분 후 다음 URL로 접속 가능합니다:
```
https://YOUR_USERNAME.github.io/stock-signal-dashboard/
```

## 🔐 접근 제한 (선택사항)

GitHub Pages는 기본적으로 Public입니다. 완벽한 보안이 필요하다면:

### 옵션 1: GitHub Pro 사용
- GitHub Pro 계정으로 업그레이드하면 Private repository에서도 Pages 사용 가능

### 옵션 2: Vercel 사용 (추천)
1. [Vercel.com](https://vercel.com) 가입
2. GitHub repository 연동
3. Environment Variables에 비밀번호 설정
4. 배포 (더 강력한 보안 제공)

### 옵션 3: Netlify 사용
1. [Netlify.com](https://netlify.com) 가입
2. GitHub repository 연동
3. Password Protection 기능 활성화
4. 배포

## 📱 접속 방법

### PC
1. 배포된 URL 접속
2. 비밀번호 입력
3. 종목 추가 및 모니터링

### 모바일
1. 브라우저에서 URL 접속
2. 홈 화면에 추가 (앱처럼 사용 가능)
   - iOS Safari: 공유 → 홈 화면에 추가
   - Android Chrome: 메뉴 → 홈 화면에 추가

## 🔄 업데이트 방법

코드 수정 후:

```bash
cd /Users/jimin/.openclaw/workspace/stock-signal-dashboard
git add .
git commit -m "업데이트 내용"
git push
```

자동으로 GitHub Pages가 업데이트됩니다.

## ⚠️ 중요 사항

1. **비밀번호 보안**: `script.js`의 비밀번호는 누구나 볼 수 있으므로 강력한 비밀번호 사용 권장
2. **데이터 저장**: 현재는 브라우저 LocalStorage에 저장되므로 캐시 삭제 시 종목 목록이 사라질 수 있음
3. **API 제한**: 실제 API 연동 시 무료 플랜의 API 호출 제한 확인 필요

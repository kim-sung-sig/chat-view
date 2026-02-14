# PWA 설치 문제 해결 가이드

## ❌ 문제: "deferredPrompt가 없습니다"

이 메시지는 브라우저가 `beforeinstallprompt` 이벤트를 발생시키지 않았다는 의미입니다.

## 🔍 원인

1. **Service Worker가 아직 등록되지 않음**
2. **Manifest 파일이 제대로 로드되지 않음**
3. **HTTPS가 아님** (localhost는 예외)
4. **브라우저가 PWA 조건을 확인 중**

## ✅ 해결 방법

### 1단계: 개발 서버 재시작

```bash
# 터미널에서 Ctrl+C로 서버 중지 후
npm run dev
```

### 2단계: 브라우저 캐시 삭제

**Chrome/Edge:**
1. F12 (개발자 도구)
2. Application 탭
3. Storage → Clear site data 클릭
4. 페이지 새로고침 (Ctrl+Shift+R)

### 3단계: PWA 상태 확인

**Chrome DevTools (F12) 에서:**

#### A. Manifest 확인
```
Application 탭 → Manifest
```
✅ 확인사항:
- Name: Discode
- Theme color: #5865F2
- Icons: 4개 아이콘이 모두 표시되어야 함
- Start URL: /

❌ 에러가 보이면:
- 서버 재시작
- 아이콘 파일이 `public/` 폴더에 있는지 확인

#### B. Service Worker 확인
```
Application 탭 → Service Workers
```
✅ 확인사항:
- Status: activated and is running
- 또는: waiting to activate

❌ 아무것도 없으면:
- 페이지 새로고침 (Ctrl+Shift+R)
- 몇 초 기다린 후 다시 확인

#### C. Lighthouse PWA 점수
```
Lighthouse 탭 → Progressive Web App 체크 → Analyze
```
✅ 목표: 80점 이상

### 4단계: 콘솔 로그 확인

**콘솔 (F12 → Console) 에서 확인:**

✅ 정상:
```
✅ PWA: beforeinstallprompt 이벤트 발생!
🎉 PWA: 설치 프롬프트 표시!
```

⚠️ 문제:
```
🔍 PWA Debug: beforeinstallprompt 이벤트가 아직 발생하지 않았습니다.
```

### 5단계: 수동 설치 (백업 방법)

`beforeinstallprompt`가 작동하지 않아도 수동으로 설치 가능합니다:

#### Desktop (Chrome/Edge)
1. **주소창 오른쪽** 에 `⊕` 또는 `+` 아이콘 확인
2. 아이콘 클릭 → "설치" 버튼 클릭
3. 또는 **메뉴(⋮) → "Discode 설치"**

#### Mobile (Android)
1. **메뉴(⋮) → "앱 설치"** 또는 **"홈 화면에 추가"**
2. "설치" 또는 "추가" 버튼 클릭

#### Mobile (iOS Safari)
1. **공유 버튼 (□↑)** 클릭
2. **"홈 화면에 추가"** 선택
3. "추가" 버튼 클릭

## 🎯 지금 당장 테스트하는 방법

### 방법 1: 디버그 버튼 사용 (지금 구현됨!)

1. 페이지 로드 후 **5초 대기**
2. **오른쪽 하단**에 `📱 PWA` 버튼이 나타남
3. 버튼 클릭 → 설치 프롬프트 표시
4. "설치" 버튼 클릭

**deferredPrompt가 없는 경우:**
- Alert 창이 나타나며 수동 설치 방법 안내
- 주소창의 설치(+) 아이콘 사용

### 방법 2: 주소창 설치 아이콘

PWA 조건이 만족되면:
- Chrome: 주소창 오른쪽에 `⊕` 아이콘 자동 표시
- Edge: 주소창 오른쪽에 `+` 아이콘 자동 표시

## 🧪 PWA 설치 조건 (Chrome 기준)

브라우저가 다음 조건을 확인해야 `beforeinstallprompt` 발생:

✅ **필수 조건:**
1. HTTPS 또는 localhost
2. Service Worker 등록됨
3. Web App Manifest 파일 있음
4. Manifest에 name 또는 short_name
5. Manifest에 icons (192x192, 512x512)
6. Manifest에 start_url
7. Manifest의 display: standalone, fullscreen, minimal-ui

✅ **권장 사항:**
- Manifest에 description
- Manifest에 theme_color
- Icons에 maskable purpose

## 🐛 여전히 작동하지 않는 경우

### 1. 서버 완전 재시작
```bash
# Ctrl+C로 서버 중지
rm -rf .nuxt node_modules/.vite
npm run dev
```

### 2. 브라우저 확인
```
Chrome 버전 확인: chrome://version
최소 요구사항: Chrome 84+
```

### 3. HTTPS 테스트 (프로덕션)
```bash
npm run build
npm run preview
```

### 4. ngrok으로 HTTPS 테스트
```bash
# ngrok 설치 후
ngrok http 3000
# 생성된 HTTPS URL로 접속
```

## 📋 체크리스트

테스트하기 전에 확인:

- [ ] `npm run dev` 서버 실행 중
- [ ] `http://localhost:3000` 접속
- [ ] F12 → Application → Manifest 확인
- [ ] F12 → Application → Service Workers 확인
- [ ] F12 → Console에서 PWA 로그 확인
- [ ] 페이지 로드 후 5초 대기
- [ ] 오른쪽 하단 📱 PWA 버튼 확인
- [ ] 버튼 클릭 → 설치 프롬프트 확인
- [ ] 또는 주소창 설치(+) 아이콘 확인

## 💡 팁

1. **시크릿 모드에서 테스트**: 캐시/확장 프로그램 문제 배제
2. **다른 브라우저에서 테스트**: Chrome, Edge, Firefox
3. **모바일에서 테스트**: 실제 기기에서 확인
4. **콘솔 항상 열어두기**: PWA 이벤트 로그 확인

## 🎉 성공 시나리오

**정상 작동 시 순서:**

1. 페이지 로드
2. Service Worker 등록 (콘솔 로그)
3. Manifest 로드 (콘솔 로그)
4. 브라우저가 PWA 조건 확인 (1-5초)
5. `beforeinstallprompt` 이벤트 발생
6. **방법 A**: 페이지 하단에 설치 프롬프트 자동 표시
7. **방법 B**: 주소창에 설치(+) 아이콘 표시
8. "설치" 클릭
9. 앱 설치 완료!
10. 홈 화면/앱 목록에 Discode 아이콘 생성

---

**여전히 문제가 있나요?**
F12 → Console의 모든 로그를 복사해서 공유해주세요!

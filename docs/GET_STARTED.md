# Chat-View 프로젝트 시작 가이드
> 지금 바로 시작하기
>
> 작성일: 2025-12-20

---

## ✅ 완료된 작업

### 1. PostCSS 오류 해결
- [x] `danger-700` 색상 팔레트 추가
- [x] Tailwind config 완성

### 2. 전략 문서 작성
- [x] [프로젝트 재구성 전략](./REDESIGN_PROJECT_STRATEGY.md)
- [x] [개발 프로세스 로드맵](./DEVELOPMENT_ROADMAP.md)

---

## 🚀 다음 단계: Phase 1 시작

### Week 1: 디자인 시스템 & 공통 컴포넌트

#### 즉시 시작할 작업 (Day 1-2)

##### 1. 디자인 토큰 정리
```bash
# 파일 생성
chat-view/assets/css/tokens.css
```

##### 2. 색상 시스템 완성
이미 `tailwind.config.js`에 다음 색상이 정의되어 있습니다:
- ✅ Brand Colors (50-900)
- ✅ Workspace Colors (다크모드)
- ✅ Semantic Colors (success, warning, danger)

##### 3. 공통 컴포넌트 구현 시작
다음 순서로 구현:

**Day 1-2**: 기본 컴포넌트
- [ ] `components/common/Button.vue`
- [ ] `components/common/Input.vue`
- [ ] `components/common/Icon.vue`
- [ ] `components/common/Avatar.vue`

**Day 3-4**: 복잡한 컴포넌트
- [ ] `components/common/Modal.vue`
- [ ] `components/common/Dropdown.vue`
- [ ] `components/common/Tooltip.vue`
- [ ] `components/common/Loading.vue`

**Day 5**: 레이아웃
- [ ] `layouts/default.vue`
- [ ] `components/layout/AppHeader.vue`
- [ ] `components/layout/WorkspaceSidebar.vue`
- [ ] `components/layout/RightPanel.vue`

---

## 📝 개발 프로세스

### 1. 브랜치 전략
```bash
# Feature 브랜치 생성
git checkout -b feature/design-system

# 작업 후 커밋
git add .
git commit -m "feat: add Button component"

# 메인 브랜치 병합
git checkout main
git merge feature/design-system
```

### 2. 커밋 컨벤션
```
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 수정
style:    코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test:     테스트 추가/수정
chore:    빌드/설정 변경
```

### 3. 개발 플로우
```
1. 요구사항 확인 (로드맵 참조)
   ↓
2. 컴포넌트 설계 (Props, Events 정의)
   ↓
3. 구현 (TypeScript + Composition API)
   ↓
4. 스타일링 (Tailwind CSS)
   ↓
5. 테스트 (동작 확인)
   ↓
6. 문서화 (JSDoc, README)
```

---

## 🎨 디자인 시스템 구현 예시

### Button 컴포넌트 템플릿
```vue
<!-- components/common/Button.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const buttonClass = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
])
</script>

<template>
  <button
    :class="buttonClass"
    :disabled="disabled || loading"
  >
    <Icon v-if="loading" name="spinner" class="animate-spin" />
    <Icon v-else-if="icon" :name="icon" />
    <slot />
  </button>
</template>
```

### Input 컴포넌트 템플릿
```vue
<!-- components/common/Input.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="input-label">
      {{ label }}
    </label>
    
    <div class="input-wrapper">
      <Icon v-if="icon" :name="icon" class="input-icon" />
      
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['input', { 'input-error': error }]"
        @input="handleInput"
      />
    </div>
    
    <span v-if="error" class="input-error-text">
      {{ error }}
    </span>
  </div>
</template>
```

---

## 🔧 개발 환경 설정

### 필요한 패키지 설치
```bash
# VueUse (유틸리티 함수)
npm install @vueuse/core @vueuse/nuxt

# Headless UI (접근성 좋은 UI 컴포넌트)
npm install @headlessui/vue

# Heroicons (아이콘)
npm install @heroicons/vue

# Date-fns (날짜 포맷팅)
npm install date-fns
```

### Nuxt Config 업데이트
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  
  css: [
    '~/assets/css/main.css',
  ],
  
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
```

---

## 📚 참고 자료

### UI 인스피레이션
- [Slack](https://slack.com)
- [Microsoft Teams](https://teams.microsoft.com)
- [Discord](https://discord.com)
- [Linear](https://linear.app)

### 기술 문서
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Nuxt 3](https://nuxt.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Pinia](https://pinia.vuejs.org)
- [VueUse](https://vueuse.org)

### 디자인 시스템 예제
- [Tailwind UI](https://tailwindui.com)
- [Headless UI](https://headlessui.com)
- [shadcn/ui](https://ui.shadcn.com) (참고용)

---

## ✨ 개발 팁

### 1. 컴포넌트 재사용성
- Props를 명확하게 정의
- Events를 문서화
- Slots을 활용한 유연한 구조

### 2. TypeScript 활용
- 모든 Props에 타입 정의
- Computed/Ref에 타입 명시
- `any` 사용 금지

### 3. 성능 최적화
- `v-show` vs `v-if` 적절히 선택
- `computed` 활용 (불필요한 재계산 방지)
- `watchDebounced` 사용 (검색, 입력 등)

### 4. 접근성
- 모든 버튼에 `aria-label`
- 포커스 관리 (키보드 네비게이션)
- 색상 대비 4.5:1 이상

---

## 🎯 이번 주 목표 (Week 1)

### 완료 체크리스트
- [ ] 디자인 토큰 정의 완료
- [ ] Button 컴포넌트 구현 + 테스트
- [ ] Input 컴포넌트 구현 + 테스트
- [ ] Modal 컴포넌트 구현 + 테스트
- [ ] Dropdown 컴포넌트 구현 + 테스트
- [ ] Icon 시스템 구현
- [ ] Avatar 컴포넌트 구현
- [ ] Loading 스피너 구현
- [ ] 기본 레이아웃 템플릿 완성

### 성공 기준
1. **재사용성**: 모든 컴포넌트가 3곳 이상에서 재사용 가능
2. **타입 안전성**: TypeScript 에러 0개
3. **접근성**: 키보드로 모든 기능 접근 가능
4. **반응성**: 다크모드 완벽 지원

---

## 🚦 다음 세션 준비사항

### Week 2 Preview: 라우팅 & 인증
다음 주에는 다음 작업을 진행합니다:
1. 페이지 라우팅 구조 설정
2. 인증 시스템 (로그인/로그아웃)
3. Auth Store (Pinia)
4. API Client (Axios)
5. 미들웨어 (인증 체크)

미리 준비할 것:
- [ ] 백엔드 API 엔드포인트 확인
- [ ] 인증 플로우 이해
- [ ] JWT 토큰 저장 방식 결정

---

## 💬 질문이 있으신가요?

개발 중 막히는 부분이 있다면:
1. 로드맵 문서 다시 확인
2. 참고 자료 검색
3. 필요시 요청 (더 상세한 예제 제공 가능)

---

**준비됐나요? 지금 바로 시작하세요!** 🚀

```bash
# 개발 서버 실행
cd chat-view
npm run dev
```

**행운을 빕니다!** 💪

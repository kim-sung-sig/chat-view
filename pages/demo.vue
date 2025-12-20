<template>
  <NuxtLayout>
    <div class="p-8 space-y-8">
      <!-- 헤더 -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-workspace-text">
          디자인 시스템 데모
        </h1>
        <p class="mt-2 text-gray-600 dark:text-workspace-text-muted">
          공통 컴포넌트들을 테스트하고 확인할 수 있습니다.
        </p>
      </div>

      <!-- Button 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Buttons
        </h2>

        <div class="space-y-4">
          <!-- Variants -->
          <div class="flex items-center gap-4">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
          </div>

          <!-- Sizes -->
          <div class="flex items-center gap-4">
            <BaseButton size="sm">Small</BaseButton>
            <BaseButton size="md">Medium</BaseButton>
            <BaseButton size="lg">Large</BaseButton>
          </div>

          <!-- States -->
          <div class="flex items-center gap-4">
            <BaseButton :loading="true">Loading</BaseButton>
            <BaseButton :disabled="true">Disabled</BaseButton>
          </div>
        </div>
      </section>

      <!-- Icon 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Icons
        </h2>

        <div class="flex items-center gap-6">
          <BaseIcon name="home" />
          <BaseIcon name="chat" />
          <BaseIcon name="users" />
          <BaseIcon name="settings" />
          <BaseIcon name="bell" />
          <BaseIcon name="search" />
          <BaseIcon name="plus" />
          <BaseIcon name="close" />
        </div>

        <div class="flex items-center gap-6">
          <BaseIcon name="home" size="xs" />
          <BaseIcon name="home" size="sm" />
          <BaseIcon name="home" size="md" />
          <BaseIcon name="home" size="lg" />
          <BaseIcon name="home" size="xl" />
        </div>
      </section>

      <!-- Avatar 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Avatars
        </h2>

        <div class="flex items-center gap-4">
          <UserAvatar name="홍길동" size="xs" status="online" show-status />
          <UserAvatar name="김철수" size="sm" status="away" show-status />
          <UserAvatar name="이영희" size="md" status="busy" show-status />
          <UserAvatar name="박민수" size="lg" status="offline" show-status />
          <UserAvatar name="John Doe" size="xl" />
        </div>
      </section>

      <!-- Dropdown 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Dropdown
        </h2>

        <div class="flex items-start gap-4">
          <BaseDropdown label="메뉴 열기">
            <BaseDropdownItem icon="home">홈</BaseDropdownItem>
            <BaseDropdownItem icon="chat">채팅</BaseDropdownItem>
            <BaseDropdownItem icon="users">사용자</BaseDropdownItem>
            <div class="border-t border-gray-200 dark:border-workspace-border my-1" />
            <BaseDropdownItem icon="settings">설정</BaseDropdownItem>
            <BaseDropdownItem icon="close" danger>로그아웃</BaseDropdownItem>
          </BaseDropdown>
        </div>
      </section>

      <!-- Tooltip 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Tooltips
        </h2>

        <div class="flex items-center gap-4">
          <BaseTooltip text="위쪽 툴팁" placement="top">
            <BaseButton variant="secondary">위로</BaseButton>
          </BaseTooltip>

          <BaseTooltip text="아래쪽 툴팁" placement="bottom">
            <BaseButton variant="secondary">아래로</BaseButton>
          </BaseTooltip>

          <BaseTooltip text="왼쪽 툴팁" placement="left">
            <BaseButton variant="secondary">왼쪽</BaseButton>
          </BaseTooltip>

          <BaseTooltip text="오른쪽 툴팁" placement="right">
            <BaseButton variant="secondary">오른쪽</BaseButton>
          </BaseTooltip>
        </div>
      </section>

      <!-- Input 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Inputs
        </h2>

        <div class="max-w-md space-y-4">
          <BaseInput
            v-model="inputValue"
            label="이름"
            placeholder="이름을 입력하세요"
          />

          <BaseInput
            v-model="emailValue"
            type="email"
            label="이메일"
            placeholder="email@example.com"
          />

          <BaseInput
            v-model="searchValue"
            type="search"
            placeholder="검색..."
          />

          <BaseInput
            v-model="errorInput"
            label="에러 예시"
            error="이 필드는 필수입니다"
          />
        </div>
      </section>

      <!-- Modal 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Modal
        </h2>

        <div>
          <BaseButton @click="showModal = true">
            모달 열기
          </BaseButton>

          <BaseModal
            :is-open="showModal"
            title="모달 제목"
            @close="showModal = false"
          >
            <p class="text-gray-600 dark:text-workspace-text-muted">
              모달 컨텐츠가 여기에 표시됩니다.
            </p>

            <template #footer>
              <div class="flex justify-end gap-2">
                <BaseButton variant="ghost" @click="showModal = false">
                  취소
                </BaseButton>
                <BaseButton variant="primary" @click="showModal = false">
                  확인
                </BaseButton>
              </div>
            </template>
          </BaseModal>
        </div>
      </section>

      <!-- Loading 컴포넌트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Loading Spinners
        </h2>

        <div class="flex items-center gap-6">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </section>

      <!-- 색상 팔레트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-workspace-text">
          Color Palette
        </h2>

        <!-- Brand Colors -->
        <div>
          <h3 class="text-lg font-medium mb-2">Brand Colors</h3>
          <div class="flex gap-2">
            <div v-for="i in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="i"
              :class="`bg-brand-${i} w-16 h-16 rounded flex items-center justify-center text-xs`"
              :style="{ backgroundColor: `var(--color-brand-${i})` }">
              {{ i }}
            </div>
          </div>
        </div>

        <!-- Semantic Colors -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <h3 class="text-lg font-medium mb-2">Success</h3>
            <div class="bg-success-500 h-16 rounded flex items-center justify-center text-white">
              Success
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-2">Warning</h3>
            <div class="bg-warning-500 h-16 rounded flex items-center justify-center text-white">
              Warning
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-2">Danger</h3>
            <div class="bg-danger-500 h-16 rounded flex items-center justify-center text-white">
              Danger
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State
const inputValue = ref('')
const emailValue = ref('')
const searchValue = ref('')
const errorInput = ref('')
const showModal = ref(false)
</script>


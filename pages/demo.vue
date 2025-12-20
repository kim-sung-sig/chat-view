<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 페이지 헤더 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          디자인 시스템 컴포넌트
        </h1>
        <p class="text-gray-600">
          재사용 가능한 기본 컴포넌트 라이브러리
        </p>
      </div>

      <div class="space-y-12">
        <!-- ========== BaseButton 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            BaseButton
          </h2>

          <!-- 버튼 변형 -->
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Variants (변형)</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton variant="primary">Primary</BaseButton>
                <BaseButton variant="secondary">Secondary</BaseButton>
                <BaseButton variant="ghost">Ghost</BaseButton>
                <BaseButton variant="danger">Danger</BaseButton>
              </div>
            </div>

            <!-- 버튼 크기 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Sizes (크기)</h3>
              <div class="flex flex-wrap items-center gap-3">
                <BaseButton size="sm">Small</BaseButton>
                <BaseButton size="md">Medium</BaseButton>
                <BaseButton size="lg">Large</BaseButton>
              </div>
            </div>

            <!-- 아이콘 버튼 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">With Icons (아이콘)</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton :icon-left="PlusIcon">Add Channel</BaseButton>
                <BaseButton variant="secondary" :icon-right="ChevronDownIcon">
                  More Options
                </BaseButton>
                <BaseButton variant="ghost" :icon-left="MagnifyingGlassIcon">
                  Search
                </BaseButton>
              </div>
            </div>

            <!-- 상태 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">States (상태)</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton :loading="true">Loading</BaseButton>
                <BaseButton :disabled="true">Disabled</BaseButton>
                <BaseButton full-width>Full Width</BaseButton>
              </div>
            </div>
          </div>
        </section>

        <!-- ========== UserAvatar 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            UserAvatar
          </h2>

          <div class="space-y-6">
            <!-- 크기 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Sizes (크기)</h3>
              <div class="flex flex-wrap items-center gap-4">
                <UserAvatar name="홍길동" size="xs" />
                <UserAvatar name="김철수" size="sm" />
                <UserAvatar name="이영희" size="md" />
                <UserAvatar name="박민수" size="lg" />
                <UserAvatar name="최지은" size="xl" />
              </div>
            </div>

            <!-- 온라인 상태 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Online Status (온라인 상태)</h3>
              <div class="flex flex-wrap items-center gap-4">
                <UserAvatar name="Online User" status="online" show-status />
                <UserAvatar name="Offline User" status="offline" show-status />
                <UserAvatar name="Away User" status="away" show-status />
                <UserAvatar name="Busy User" status="busy" show-status />
              </div>
            </div>

            <!-- 영문 이름 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">English Names</h3>
              <div class="flex flex-wrap items-center gap-4">
                <UserAvatar name="John Doe" size="md" status="online" show-status />
                <UserAvatar name="Jane Smith" size="md" status="away" show-status />
                <UserAvatar name="Bob Wilson" size="md" status="busy" show-status />
              </div>
            </div>
          </div>
        </section>

        <!-- ========== BaseInput 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            BaseInput
          </h2>

          <div class="space-y-6 max-w-md">
            <!-- 기본 입력 -->
            <BaseInput
              v-model="inputValue"
              label="사용자 이름"
              placeholder="이름을 입력하세요"
              hint="2-20자 사이로 입력해주세요"
            />

            <!-- 아이콘 입력 -->
            <BaseInput
              v-model="searchValue"
              type="search"
              placeholder="검색..."
              :icon-left="MagnifyingGlassIcon"
              clearable
            />

            <!-- 이메일 -->
            <BaseInput
              v-model="emailValue"
              type="email"
              label="이메일"
              placeholder="example@email.com"
              :icon-left="EnvelopeIcon"
              :required="true"
            />

            <!-- 에러 상태 -->
            <BaseInput
              v-model="errorValue"
              label="비밀번호"
              type="password"
              error="비밀번호는 최소 8자 이상이어야 합니다"
            />

            <!-- 비활성화 -->
            <BaseInput
              v-model="disabledValue"
              label="비활성화"
              disabled
            />
          </div>
        </section>

        <!-- ========== BaseModal 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            BaseModal
          </h2>

          <div class="space-y-4">
            <div class="flex flex-wrap gap-3">
              <BaseButton @click="openModal('sm')">Small Modal</BaseButton>
              <BaseButton @click="openModal('md')">Medium Modal</BaseButton>
              <BaseButton @click="openModal('lg')">Large Modal</BaseButton>
              <BaseButton @click="openModal('xl')">Extra Large Modal</BaseButton>
            </div>

            <!-- 모달 컴포넌트 -->
            <BaseModal
              :is-open="isModalOpen"
              :title="`${currentModalSize.toUpperCase()} Modal Example`"
              :size="currentModalSize"
              @close="closeModal"
            >
              <div class="space-y-4">
                <p class="text-gray-600">
                  이것은 <strong>{{ currentModalSize }}</strong> 크기의 모달 예제입니다.
                </p>
                <p class="text-gray-600">
                  모달은 중요한 정보를 표시하거나 사용자 입력을 받을 때 사용됩니다.
                </p>
              </div>

              <template #footer>
                <BaseButton variant="ghost" @click="closeModal">
                  취소
                </BaseButton>
                <BaseButton @click="closeModal">
                  확인
                </BaseButton>
              </template>
            </BaseModal>
          </div>
        </section>

        <!-- ========== LoadingSpinner 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            LoadingSpinner
          </h2>

          <div class="flex flex-wrap items-center gap-8">
            <div class="text-center">
              <LoadingSpinner size="sm" />
              <p class="text-sm text-gray-600 mt-2">Small</p>
            </div>
            <div class="text-center">
              <LoadingSpinner size="md" />
              <p class="text-sm text-gray-600 mt-2">Medium</p>
            </div>
            <div class="text-center">
              <LoadingSpinner size="lg" />
              <p class="text-sm text-gray-600 mt-2">Large</p>
            </div>
            <div class="text-center">
              <LoadingSpinner size="xl" />
              <p class="text-sm text-gray-600 mt-2">Extra Large</p>
            </div>
          </div>
        </section>

        <!-- ========== CSS 유틸리티 섹션 ========== -->
        <section class="bg-white rounded-xl shadow-soft p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            CSS Utilities
          </h2>

          <div class="space-y-6">
            <!-- 버튼 클래스 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Button Classes</h3>
              <div class="flex flex-wrap gap-3">
                <button class="btn btn-primary btn-sm">btn-primary btn-sm</button>
                <button class="btn btn-secondary btn-md">btn-secondary btn-md</button>
                <button class="btn btn-ghost btn-lg">btn-ghost btn-lg</button>
                <button class="btn btn-danger">btn-danger</button>
              </div>
            </div>

            <!-- Badge 클래스 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Badge Classes</h3>
              <div class="flex flex-wrap gap-3">
                <span class="badge badge-primary">Primary</span>
                <span class="badge badge-success">Success</span>
                <span class="badge badge-warning">Warning</span>
                <span class="badge badge-danger">Danger</span>
              </div>
            </div>

            <!-- Card 클래스 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Card Class</h3>
              <div class="card p-4 max-w-sm">
                <h4 class="font-semibold text-gray-900 mb-2">Card Title</h4>
                <p class="text-gray-600">
                  This is a card component with shadow and border.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline'
import type { ModalSize } from '~/types/ui'

// ============================================
// Page Meta
// ============================================
definePageMeta({
  layout: 'default',
})

// ============================================
// State
// ============================================
const inputValue = ref('')
const searchValue = ref('')
const emailValue = ref('')
const errorValue = ref('123')
const disabledValue = ref('Cannot edit this')

const isModalOpen = ref(false)
const currentModalSize = ref<ModalSize>('md')

// ============================================
// Methods
// ============================================
const openModal = (size: ModalSize) => {
  currentModalSize.value = size
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

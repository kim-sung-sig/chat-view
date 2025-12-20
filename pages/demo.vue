<template>
  <div class="min-h-screen bg-background dark:bg-discord-bg">
    <div class="max-w-7xl mx-auto p-8 space-y-12">
      <!-- 헤더 -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-foreground">
          디자인 시스템 데모
        </h1>
        <p class="text-lg text-muted-foreground">
          Discord/Slack 스타일의 공통 컴포넌트들
        </p>
      </div>

      <!-- Buttons -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-foreground mb-2">Buttons</h2>
          <p class="text-muted-foreground">다양한 버튼 스타일과 크기</p>
        </div>

        <div class="space-y-6 p-6 rounded-lg border bg-card">
          <!-- Variants -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-muted-foreground">Variants</h3>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
            </div>
          </div>

          <!-- Sizes -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-muted-foreground">Sizes</h3>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="md">Medium</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
            </div>
          </div>

          <!-- States -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-muted-foreground">States</h3>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton :loading="true">Loading</BaseButton>
              <BaseButton :disabled="true">Disabled</BaseButton>
              <BaseButton full-width>Full Width</BaseButton>
            </div>
          </div>

          <!-- With Icons -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-muted-foreground">With Icons</h3>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton variant="primary">
                <BaseIcon name="plus" size="sm" />
                새 채널
              </BaseButton>
              <BaseButton variant="secondary">
                <BaseIcon name="search" size="sm" />
                검색
              </BaseButton>
              <BaseButton variant="ghost">
                <BaseIcon name="settings" size="sm" />
                설정
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Icons -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-foreground mb-2">Icons</h2>
          <p class="text-muted-foreground">Heroicons 기반 아이콘 시스템</p>
        </div>

        <div class="p-6 rounded-lg border bg-card">
          <div class="grid grid-cols-8 gap-6">
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="home" size="lg" />
              <span class="text-xs text-muted-foreground">home</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="chat" size="lg" />
              <span class="text-xs text-muted-foreground">chat</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="users" size="lg" />
              <span class="text-xs text-muted-foreground">users</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="settings" size="lg" />
              <span class="text-xs text-muted-foreground">settings</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="bell" size="lg" />
              <span class="text-xs text-muted-foreground">bell</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="search" size="lg" />
              <span class="text-xs text-muted-foreground">search</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="plus" size="lg" />
              <span class="text-xs text-muted-foreground">plus</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <BaseIcon name="close" size="lg" />
              <span class="text-xs text-muted-foreground">close</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-foreground mb-2">Typography</h2>
          <p class="text-muted-foreground">텍스트 스타일 시스템</p>
        </div>

        <div class="p-6 rounded-lg border bg-card space-y-4">
          <h1 class="text-4xl font-bold text-foreground">Heading 1</h1>
          <h2 class="text-3xl font-semibold text-foreground">Heading 2</h2>
          <h3 class="text-2xl font-semibold text-foreground">Heading 3</h3>
          <h4 class="text-xl font-medium text-foreground">Heading 4</h4>
          <p class="text-base text-foreground">Body text - Inter 폰트 기반</p>
          <p class="text-sm text-muted-foreground">Muted text - 보조 텍스트용</p>
        </div>
      </section>

      <!-- Color Palette -->
      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-foreground mb-2">Color Palette</h2>
          <p class="text-muted-foreground">Discord/Slack 스타일 색상 시스템</p>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- Light Mode -->
          <div class="p-6 rounded-lg border bg-card space-y-3">
            <h3 class="font-semibold text-foreground mb-4">Light Mode</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-background border" />
                <span class="text-sm">Background</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-card border" />
                <span class="text-sm">Card</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-primary" />
                <span class="text-sm">Primary</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-secondary" />
                <span class="text-sm">Secondary</span>
              </div>
            </div>
          </div>

          <!-- Dark Mode -->
          <div class="p-6 rounded-lg border bg-discord-bg text-white space-y-3">
            <h3 class="font-semibold mb-4">Dark Mode (Discord Style)</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-discord-bg border border-gray-700" />
                <span class="text-sm">Background</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-discord-sidebar" />
                <span class="text-sm">Sidebar</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-discord-brand" />
                <span class="text-sm">Brand</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded bg-discord-hover" />
                <span class="text-sm">Hover</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: undefined
})
</script>


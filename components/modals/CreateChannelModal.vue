<template>
  <BaseModal
    :show="show"
    title="새 채널 만들기"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 채널 타입 선택 -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-3">
          채널 타입
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="type in channelTypes"
            :key="type.value"
            type="button"
            @click="form.type = type.value"
            :class="[
              'p-4 rounded-lg border-2 transition-all',
              form.type === type.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            ]"
          >
            <div class="text-2xl mb-2">{{ type.icon }}</div>
            <div class="text-sm font-medium text-foreground">{{ type.label }}</div>
            <div class="text-xs text-muted-foreground mt-1">{{ type.description }}</div>
          </button>
        </div>
      </div>

      <!-- 채널 이름 -->
      <BaseInput
        v-model="form.name"
        label="채널 이름"
        placeholder="general, random, 프로젝트..."
        required
        :maxlength="50"
      >
        <template #prefix>
          <span class="text-muted-foreground">#</span>
        </template>
      </BaseInput>

      <!-- 채널 설명 -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          채널 설명 (선택사항)
        </label>
        <textarea
          v-model="form.description"
          placeholder="이 채널의 용도를 설명해주세요..."
          rows="3"
          class="input w-full resize-none"
          :maxlength="200"
        />
        <p class="mt-1 text-xs text-muted-foreground">
          {{ form.description?.length || 0 }} / 200
        </p>
      </div>

      <!-- 프라이빗 채널 -->
      <div class="flex items-center justify-between p-4 bg-secondary dark:bg-discord-bg rounded-lg">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <BaseIcon name="lock" size="sm" class="text-muted-foreground" />
            <span class="font-medium text-foreground">비공개 채널</span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            초대받은 멤버만 이 채널을 볼 수 있습니다
          </p>
        </div>
        <button
          type="button"
          @click="form.isPrivate = !form.isPrivate"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.isPrivate ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              form.isPrivate ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>

      <!-- 버튼 -->
      <div class="flex gap-3 justify-end pt-4">
        <BaseButton
          type="button"
          variant="ghost"
          @click="$emit('close')"
        >
          취소
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="!form.name"
        >
          <BaseIcon name="plus" size="sm" />
          채널 만들기
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useChannelStore } from '~/stores/channel'
import { useUIStore } from '~/stores/ui'

interface Props {
  show: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [channelId: string]
}>()

const channelStore = useChannelStore()
const uiStore = useUIStore()
const loading = ref(false)

const channelTypes = [
  {
    value: 'TEXT',
    icon: '💬',
    label: '텍스트',
    description: '메시지, 이미지, 링크 등'
  },
  {
    value: 'VOICE',
    icon: '🎤',
    label: '음성',
    description: '음성 대화 채널'
  },
  {
    value: 'ANNOUNCEMENT',
    icon: '📢',
    label: '공지',
    description: '중요한 공지사항'
  }
]

const form = reactive({
  name: '',
  description: '',
  type: 'TEXT' as 'TEXT' | 'VOICE' | 'ANNOUNCEMENT',
  isPrivate: false
})

const handleSubmit = async () => {
  if (!form.name) return

  loading.value = true

  try {
    const channel = await channelStore.createChannel({
      name: form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description || undefined,
      type: form.type,
      isPrivate: form.isPrivate
    })

    uiStore.showToast({
      type: 'success',
      message: `채널 #${channel.name}이(가) 생성되었습니다!`
    })

    emit('created', channel.channelId)
    emit('close')

    // 폼 초기화
    form.name = ''
    form.description = ''
    form.type = 'TEXT'
    form.isPrivate = false
  } catch (error: any) {
    uiStore.showToast({
      type: 'error',
      message: error.message || '채널 생성에 실패했습니다'
    })
  } finally {
    loading.value = false
  }
}
</script>


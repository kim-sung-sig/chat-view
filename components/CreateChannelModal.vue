<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">새 채널 만들기</h3>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 컨텐츠 -->
      <div class="p-6 space-y-6">
        <!-- 채널 타입 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">채널 타입</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="type in channelTypes"
              :key="type.value"
              @click="selectedType = type.value"
              :class="[
                'p-4 rounded-lg border-2 text-left transition',
                selectedType === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="text-2xl mb-2">{{ type.icon }}</div>
              <div class="font-medium text-gray-900">{{ type.label }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ type.description }}</div>
            </button>
          </div>
        </div>

        <!-- 일대일 채널 -->
        <div v-if="selectedType === 'DIRECT'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">상대방 ID</label>
            <input
              v-model="targetUserId"
              type="text"
              placeholder="user2"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <!-- 그룹/공개/비공개 채널 -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">채널 이름</label>
            <input
              v-model="channelName"
              type="text"
              placeholder="채널 이름을 입력하세요"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">설명 (선택)</label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="채널 설명을 입력하세요"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            ></textarea>
          </div>

          <div v-if="selectedType !== 'PUBLIC'">
            <label class="block text-sm font-medium text-gray-700 mb-2">멤버 ID (쉼표로 구분)</label>
            <input
              v-model="memberIds"
              type="text"
              placeholder="user2, user3, user4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">여러 사용자를 초대하려면 쉼표로 구분하세요</p>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
        >
          취소
        </button>
        <button
          @click="createChannel"
          :disabled="!canCreate || creating"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ creating ? '생성 중...' : '채널 만들기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  close: []
  created: [channel: any]
}>()

const authStore = useAuthStore()
const channelStore = useChannelStore()

const channelTypes = [
  { value: 'DIRECT', label: '일대일', icon: '👤', description: '1:1 대화' },
  { value: 'GROUP', label: '그룹', icon: '👥', description: '소규모 그룹' },
  { value: 'PUBLIC', label: '공개', icon: '🌐', description: '누구나 참여' },
  { value: 'PRIVATE', label: '비공개', icon: '🔒', description: '초대 전용' }
]

const selectedType = ref<string>('DIRECT')
const targetUserId = ref('')
const channelName = ref('')
const description = ref('')
const memberIds = ref('')
const creating = ref(false)

// 생성 가능 여부
const canCreate = computed(() => {
  if (selectedType.value === 'DIRECT') {
    return targetUserId.value.trim() !== ''
  }
  return channelName.value.trim() !== ''
})

// 채널 생성
const createChannel = async () => {
  if (!canCreate.value || creating.value) {
    return
  }

  creating.value = true

  try {
    let channel

    switch (selectedType.value) {
      case 'DIRECT':
        channel = await channelStore.createDirectChannel(
          authStore.user!.userId,
          targetUserId.value.trim()
        )
        break

      case 'GROUP':
      case 'PRIVATE':
        const members = memberIds.value
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id !== '')
        
        channel = await channelStore.createGroupChannel(
          authStore.user!.userId,
          channelName.value.trim(),
          members,
          description.value.trim() || undefined
        )
        break

      case 'PUBLIC':
        // TODO: Public 채널 생성 API 호출
        alert('공개 채널 생성은 아직 구현되지 않았습니다.')
        return
    }

    emit('created', channel)
  } catch (error) {
    console.error('Failed to create channel:', error)
    alert('채널 생성에 실패했습니다.')
  } finally {
    creating.value = false
  }
}
</script>

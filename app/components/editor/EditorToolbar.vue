<script setup lang="ts">
type SaveStatus = 'clean' | 'dirty' | 'saving' | 'error'

defineProps<{
  activeDevice: string
  canRedo: boolean
  canUndo: boolean
  editorReady: boolean
  saveLabel: string
  saveStatus: SaveStatus
}>()

const emit = defineEmits<{
  selectDevice: [device: string]
  redo: []
  save: []
  undo: []
}>()

const deviceOptions = [
  { label: '桌面', value: 'Desktop' },
  { label: '平板', value: 'Tablet' },
  { label: '手机', value: 'Mobile' },
]

function selectDevice(value: string | number | null) {
  if (typeof value === 'string') {
    emit('selectDevice', value)
  }
}
</script>

<template>
  <header :class="$style.toolbar">
    <div :class="$style.spacer"></div>
    <NSelect
      :class="$style.deviceSelect"
      :value="activeDevice"
      :options="deviceOptions"
      aria-label="画布设备"
      :disabled="!editorReady"
      @update:value="selectDevice"
    />
    <div :class="$style.actions">
      <NButton
        quaternary
        circle
        :disabled="!canUndo"
        title="撤销"
        aria-label="撤销"
        @click="emit('undo')"
      >
        <template #icon>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="M9 7 4 12l5 5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 12h8a6 6 0 0 1 6 6"
              stroke-linecap="round"
            />
          </svg>
        </template>
      </NButton>
      <NButton
        quaternary
        circle
        :disabled="!canRedo"
        title="重做"
        aria-label="重做"
        @click="emit('redo')"
      >
        <template #icon>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="m15 7 5 5-5 5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 12h-8a6 6 0 0 0-6 6"
              stroke-linecap="round"
            />
          </svg>
        </template>
      </NButton>
      <span
        :class="$style.saveStatus"
        :data-status="saveStatus"
      >
        {{ saveLabel }}
      </span>
      <NButton
        type="primary"
        :loading="saveStatus === 'saving'"
        :disabled="!editorReady"
        @click="emit('save')"
      >
        保存
      </NButton>
    </div>
  </header>
</template>

<style module lang="less">
.toolbar {
  display: flex;
  height: 56px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface);
}

.spacer,
.actions {
  display: flex;
  flex: 1;
}

.deviceSelect {
  width: 120px;
}

.actions {
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.actions svg {
  width: 18px;
  height: 18px;
}

.saveStatus {
  min-width: 64px;
  color: var(--app-text-muted);
  font-size: 12px;
  text-align: right;

  &[data-status='dirty'] {
    color: #b45309;
  }

  &[data-status='error'] {
    color: #b91c1c;
  }
}
</style>

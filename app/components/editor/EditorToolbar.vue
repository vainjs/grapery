<script setup lang="ts">
import { ArrowRedoOutline, ArrowUndoOutline } from '@vicons/ionicons5'

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
      :bordered="false"
      :disabled="!editorReady"
      size="small"
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
          <NIcon :component="ArrowUndoOutline" />
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
          <NIcon :component="ArrowRedoOutline" />
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
        size="small"
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
  height: 42px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-bg);
}

.spacer,
.actions {
  display: flex;
  flex: 1;
}

.deviceSelect {
  width: 96px;
}

.actions {
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
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

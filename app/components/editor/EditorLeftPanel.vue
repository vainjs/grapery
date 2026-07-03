<script setup lang="ts">
import { ref } from 'vue'

const activePanel = defineModel<'blocks' | 'layers'>({ required: true })
const blockPanel = ref<HTMLElement | null>(null)
const layerPanel = ref<HTMLElement | null>(null)

defineExpose({
  getBlockPanel: () => blockPanel.value,
  getLayerPanel: () => layerPanel.value,
})
</script>

<template>
  <aside :class="$style.panel">
    <nav :class="$style.tabs">
      <NButton
        :class="$style.tab"
        :type="activePanel === 'blocks' ? 'primary' : 'default'"
        :secondary="activePanel === 'blocks'"
        :quaternary="activePanel !== 'blocks'"
        @click="activePanel = 'blocks'"
      >
        区块
      </NButton>
      <NButton
        :class="$style.tab"
        :type="activePanel === 'layers' ? 'primary' : 'default'"
        :secondary="activePanel === 'layers'"
        :quaternary="activePanel !== 'layers'"
        @click="activePanel = 'layers'"
      >
        图层
      </NButton>
    </nav>
    <div
      ref="blockPanel"
      :class="$style.manager"
      :hidden="activePanel !== 'blocks'"
    />
    <div
      ref="layerPanel"
      :class="$style.manager"
      :hidden="activePanel !== 'layers'"
    />
  </aside>
</template>

<style module lang="less">
.panel {
  display: flex;
  width: 248px;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--app-border);
  background: var(--app-surface-subtle);
}

.tabs {
  display: flex;
  height: 56px;
  flex-shrink: 0;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--app-border);
}

.tab {
  flex: 1;
}

.manager {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

@media (max-width: 900px) {
  .panel {
    width: 200px;
  }
}
</style>

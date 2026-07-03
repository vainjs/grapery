<script setup lang="ts">
import { ref } from 'vue'

const activePanel = defineModel<'traits' | 'styles'>({ required: true })
const traitPanel = ref<HTMLElement | null>(null)
const stylePanel = ref<HTMLElement | null>(null)

defineExpose({
  getTraitPanel: () => traitPanel.value,
  getStylePanel: () => stylePanel.value,
})
</script>

<template>
  <aside :class="$style.panel">
    <nav :class="$style.tabs">
      <NButton
        :class="$style.tab"
        :type="activePanel === 'traits' ? 'primary' : 'default'"
        :secondary="activePanel === 'traits'"
        :quaternary="activePanel !== 'traits'"
        @click="activePanel = 'traits'"
      >
        属性
      </NButton>
      <NButton
        :class="$style.tab"
        :type="activePanel === 'styles' ? 'primary' : 'default'"
        :secondary="activePanel === 'styles'"
        :quaternary="activePanel !== 'styles'"
        @click="activePanel = 'styles'"
      >
        样式
      </NButton>
    </nav>
    <div
      ref="traitPanel"
      :class="$style.manager"
      :hidden="activePanel !== 'traits'"
    />
    <div
      ref="stylePanel"
      :class="$style.manager"
      :hidden="activePanel !== 'styles'"
    />
  </aside>
</template>

<style module lang="less">
.panel {
  display: flex;
  width: 288px;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--app-border);
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
    width: 240px;
  }
}
</style>

<script setup lang="ts">
const themeOverrides = {
  common: {
    primaryColor: '#4F46E5',
  },
  Tabs: {
    tabBorderColor: 'var(--app-border)',
  },
}
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :class="$style.app"
  >
    <NuxtPage />
  </NConfigProvider>
</template>

<style module>
.app {
  width: 100%;
  height: 100%;
}
</style>

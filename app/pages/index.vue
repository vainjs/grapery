<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main :class="$style.page">
    <section :class="$style.intro">
      <span :class="$style.logo">G</span>
      <h1>Grapery</h1>
      <p>使用 GrapesJS 与 Vue 构建、编辑并保存你的页面。</p>
      <NButton
        type="primary"
        size="large"
        @click="router.push('/editor')"
      >
        进入编辑器
      </NButton>
    </section>
  </main>
</template>

<style module lang="less">
.page {
  display: grid;
  min-height: 100%;
  place-items: center;
  padding: 64px 24px;
  color: var(--app-text-strong);
  background: var(--app-surface-subtle);
}

.intro {
  display: flex;
  width: 100%;
  max-width: 512px;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    margin: 32px 0 0;
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1;
  }

  p {
    max-width: 448px;
    margin: 16px 0 32px;
    color: var(--app-text-muted);
    font-size: 18px;
    line-height: 1.75;
  }
}

.logo {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 8px;
  color: white;
  background: var(--app-primary);
  font-size: 16px;
  font-weight: 700;
}
</style>

<script setup lang="ts">
import type { Editor, ProjectData } from 'grapesjs'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import EditorRightPanel from './editor/EditorRightPanel.vue'
import EditorLeftPanel from './editor/EditorLeftPanel.vue'
import EditorToolbar from './editor/EditorToolbar.vue'

type SaveStatus = 'clean' | 'dirty' | 'saving' | 'error'
interface StoredProjectResponse {
  project: ProjectData
  updatedAt: string | null
}
const editorRoot = ref<HTMLElement | null>(null)
const leftPanel = ref<InstanceType<typeof EditorLeftPanel> | null>(null)
const rightPanel = ref<InstanceType<typeof EditorRightPanel> | null>(null)
const editor = ref<Editor | null>(null)
const activeLeftPanel = ref<'blocks' | 'layers'>('blocks')
const activeRightPanel = ref<'traits' | 'styles'>('traits')
const activeDevice = ref('Desktop')
const saveStatus = ref<SaveStatus>('clean')
const statusMessage = ref('正在加载项目…')
const loadError = ref('')
const canUndo = ref(false)
const canRedo = ref(false)
let acceptingUpdates = false

const saveLabel = computed(
  () =>
    ({
      clean: statusMessage.value || '已保存',
      dirty: '未保存',
      saving: '保存中…',
      error: '保存失败',
    })[saveStatus.value]
)

function refreshHistoryState() {
  canUndo.value = Boolean(editor.value?.UndoManager.hasUndo())
  canRedo.value = Boolean(editor.value?.UndoManager.hasRedo())
}

async function initializeEditor() {
  loadError.value = ''
  statusMessage.value = '正在加载项目…'
  acceptingUpdates = false
  editor.value?.destroy()
  editor.value = null
  await nextTick()

  const editorContainer = editorRoot.value
  const blockPanel = leftPanel.value?.getBlockPanel()
  const layerPanel = leftPanel.value?.getLayerPanel()
  const traitPanel = rightPanel.value?.getTraitPanel()
  const stylePanel = rightPanel.value?.getStylePanel()

  if (
    !editorContainer ||
    !blockPanel ||
    !layerPanel ||
    !traitPanel ||
    !stylePanel
  ) {
    loadError.value = '编辑器容器尚未准备好。'
    return
  }

  try {
    const [{ default: grapesjs }, stored] = await Promise.all([
      import('grapesjs'),
      $fetch<StoredProjectResponse>('/api/projects/default'),
    ])

    const instance = grapesjs.init({
      container: editorContainer,
      height: '100%',
      width: 'auto',
      projectData: stored.project,
      storageManager: false,
      panels: { defaults: [] },
      blockManager: {
        appendTo: blockPanel,
        blocks: [
          {
            id: 'section',
            label: '容器',
            category: '基础',
            content: {
              tagName: 'section',
              style: { padding: '48px 32px', 'min-height': '160px' },
              components:
                '<h2>新的内容区块</h2><p>从右侧面板调整内容与样式。</p>',
            },
          },
          {
            id: 'text',
            label: '文本',
            category: '基础',
            content: '<p style="padding: 12px">双击编辑文本</p>',
          },
          {
            id: 'button',
            label: '按钮',
            category: '基础',
            content:
              '<a href="#" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#4f46e5;color:white;text-decoration:none">行动按钮</a>',
          },
          {
            id: 'image',
            label: '图片',
            category: '基础',
            activate: true,
            content: { type: 'image' },
          },
        ],
      },
      layerManager: { appendTo: layerPanel },
      traitManager: { appendTo: traitPanel },
      selectorManager: { appendTo: stylePanel },
      styleManager: {
        appendTo: stylePanel,
        sectors: [
          {
            name: '布局',
            open: true,
            buildProps: [
              'display',
              'position',
              'width',
              'height',
              'margin',
              'padding',
            ],
          },
          {
            name: '排版',
            open: false,
            buildProps: [
              'font-family',
              'font-size',
              'font-weight',
              'color',
              'line-height',
              'text-align',
            ],
          },
          {
            name: '装饰',
            open: false,
            buildProps: [
              'background-color',
              'border',
              'border-radius',
              'box-shadow',
              'opacity',
            ],
          },
        ],
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
          { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
        ],
      },
    })

    editor.value = instance
    activeDevice.value = 'Desktop'
    statusMessage.value = stored.updatedAt ? '已保存' : '尚未保存'
    saveStatus.value = 'clean'

    instance.on('update', () => {
      refreshHistoryState()
      if (acceptingUpdates && saveStatus.value !== 'saving')
        saveStatus.value = 'dirty'
    })
    instance.on('undo redo', refreshHistoryState)
    instance.on('load', refreshHistoryState)

    window.setTimeout(() => {
      acceptingUpdates = true
      refreshHistoryState()
    }, 0)
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : '无法加载编辑器。'
    statusMessage.value = ''
  }
}

async function saveProject() {
  if (!editor.value || saveStatus.value === 'saving') return

  saveStatus.value = 'saving'
  try {
    await $fetch('/api/projects/default', {
      method: 'PUT',
      body: { project: editor.value.getProjectData() },
    })
    saveStatus.value = 'clean'
    statusMessage.value = '已保存'
  } catch {
    saveStatus.value = 'error'
    statusMessage.value = '保存请求失败'
  }
}

function undo() {
  editor.value?.UndoManager.undo()
  refreshHistoryState()
}

function redo() {
  editor.value?.UndoManager.redo()
  refreshHistoryState()
}

function selectDevice(device: string) {
  editor.value?.setDevice(device)
  activeDevice.value = device
}

onMounted(initializeEditor)
onBeforeUnmount(() => {
  acceptingUpdates = false
  editor.value?.destroy()
  editor.value = null
})
</script>

<template>
  <main :class="$style.workbench">
    <EditorLeftPanel
      ref="leftPanel"
      v-model="activeLeftPanel"
    />
    <section :class="$style.center">
      <EditorToolbar
        :editor-ready="Boolean(editor)"
        :active-device="activeDevice"
        :save-status="saveStatus"
        :save-label="saveLabel"
        :can-redo="canRedo"
        :can-undo="canUndo"
        @select-device="selectDevice"
        @save="saveProject"
        @redo="redo"
        @undo="undo"
      />

      <div :class="$style.canvasArea">
        <div
          ref="editorRoot"
          :class="$style.editorRoot"
        />
        <section
          v-if="!editor"
          :class="$style.loading"
          aria-live="polite"
        >
          <NSpin size="medium" />
          <p>{{ statusMessage }}</p>
        </section>
      </div>
    </section>
    <EditorRightPanel
      ref="rightPanel"
      v-model="activeRightPanel"
    />
  </main>
</template>

<style module lang="less">
.workbench {
  display: flex;
  width: 100%;
  height: 100%;
  color: var(--app-text);
  background: var(--app-canvas);
}

.center {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.canvasArea {
  position: relative;
  flex: 1;
  background: var(--app-canvas);
}

.editorRoot {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--app-surface);
}

.loading {
  position: absolute;
  inset: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  border: 1px solid var(--app-border-strong);
  border-radius: 12px;
  background: rgb(248 250 252 / 95%);
  text-align: center;

  p {
    margin: 12px 0 0;
    color: var(--app-text-muted);
  }
}
</style>

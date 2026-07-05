<script setup lang="ts">
import type { Editor, ProjectData } from 'grapesjs'
import {
  AddOutline,
  CheckmarkOutline,
  CloseOutline,
  CreateOutline,
  TrashOutline,
} from '@vicons/ionicons5'
import { NCollapseItem } from 'naive-ui'
import { createEditorConfig } from '../config/grapes-editor'
import EditorToolbar from './editor/EditorToolbar.vue'

type SaveStatus = 'clean' | 'dirty' | 'saving' | 'error'
type LeftPanelName = 'blocks' | 'pages'
type RightPanelName = 'styles' | 'traits'

type StoredProjectResponse = {
  project: ProjectData
  updatedAt: string | null
}
const editorRoot = ref<HTMLElement | null>(null)
const blockPanel = useTemplateRef<HTMLElement>('blockPanel')
const layerPanel = useTemplateRef<HTMLElement>('layerPanel')
const traitPanel = useTemplateRef<HTMLElement>('traitPanel')
const stylePanel = useTemplateRef<HTMLElement>('stylePanel')
const editor = shallowRef<Editor | null>(null)
const activeLeftPanel = ref<LeftPanelName>('pages')
const activeRightPanel = ref<RightPanelName>('traits')
const activeDevice = ref('Desktop')
const saveStatus = ref<SaveStatus>('clean')
const statusMessage = ref('正在加载项目…')
const loadError = ref('')
const canUndo = ref(false)
const canRedo = ref(false)
let acceptingUpdates = false

const {
  pages,
  activePageId,
  pageName,
  pageNameError,
  pageToRename,
  pageToDelete,
  canDeletePage,
  addPage,
  selectPage,
  startRenamePage,
  cancelRenamePage,
  submitPageName,
  requestDeletePage,
  cancelDeletePage,
  confirmDeletePage,
} = useGrapesPages(editor)
useGrapesLayers(editor)

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
  const blockPanelElement = blockPanel.value
  const layerPanelElement = layerPanel.value
  const traitPanelElement = traitPanel.value
  const stylePanelElement = stylePanel.value

  if (
    !editorContainer ||
    !blockPanelElement ||
    !layerPanelElement ||
    !traitPanelElement ||
    !stylePanelElement
  ) {
    loadError.value = '编辑器容器尚未准备好。'
    statusMessage.value = ''
    return
  }

  for (const panel of [
    blockPanelElement,
    layerPanelElement,
    traitPanelElement,
    stylePanelElement,
  ]) {
    panel.replaceChildren()
  }

  try {
    const [{ default: grapesjs }, stored] = await Promise.all([
      import('grapesjs'),
      $fetch<StoredProjectResponse>('/api/projects/default'),
    ])

    const instance = grapesjs.init(
      createEditorConfig({
        projectData: stored.project,
        targets: {
          blockPanel: blockPanelElement,
          editorContainer,
          layerPanel: layerPanelElement,
          stylePanel: stylePanelElement,
          traitPanel: traitPanelElement,
        },
      })
    )
    stylePanelElement.prepend(instance.SelectorManager.render([]))

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

async function mountManagerPanels() {
  activeLeftPanel.value = 'blocks'
  activeRightPanel.value = 'styles'
  await nextTick()

  activeLeftPanel.value = 'pages'
  activeRightPanel.value = 'traits'
  await nextTick()

  await initializeEditor()
}

onMounted(mountManagerPanels)
onBeforeUnmount(() => {
  acceptingUpdates = false
  editor.value?.destroy()
  editor.value = null
})
</script>

<template>
  <main :class="$style.workbench">
    <aside :class="$style.leftPanel">
      <NTabs
        v-model:value="activeLeftPanel"
        justify-content="space-evenly"
        type="line"
        animated
      >
        <NTabPane
          display-directive="show"
          name="pages"
          tab="页面"
        >
          <NCollapse
            :default-expanded-names="['pages', 'layers']"
            :trigger-areas="['main', 'arrow']"
          >
            <NCollapseItem
              :class="$style.pageCollapse"
              display-directive="show"
              name="pages"
              title="页面"
            >
              <template #header-extra>
                <NButton
                  aria-label="新增页面"
                  title="新增页面"
                  size="small"
                  quaternary
                  circle
                  @click.prevent="addPage"
                >
                  <template #icon>
                    <NIcon :component="AddOutline" />
                  </template>
                </NButton>
              </template>
              <div :class="$style.pageList">
                <div
                  v-for="page in pages"
                  :key="page.id"
                  :class="[
                    $style.pageRow,
                    page.id === activePageId && $style.pageRowActive,
                  ]"
                  role="button"
                  tabindex="0"
                  @click="selectPage(page.id)"
                  @keydown.enter="selectPage(page.id)"
                  @keydown.space.prevent="selectPage(page.id)"
                >
                  <NInput
                    v-if="page.id === pageToRename"
                    v-model:value="pageName"
                    :class="$style.pageNameInput"
                    autofocus
                    size="tiny"
                    :placeholder="pageNameError || '页面名称'"
                    :status="pageNameError ? 'error' : undefined"
                    @click.stop
                    @keydown.enter.stop="submitPageName"
                    @keydown.esc.stop="cancelRenamePage"
                  />
                  <span
                    v-else
                    :class="$style.pageName"
                  >
                    {{ page.getName() }}
                  </span>
                  <span
                    v-if="page.id === pageToRename"
                    :class="$style.pageActions"
                  >
                    <NButton
                      aria-label="确认重命名"
                      title="确认"
                      size="tiny"
                      quaternary
                      circle
                      @click.stop="submitPageName"
                    >
                      <template #icon>
                        <NIcon :component="CheckmarkOutline" />
                      </template>
                    </NButton>
                    <NButton
                      aria-label="取消重命名"
                      title="取消"
                      size="tiny"
                      quaternary
                      circle
                      @click.stop="cancelRenamePage"
                    >
                      <template #icon>
                        <NIcon :component="CloseOutline" />
                      </template>
                    </NButton>
                  </span>
                  <span
                    v-else-if="page.id === pageToDelete"
                    :class="$style.inlineConfirm"
                    @click.stop
                  >
                    <NButton
                      size="tiny"
                      type="error"
                      secondary
                      @click="confirmDeletePage"
                    >
                      删除
                    </NButton>
                    <NButton
                      size="tiny"
                      quaternary
                      @click="cancelDeletePage"
                    >
                      取消
                    </NButton>
                  </span>
                  <span
                    v-else
                    :class="$style.pageActions"
                  >
                    <NButton
                      aria-label="重命名页面"
                      title="重命名"
                      size="tiny"
                      quaternary
                      circle
                      @click.stop="startRenamePage(page.id)"
                    >
                      <template #icon>
                        <NIcon :component="CreateOutline" />
                      </template>
                    </NButton>
                    <NButton
                      aria-label="删除页面"
                      title="删除"
                      size="tiny"
                      quaternary
                      circle
                      :disabled="!canDeletePage"
                      @click.stop="requestDeletePage(page.id)"
                    >
                      <template #icon>
                        <NIcon :component="TrashOutline" />
                      </template>
                    </NButton>
                  </span>
                </div>
              </div>
            </NCollapseItem>
            <NCollapseItem
              :class="$style.pageCollapse"
              display-directive="show"
              name="layers"
              title="图层"
            >
              <div ref="layerPanel" />
            </NCollapseItem>
          </NCollapse>
        </NTabPane>
        <NTabPane
          :style="{ paddingTop: 0 }"
          display-directive="show"
          name="blocks"
          tab="组件"
        >
          <div ref="blockPanel" />
        </NTabPane>
      </NTabs>
    </aside>
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
      <main :class="$style.canvas">
        <div
          ref="editorRoot"
          :class="$style.editorRoot"
        />
        <section
          v-if="!editor"
          :class="$style.loading"
        >
          <NSpin
            v-if="!loadError"
            size="medium"
          />
          <p>{{ loadError || statusMessage }}</p>
          <NButton
            v-if="loadError"
            type="primary"
            @click="initializeEditor"
          >
            重试
          </NButton>
        </section>
      </main>
    </section>
    <aside :class="$style.rightPanel">
      <NTabs
        v-model:value="activeRightPanel"
        justify-content="space-evenly"
        type="line"
        animated
      >
        <NTabPane
          display-directive="show"
          name="traits"
          tab="属性"
        >
          <div ref="traitPanel" />
        </NTabPane>
        <NTabPane
          display-directive="show"
          name="styles"
          tab="样式"
        >
          <div ref="stylePanel" />
        </NTabPane>
      </NTabs>
    </aside>
  </main>
</template>

<style module lang="less">
.workbench {
  display: flex;
  width: 100%;
  height: 100%;

  .leftPanel {
    display: flex;
    width: 300px;
    flex-shrink: 0;
    flex-direction: column;
    border-right: 1px solid var(--app-border);

    .pageList {
      max-height: 220px;
      overflow: auto;
    }

    .pageCollapse {
      :global(.n-collapse-item__content-inner) {
        padding-top: 10px;
      }
    }

    .pageRow {
      display: flex;
      width: 100%;
      height: 40px;
      align-items: center;
      padding: 0 10px 0 16px;
      border: 0;
      background: transparent;
      color: var(--app-text);
      cursor: pointer;
      font: inherit;
      text-align: left;

      &:hover {
        background: color-mix(in srgb, var(--app-primary) 14%, transparent);
      }

      &:focus-visible {
        outline: 2px solid var(--app-primary);
        outline-offset: -2px;
      }

      &Active {
        background: var(--app-bg-selected);
        color: var(--app-primary);
      }
    }

    .pageName {
      min-width: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &Input {
        min-width: 0;
        flex: 1;
        margin-right: 4px;
      }
    }

    .pageActions,
    .inlineConfirm {
      display: flex;
      flex-shrink: 0;
    }

    .pageActions {
      gap: 2px;
    }

    .inlineConfirm {
      gap: 4px;
    }
  }

  .center {
    display: flex;
    flex: 1;
    flex-direction: column;

    .canvas {
      position: relative;
      height: 0;
      flex: 1;

      .editorRoot {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        padding: 32px;
        text-align: center;
        transform: translate(-50%, -50%);

        p {
          margin: 12px 0 0;
          color: var(--app-text-muted);
        }

        button {
          margin-top: 16px;
        }
      }
    }
  }

  .rightPanel {
    display: flex;
    width: 300px;
    flex-shrink: 0;
    flex-direction: column;
    border-left: 1px solid var(--app-border);
  }
}
</style>

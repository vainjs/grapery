import type { Editor, Page } from 'grapesjs'

export function useGrapesPages(editor: Ref<Editor | null>) {
  const activePageId = ref<Page['id']>('')
  const pages = shallowRef<Page[]>([])
  const pageName = ref('')
  const pageNameError = ref('')
  const pageToRename = ref('')
  const pageToDelete = ref('')
  const canDeletePage = computed(() => pages.value.length > 1)

  function cancelRenamePage() {
    pageToRename.value = ''
    pageName.value = ''
    pageNameError.value = ''
  }

  function resetPageActions() {
    cancelRenamePage()
    pageToDelete.value = ''
  }

  watch(
    editor,
    (instance, _, onCleanup) => {
      resetPageActions()
      if (!instance) {
        pages.value = []
        activePageId.value = ''
        return
      }

      const syncPages = () => {
        pages.value = [...instance.Pages.getAll()]
        activePageId.value = instance.Pages.getSelected()?.id ?? ''
      }

      syncPages()
      instance.on('page', syncPages)

      onCleanup(() => {
        instance.off('page', syncPages)
      })
    },
    { flush: 'sync', immediate: true }
  )

  function addPage() {
    const pm = editor.value?.Pages
    if (!pm) return

    const len = pm.getAll().length
    pm.add({
      name: `新页面 ${len + 1}`,
      component: `<div>新页面 ${len + 1}</div>`,
    })
  }

  function selectPage(pageId: string | number) {
    editor.value?.Pages.select(String(pageId))
  }

  function startRenamePage(pageId: string) {
    const page = pages.value.find(item => item.id === pageId)
    if (!page) return

    pageToRename.value = pageId
    pageName.value = page.getName()
    pageNameError.value = ''
    pageToDelete.value = ''
  }

  function submitPageName() {
    const name = pageName.value.trim()
    if (!name) {
      pageNameError.value = '请输入页面名称'
      return
    }

    editor.value?.Pages.get(pageToRename.value)?.setName(name)
    cancelRenamePage()
  }

  function requestDeletePage(pageId: string) {
    cancelRenamePage()
    pageToDelete.value = pageId
  }

  function cancelDeletePage() {
    pageToDelete.value = ''
  }

  function confirmDeletePage() {
    const pm = editor.value?.Pages
    if (!pm || pm.getAll().length <= 1) return

    const pageId = pageToDelete.value
    const wasSelected = pm.getSelected()?.id === pageId
    pm.remove(pageId)
    if (wasSelected) {
      const nextPage = pm.getAll()[0]
      if (nextPage) pm.select(nextPage)
    }
    pageToDelete.value = ''
  }

  return {
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
  }
}

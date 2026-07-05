import type { Component, Editor } from 'grapesjs'

type LayerRenderEvent = {
  component: Component
}

export function useGrapesLayers(editor: Ref<Editor | null>) {
  watch(
    editor,
    (instance, _, onCleanup) => {
      if (!instance) return

      const openRenderedLayer = ({ component }: LayerRenderEvent) => {
        if (
          instance.Layers.getComponents(component).length &&
          !instance.Layers.isOpen(component)
        )
          instance.Layers.setOpen(component, true)
      }

      instance.on('layer:render', openRenderedLayer)

      onCleanup(() => {
        instance.off('layer:render', openRenderedLayer)
      })
    },
    { flush: 'sync', immediate: true }
  )
}

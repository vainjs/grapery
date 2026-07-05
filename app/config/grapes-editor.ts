import type { EditorConfig, ProjectData } from 'grapesjs'

type EditorTargets = {
  editorContainer: HTMLElement
  blockPanel: HTMLElement
  layerPanel: HTMLElement
  stylePanel: HTMLElement
  traitPanel: HTMLElement
}

type CreateEditorConfigOptions = {
  projectData: ProjectData
  targets: EditorTargets
}

export function createEditorConfig({
  projectData,
  targets,
}: CreateEditorConfigOptions): EditorConfig {
  return {
    container: targets.editorContainer,
    height: '100%',
    projectData,
    storageManager: false,
    panels: { defaults: [] },
    blockManager: {
      appendTo: targets.blockPanel,
      blocks: [
        {
          id: 'section',
          label: '容器',
          category: '基础',
          content: {
            type: 'default',
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
          content: {
            type: 'text',
            content: '双击编辑文本',
            style: { padding: '12px' },
          },
        },
        {
          id: 'link',
          label: '链接',
          category: '基础',
          content: {
            type: 'link',
            content: '链接',
            attributes: { href: '#' },
          },
        },
        {
          id: 'button',
          label: '按钮',
          category: '基础',
          content: {
            type: 'link',
            content: '行动按钮',
            attributes: { href: '#' },
            style: {
              display: 'inline-block',
              padding: '12px 20px',
              'border-radius': '8px',
              background: '#4f46e5',
              color: 'white',
              'text-decoration': 'none',
            },
          },
        },
        {
          id: 'image',
          label: '图片',
          category: '基础',
          activate: true,
          content: { type: 'image' },
        },
        {
          id: 'video',
          label: '视频',
          category: '基础',
          content: { type: 'video' },
        },
        {
          id: 'map',
          label: '地图',
          category: '基础',
          content: { type: 'map' },
        },
      ],
    },
    layerManager: { appendTo: targets.layerPanel },
    traitManager: { appendTo: targets.traitPanel },
    styleManager: {
      appendTo: targets.stylePanel,
      sectors: [
        {
          name: '布局',
          open: true,
          buildProps: ['display'],
        },
        {
          name: '尺寸',
          open: false,
          buildProps: [
            'width',
            'height',
            'min-width',
            'min-height',
            'max-width',
            'max-height',
          ],
        },
        {
          name: '间距',
          open: false,
          buildProps: ['margin', 'padding'],
        },
        {
          name: '定位',
          open: false,
          buildProps: ['position', 'top', 'right', 'bottom', 'left'],
        },
        {
          name: '排版',
          open: false,
          buildProps: [
            'font-family',
            'font-size',
            'font-weight',
            'line-height',
            'letter-spacing',
            'color',
            'text-align',
            'text-decoration',
          ],
        },
        {
          name: '背景',
          open: false,
          buildProps: ['background-color', 'background-image'],
        },
        {
          name: '边框',
          open: false,
          buildProps: ['border', 'border-radius'],
        },
        {
          name: '效果',
          open: false,
          buildProps: ['opacity', 'box-shadow'],
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
  }
}

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ source: string }>()
const { isDark } = useData()
const svg = ref('')
const error = ref('')
const instanceId = getCurrentInstance()!.uid
let revision = 0

async function renderDiagram() {
  const current = ++revision
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      // Diagrams in the shared ink-on-paper language: square boxes, ink lines, Plex type.
      theme: 'base',
      themeVariables: isDark.value
        ? { background: '#141410', primaryColor: '#1a1a15', primaryTextColor: '#fffef0', primaryBorderColor: '#fffef0', lineColor: '#fffef0', secondaryColor: '#24241d', tertiaryColor: '#1a1a15', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: '13px' }
        : { background: '#fcfbf7', primaryColor: '#f4f3ec', primaryTextColor: '#1c1b17', primaryBorderColor: '#1c1b17', lineColor: '#1c1b17', secondaryColor: '#ebeae0', tertiaryColor: '#f4f3ec', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: '13px' },
      // A wide flowchart squeezed into the content column renders its labels
      // too small to read. Draw at natural size instead and let the wrapper's
      // overflow-x carry it.
      flowchart: { useMaxWidth: false },
    })
    const id = `mermaid-${instanceId}-${current}`
    const result = await mermaid.render(id, props.source)
    if (current !== revision) return
    svg.value = result.svg
    error.value = ''
  } catch (cause) {
    if (current !== revision) return
    svg.value = ''
    error.value = cause instanceof Error ? cause.message : String(cause)
  }
}

onMounted(() => {
  void renderDiagram()
  watch([() => props.source, isDark], renderDiagram)
})
</script>

<template>
  <div class="mermaid-diagram">
    <template v-if="error">
      <p role="alert">Unable to render diagram: {{ error }}</p>
      <pre>{{ source }}</pre>
    </template>
    <div v-else-if="svg" v-html="svg" />
    <p v-else role="status">Loading diagram…</p>
  </div>
</template>

<style scoped>
.mermaid-diagram {
  margin: 24px 0;
  overflow-x: auto;
  text-align: center;
}
.mermaid-diagram :deep(svg) {
  height: auto;
  margin: 0 auto;
}
</style>

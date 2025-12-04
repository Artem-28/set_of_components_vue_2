<template>
  <div class="wrapper">
    <svg
        class="svg-scene"
        @pointerdown="onBackgroundPointerDown"
        @wheel.prevent="onWheel"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#333"/>
        </marker>
      </defs>

      <g :transform="`translate(${pan.x},${pan.y}) scale(${scale})`">
        <rect :x="-bg/2" :y="-bg/2" :width="bg" :height="bg" fill="none" />

        <g stroke="#333" stroke-width="2" marker-end="url(#arrow)">
          <line
              v-for="(e, i) in edges"
              :key="i"
              :x1="nodesById[e.from].x + blockW/2"
              :y1="nodesById[e.from].y + blockH/2"
              :x2="nodesById[e.to].x   + blockW/2"
              :y2="nodesById[e.to].y   + blockH/2"
          />
        </g>
      </g>
    </svg>

    <div
        class="blocks-field"
        :style="fieldStyles"
    >
      <div
          class="block"
          v-for="n in nodes"
          :key="n.id"
          :style="{
            left: n.x - fieldPos.x + 'px',
            top:  n.y - fieldPos.y + 'px',
            width: blockW + 'px',
            height: blockH + 'px'
          }"
          @pointerdown.stop="startNodeDrag($event, n)"
      >
        {{ n.label }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'

/* ---------------- CONFIG ---------------- */
const blockW = 150
const blockH = 70
const bg = 20000

// шаги расширения/сжатия
const expandW = 800
const expandH = 400

/* ---------------- CAMERA ---------------- */
const pan = reactive({ x: 0, y: 0 })
const scale = ref(1)

/* ---------------- DATA ---------------- */
const nodes = reactive([
  { id: "a", x: 0,    y: 0,    label: "A" },
  { id: "b", x: 300,  y: 150,  label: "B" },
  { id: "c", x: -200, y: 200,  label: "C" }
])

const edges = reactive([
  { from: "a", to: "b" },
  { from: "b", to: "c" }
])

const nodesById = computed(() => {
  const m = {}
  nodes.forEach(n => m[n.id] = n)
  return m
})

/* ---------------- FIELD (resizable both ways) ---------------- */
const fieldPos = reactive({ x: -400, y: -300 })
const fieldSize = reactive({ width: 1200, height: 1000 })

/* --- calc bounding box of blocks --- */
function computeNodesBounds() {
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity

  for (const n of nodes) {
    minX = Math.min(minX, n.x)
    minY = Math.min(minY, n.y)
    maxX = Math.max(maxX, n.x + blockW)
    maxY = Math.max(maxY, n.y + blockH)
  }

  return { minX, minY, maxX, maxY }
}

/* --- shrink/expand field after drop --- */
function adjustFieldSize() {
  const { minX, minY, maxX, maxY } = computeNodesBounds()
  let changed = false

  // --- LEFT ---
  if (minX < fieldPos.x) {
    const diff = fieldPos.x - minX
    const steps = Math.ceil(diff / expandW)
    fieldPos.x -= steps * expandW
    fieldSize.width += steps * expandW
    changed = true
  } else {
    const diff = minX - fieldPos.x
    if (diff >= expandW) {
      const steps = Math.floor(diff / expandW)
      fieldPos.x += steps * expandW
      fieldSize.width -= steps * expandW
      changed = true
    }
  }

  // --- TOP ---
  if (minY < fieldPos.y) {
    const diff = fieldPos.y - minY
    const steps = Math.ceil(diff / expandH)
    fieldPos.y -= steps * expandH
    fieldSize.height += steps * expandH
    changed = true
  } else {
    const diff = minY - fieldPos.y
    if (diff >= expandH) {
      const steps = Math.floor(diff / expandH)
      fieldPos.y += steps * expandH
      fieldSize.height -= steps * expandH
      changed = true
    }
  }

  // --- RIGHT ---
  if (maxX > fieldPos.x + fieldSize.width) {
    const diff = maxX - (fieldPos.x + fieldSize.width)
    const steps = Math.ceil(diff / expandW)
    fieldSize.width += steps * expandW
    changed = true
  } else {
    const diff = (fieldPos.x + fieldSize.width) - maxX
    if (diff >= expandW) {
      const steps = Math.floor(diff / expandW)
      fieldSize.width -= steps * expandW
      changed = true
    }
  }

  // --- BOTTOM ---
  if (maxY > fieldPos.y + fieldSize.height) {
    const diff = maxY - (fieldPos.y + fieldSize.height)
    const steps = Math.ceil(diff / expandH)
    fieldSize.height += steps * expandH
    changed = true
  } else {
    const diff = (fieldPos.y + fieldSize.height) - maxY
    if (diff >= expandH) {
      const steps = Math.floor(diff / expandH)
      fieldSize.height -= steps * expandH
      changed = true
    }
  }

  return changed
}

const fieldStyles = computed(() => {
  // Цвета линий
  const minorColor = "rgba(0,0,0,0.04)"   // 10 px
  const midColor   = "rgba(0,0,0,0.07)"   // 50 px
  const majorColor = "rgba(0,0,0,0.12)"   // 100 px

  const images = []
  const sizes = []

  // === 1) MINOR GRID – 10px ===
  if (scale.value >= 1.2) {
    images.push(`
      repeating-linear-gradient(0deg,
        transparent 0px, transparent 9px, ${minorColor} 9px, ${minorColor} 10px)
    `)
    images.push(`
      repeating-linear-gradient(90deg,
        transparent 0px, transparent 9px, ${minorColor} 9px, ${minorColor} 10px)
    `)
    sizes.push("10px 10px")
    sizes.push("10px 10px")
  }

  // === 2) MID GRID – 50px ===
  if (scale.value >= 0.7) {
    images.push(`
      repeating-linear-gradient(0deg,
        transparent 0px, transparent 49px, ${midColor} 49px, ${midColor} 50px)
    `)
    images.push(`
      repeating-linear-gradient(90deg,
        transparent 0px, transparent 49px, ${midColor} 49px, ${midColor} 50px)
    `)
    sizes.push("50px 50px")
    sizes.push("50px 50px")
  }

  // === 3) MAJOR GRID – 100px ===
  images.push(`
    repeating-linear-gradient(0deg,
      transparent 0px, transparent 99px, ${majorColor} 99px, ${majorColor} 100px)
  `)
  images.push(`
    repeating-linear-gradient(90deg,
      transparent 0px, transparent 99px, ${majorColor} 99px, ${majorColor} 100px)
  `)
  sizes.push("100px 100px")
  sizes.push("100px 100px")

  const root = {
    transform:
        `translate(${pan.x}px, ${pan.y}px)
             scale(${scale.value})
             translate(${fieldPos.x}px, ${fieldPos.y}px)`,
    width: fieldSize.width + 'px',
    height: fieldSize.height + 'px'
  }

  return {
   ...root,
    backgroundImage: images.join(","),
    backgroundSize: sizes.join(","),
    backgroundRepeat: "repeat",
    pointerEvents: "none"
  }
})

/* ---------------- DRAG NODE ---------------- */
const drag = reactive({
  active: false,
  node: null,
  startX: 0, startY: 0,
  clientX: 0, clientY: 0
})

function startNodeDrag(e, node) {
  drag.active = true
  drag.node = node
  drag.startX = node.x
  drag.startY = node.y
  drag.clientX = e.clientX
  drag.clientY = e.clientY

  window.addEventListener("pointermove", onDrag)
  window.addEventListener("pointerup", onDragEnd)
}

function onDrag(e) {
  if (!drag.active) return
  const dx = (e.clientX - drag.clientX) / scale.value
  const dy = (e.clientY - drag.clientY) / scale.value

  drag.node.x = drag.startX + dx
  drag.node.y = drag.startY + dy
}

function onDragEnd() {
  drag.active = false

  // поле расширяется/сжимается только сейчас
  adjustFieldSize()

  drag.node = null

  window.removeEventListener("pointermove", onDrag)
  window.removeEventListener("pointerup", onDragEnd)
}

/* ---------------- PAN ---------------- */
const p = reactive({
  active: false,
  cx: 0, cy: 0,
  px: 0, py: 0
})

function onBackgroundPointerDown(e) {
  p.active = true
  p.cx = e.clientX
  p.cy = e.clientY
  p.px = pan.x
  p.py = pan.y

  window.addEventListener("pointermove", onPanMove)
  window.addEventListener("pointerup", onPanUp)
}

function onPanMove(e) {
  if (!p.active) return
  pan.x = p.px + (e.clientX - p.cx)
  pan.y = p.py + (e.clientY - p.cy)
}

function onPanUp() {
  p.active = false
  window.removeEventListener("pointermove", onPanMove)
  window.removeEventListener("pointerup", onPanUp)
}

/* ---------------- ZOOM ---------------- */
function onWheel(e) {
  const old = scale.value
  const factor = Math.exp(-e.deltaY * 0.001)
  const next = Math.min(3, Math.max(0.2, old * factor))

  const rect = e.target.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top

  const wx = (cx - pan.x) / old
  const wy = (cy - pan.y) / old

  pan.x = cx - wx * next
  pan.y = cy - wy * next

  scale.value = next
}
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.svg-scene {
  position: absolute;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.blocks-field {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  pointer-events: none;
  background: rgba(255,255,255,0.02);
  outline: 1px dashed #bbb;
}

.block {
  position: absolute;
  background: #fff;
  border: 1px solid #444;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: grab;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.block:active {
  cursor: grabbing;
}
</style>
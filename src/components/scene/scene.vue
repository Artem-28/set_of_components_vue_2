<template>
  <div
      ref="rootRef"
      class="base-scene-wrapper"
      @pointerdown="startCamera"
      @wheel="onwheel"
  >

    <svg ref="sceneRef" class="base-scene">
      <defs>
        <marker
            id="arrow-head"
            refX="8"
            refY="4"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
        >
          <polyline points="0,0 8,4 0,8 2,4 0,0" :fill="config.colorArrow" />
        </marker>
      </defs>
      <g :transform="`translate(${pan.x},${pan.y}) scale(${scale})`">
        <relation-line
            v-for="r in relations"
            :key="r.key"
            :from-key="r.fromKey"
            :to-key="r.toKey"
            :color="config.colorArrow"
        />
        <relation-line
            v-if="!!connection.fromKey.value"
            :from-key="connect.from"
            :to-key="connect.to"
            :float="connection.float.value"
            :color="config.colorArrow"
        />
      </g>
    </svg>

    <div :style="fieldStyle" class="base-scene-field">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, provide, onMounted } from "vue";
import RelationLine from "@/components/scene/relation/relation-line";
import { useStorage } from "@/composable";
import {useConnection} from "@/components/scene/use-connection.composable";

const emits = defineEmits(['create:relation'])

const config = {
  zoom: { max: 1, min: 0.3 },
  expand: { width: 600, height: 600 },
  colorArrow: '#185BDE',
  grid: [
    { size: 30, zoom: 1, color: 'rgba(225,225,225,0.05)' },
    { size: 60, zoom: 0.7, color: 'rgba(225,225,225,0.06)' },
    { size: 120, zoom: 0.3, color: 'rgba(225,225,225,0.12)' },
  ]
}

// CAMERA
const pan = ref({ x: 0, y: 0 });
const stateCamera = {
  active: false,
  cx: 0,
  cy: 0,
  px: 0,
  py: 0,
}

const rootRef = ref(null);
const sceneRef = ref(null);
const sceneOffset = ref({ x: 0, y: 0 });
const scale = ref(1);


const fieldPos = ref({ x: 0, y: 0 })
const fieldSize = ref({
  width: config.expand.width,
  height: config.expand.height,
})

const relations = ref({});

const blocks = useStorage();
const connections = useStorage();
const connection = useConnection(scale)

const connect = computed(() => {
  return {
    from: connection.fromKey.value,
    to: connection.toKey.value,
  }
})

const gridStyle = computed(() => {
  const images = [];
  const sizes = [];


  const append = (data) => {
    const { size, color } = data;
    const transparent = `${size - 1}px, ${color} ${size - 1}px, ${color} ${size}px`;

    images.push(`repeating-linear-gradient(0deg, transparent 0px, transparent ${transparent})`);
    images.push(`repeating-linear-gradient(90deg, transparent 0px, transparent ${transparent})`);

    sizes.push(`${size}px ${size}px`);
    sizes.push(`${size}px ${size}px`);
  }

  config.grid.forEach(grid => {
    if (scale.value >= grid.zoom) {
      append(grid);
    }
  })

  return {
    backgroundImage: images.join(","),
    backgroundSize: sizes.join(","),
    backgroundRepeat: "repeat",
  }
})

const fieldStyle = computed(() => {
  return {
    transform: `translate(${pan.value.x}px, ${pan.value.y}px) scale(${scale.value}) translate(${fieldPos.value.x}px, ${fieldPos.value.y}px)`,
    width: `${fieldSize.value.width}px`,
    height: `${fieldSize.value.height}px`,
    ...gridStyle.value,
  }
})

function zoom(factor, target) {
  const current = scale.value
  const value = Number((current - factor).toFixed(1));

  const { max, min } = config.zoom;
  const zoom = Math.min(max, Math.max(min, value))

  const { left, top } = sceneRef.value.getBoundingClientRect()

  const cx = target.x - left;
  const cy = target.y - top;
  const wx = (cx - pan.value.x) / current;
  const wy = (cy - pan.value.y) / current;

  pan.value.x = cx - wx * zoom;
  pan.value.y = cy - wy * zoom;

  scale.value = zoom;
}

function onwheel(e) {
  let factor = 0.1;
  if (e.deltaY < 0) factor *= - 1;

  zoom(factor, { x: e.clientX, y: e.clientY });
}

async function getBoundingBlocks() {
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity

  const data = await blocks.list();

  for (const b of data) {
    const { x, y } = b.position.value;
    const { width, height } = b.rect.value;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width / scale.value);
    maxY = Math.max(maxY, y + height / scale.value);
  }

  return { minX, minY, maxX, maxY };
}

function expandFieldLeft(minX) {
  const { x } = fieldPos.value;
  const expandW = config.expand.width;

  if (minX < x) {
    const diff = x - minX
    const steps = Math.ceil(diff / expandW)
    const width = steps * expandW;

    fieldPos.value.x -= width;
    fieldSize.value.width += width;
    return;
  }

  const diff = minX - x;
  if (expandW > diff) return;

  const steps = Math.floor(diff / expandW)
  const width = steps * expandW;

  fieldPos.value.x += width;
  fieldSize.value.width -= width;
}

function expandFieldTop(minY) {
  const { y } = fieldPos.value;
  const expandH = config.expand.height;

  if (minY < y) {
    const diff = y - minY;
    const steps = Math.ceil(diff / expandH);
    const height = steps * expandH;

    fieldPos.value.y -= height;
    fieldSize.value.height += height;
    return;
  }

  const diff = minY - y;
  if (expandH > diff) return;

  const steps = Math.floor(diff / expandH);
  const height = steps * expandH;

  fieldPos.value.y += height;
  fieldSize.value.height -= height;
}

function expandFieldRight(maxX) {
  const { x } = fieldPos.value;
  const { width } = fieldSize.value;
  const expandW = config.expand.width;

  if (maxX > x + width) {
    const diff = maxX - (x + width)
    const steps = Math.ceil(diff / expandW);

    fieldSize.value.width += steps * expandW;
    return;
  }

  const diff = x + width - maxX;
  if (expandW > diff) return;

  const steps = Math.floor(diff / expandW);
  fieldSize.value.width -= steps * expandW;
}

function expandFieldBottom(maxY) {
  const { y } = fieldPos.value;
  const { height } = fieldSize.value;
  const expandH = config.expand.height;

  if (maxY > y + height) {
    const diff = maxY - (y + height);
    const steps = Math.ceil(diff / expandH);

    fieldSize.value.height += steps * expandH;
    return;
  }

  const diff = y + height - maxY;
  if (expandH > diff) return;

  const steps = Math.floor(diff / expandH)
  fieldSize.value.height -= steps * expandH
}

async function updateSizeField() {
  const { minX, minY, maxX, maxY } = await getBoundingBlocks();

  expandFieldLeft(minX);
  expandFieldTop(minY);
  expandFieldRight(maxX);
  expandFieldBottom(maxY);
}

function moveCamera(e) {
  const { active, px, py, cx, cy } = stateCamera;
  if (!active) return
  pan.value.x = px + (e.clientX - cx);
  pan.value.y = py + (e.clientY - cy);
}

function stopCamera() {
  stateCamera.cx = 0;
  stateCamera.cy = 0;
  stateCamera.py = 0;
  stateCamera.px = 0;
  stateCamera.active = false;

  window.removeEventListener("pointermove", moveCamera)
  window.removeEventListener("pointerup", stopCamera)
}

function startCamera(e) {
  stateCamera.cx = e.clientX;
  stateCamera.cy = e.clientY;
  stateCamera.py = pan.value.y;
  stateCamera.px = pan.value.x;
  stateCamera.active = true;

  window.addEventListener("pointermove", moveCamera);
  window.addEventListener("pointerup", stopCamera);
}

function centerCamera() {

  const vw = sceneRef.value.clientWidth;
  const vh = sceneRef.value.clientHeight;

  const s = scale.value;

  const fw = fieldSize.value.width * s;
  const fh = fieldSize.value.height * s;

  const fx = fieldPos.value.x * s;
  const fy = fieldPos.value.y * s;

  pan.value.x = (vw - fw) / 2 - fx;
  pan.value.y = (vh - fh) / 2 - fy;
}

function createRelation(key, relation) {
  relations.value[key] = relation;
}

function onDropBlock() {
  updateSizeField();
}

function onMountedBlock(key, block) {
  blocks.save(key, block);
  updateSizeField();
}

function saveConnection(key, connection) {
  connections.save(key, connection);
}

async function getConnection(key) {
  const connection = await connections.get(key);
  const block = await blocks.get(connection.block);
  return { ...connection, block };
}

async function startConnection(from) {
  const relation = await connection.start(from);
  if (!relation) return;
  createRelation(relation.key, relation);
}

function updateConnection(targetKey) {
  connection.updateTarget(targetKey)
}

provide('_scene_', {
  scale: computed(() => scale.value),
  offset: computed(() => sceneOffset.value),
  fieldPos: computed(() => fieldPos.value),
  connect,
  onDropBlock,
  onMountedBlock,
  createRelation,
  saveConnection,
  getConnection,
  startConnection,
  updateConnection,
})

onMounted(() => {
  requestAnimationFrame(centerCamera)
  const { x, y } = sceneRef.value.getBoundingClientRect();
  sceneOffset.value = { x, y };
})

</script>

<style lang="scss" scoped>
.base-scene-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid white;
  background-color: black;
  color: white;
}

.base-scene {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.base-scene-field {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  background: rgba(255,255,255,0.02);
  outline: 2px solid rgba(225,225,225,0.12);
  color: white;
  z-index: 100;
}
</style>
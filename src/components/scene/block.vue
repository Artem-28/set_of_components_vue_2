<template>
  <div
      ref="rootRef"
      :style="rootStyle"
      class="base-block"
      @pointerdown.stop="start"
  >
    <slot />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, inject, provide, onBeforeUnmount } from 'vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
  blockKey: {
    type: String,
    required: true,
  }
})

const scene = inject('_scene_', {});
const key = props.block[props.blockKey];

const startData = {
  startX: 0,
  startY: 0,
  clientX: 0,
  clientY: 0,
}

const rootRef = ref(null);
const moved = ref(false);
const position = ref({ x: 0, y: 0 });
const rootRect = ref({ width: 0, height: 0, x: 0, y: 0 });

const rootStyle = computed(() => {
  const offset = scene.fieldPos.value;
  return {
    left: `${position.value.x - offset.x}px`,
    top:  `${position.value.y - offset.y}px`,
  }
})

const instance = {
  key,
  position: computed(() => position.value),
  rect: computed(() => rootRect.value),
}

function updateSize() {
  const { width, height, x, y } = rootRef.value.getBoundingClientRect();
  rootRect.value = { width, height, x, y };
}

function drag(e) {
  if (!moved.value) return
  const dx = (e.clientX - startData.clientX) / scene.scale.value;
  const dy = (e.clientY - startData.clientY) / scene.scale.value;

  position.value = {
    x: startData.startX + dx,
    y: startData.startY + dy,
  };
}

function drop() {
  if (moved.value) scene.onDropBlock(key, { ...position.value });

  moved.value = false

  startData.startX = 0;
  startData.startY = 0;
  startData.clientX = 0;
  startData.clientY = 0;

  window.removeEventListener("pointermove", drag)
  window.removeEventListener("pointerup", drop)
}

function start(e) {
  moved.value = true;

  startData.startX = position.value.x;
  startData.startY = position.value.y;
  startData.clientX = e.clientX;
  startData.clientY = e.clientY;

  window.addEventListener("pointermove", drag);
  window.addEventListener("pointerup", drop);
}


function initPosition() {
  const pos = { x: 0, y: 0 };
  const { x, y } = props.block;
  if (typeof x === "number") pos.x = x;
  if (typeof y === 'number') pos.y = y;

  position.value = pos;
}

initPosition();

provide('_block_', instance)

onMounted(() => {
 updateSize();
 scene.onMountedBlock(key, instance);
})

onBeforeUnmount(() => scene.onRemoveBlock(key))
</script>

<style scoped lang="scss">
.base-block {
  position: absolute;
  cursor: grab;
  user-select: none;
}

.base-block:active {
  cursor: grabbing;
}
</style>
<template>
  <div class="page">
    <scene  @create:relation="createRelation">
      <constructor-block
          v-for="b in nodes"
          :key="b.id"
          :block="b"
      />
    </scene>
  </div>
</template>

<script setup>
import Scene from "@/components/scene/scene.vue";
import {computed, ref} from "vue";
import ConstructorBlock from "@/components/constructor-block.vue";

const nodes = ref([
  {
    id: "b_a",
    label: "A",
    x: 600,
    y: 300,
    buttons: [
      { id: 'b_a_1',  next_block_id: 'b_b' },
      // { id: 'b_a_2',  next_block_id: 'b_c' },
      // { id: 'b_a_3',  next_block_id: 'b_d' }
    ]
  },
  {
    id: "b_b",
    label: "B",
    x: 1200,
    y: 500,
  },
  {
    id: "b_c",
    label: "C",
    x: -100,
    y: 700,
  },
  // {
  //   id: "b_d",
  //   label: "D",
  //   x: 200,
  //   y: 900,
  //   // buttons: [
  //   //   { id: 'b_d_1',  next_block_id: 'b_b' },
  //   // ]
  // }
])

const blocks = computed(() => {
  const data = [];



  const blockA = {
    id: "a",
    label: "A",
    x: 0,
    y: 0,
    buttons: [
      // { id: 'b_a_1', label: 'Переход к блоку B', next_block_id: 'button_b_b_1' },
      // { id: 'b_a_2', label: 'Переход к блоку E', next_block_id: 'button_b_b_1' },
    ]
  }

  const count = 1;

  for (let i = 0; i < count; i++) {
    blockA.buttons.push({
      id: `b_a_${i}`,
      label: `Переход к Блоку ${i}`,
      next_block_id: `b_${i}`,
    })

    data.push({
      id: `b_${i}`,
      label: `Блок ${i}`,
      x: 450,
      y: (i + 1) * 150 + 20,
      next_block_id: `c_${i}`,
    })

    data.push({
      id: `c_${i}`,
      label: `Блок C ${i}`,
      x: 800,
      // y: i * 150 + 20,
      y: (i + 1) * 150 + 20,
    })


  }


  // data.push(blockA)
  return data;
})


function createRelation(r) {
  const idx = nodes.value.findIndex((n) => n.id === r.fromKey);
  if (idx < 0) return;

  const node = { ...nodes.value[idx] };

  if (!node.buttons) node.buttons = [];

  node.buttons = [...node.buttons]

  node.buttons.push({
    id: `${r.fromKey}_${node.buttons.length + 1}`,
    next_block_id: r.toKey,
  })

  nodes.value.splice(idx, 1, node)
  console.log(nodes.value);
}
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: black;
}
</style>

<style>
.scene-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1a1a;
  position: relative;
  cursor: grab;
}

.scene-container:active {
  cursor: grabbing;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.add-button, .center-button, .zoom-button, .test-button, .compact-button, .connect-button, .clear-button, .default-button {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.add-button:hover, .center-button:hover, .zoom-button:hover, .test-button:hover, .compact-button:hover, .connect-button:hover, .clear-button:hover, .default-button:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.test-button {
  background: rgba(255, 193, 7, 0.9);
}

.compact-button {
  background: rgba(76, 175, 80, 0.9);
}

.connect-button {
  background: rgba(33, 150, 243, 0.9);
}

.connect-button.active {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.clear-button {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.default-button {
  background: rgba(156, 39, 176, 0.9);
  color: white;
}

/* Бесконечный SVG слой через viewBox */
.arrows-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: visible;
}

.connection-group {
  pointer-events: all;
  cursor: pointer;
}

.connection-line {
  fill: none;
  stroke: #42A5F5;
  stroke-width: 2;
  stroke-linecap: round;
  transition: all 0.2s ease;
}

.connection-line:hover {
  stroke: #64B5F6;
  stroke-width: 3;
}

.connection-line.selected {
  stroke: #FFD700;
  stroke-width: 3;
}

.temp-connection-line {
  fill: none;
  stroke: #FF9800;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  stroke-linecap: round;
}

.arrow-head {
  fill: #42A5F5;
  stroke: #42A5F5;
  stroke-width: 1;
  transition: all 0.2s ease;
}

.arrow-head:hover {
  fill: #64B5F6;
  stroke: #64B5F6;
}

.arrow-head.selected {
  fill: #FFD700;
  stroke: #FFD700;
}

.infinite-scene {
  position: absolute;
  transform-origin: 0 0;
  will-change: transform;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 50;
}

.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

.draggable-block {
  position: absolute;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 16px;
  cursor: move;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transform-origin: center;
  z-index: 60;
}

.draggable-block:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
}

.draggable-block.selected {
  border-color: #FFD700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
}

.draggable-block.dragging {
  cursor: grabbing;
  opacity: 0.9;
}

.draggable-block.connecting {
  border-color: #42A5F5;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.3);
}

.block-content {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.block-coordinates {
  font-size: 11px;
  opacity: 0.8;
  font-family: monospace;
}

.connection-points {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  pointer-events: none;
}

.connection-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #42A5F5;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: all;
  cursor: crosshair;
}

.connection-point.active {
  opacity: 1;
}

.connection-point.top {
  top: 0;
  left: 50%;
}

.connection-point.right {
  top: 50%;
  right: 0;
}

.connection-point.bottom {
  bottom: 0;
  left: 50%;
}

.connection-point.left {
  top: 50%;
  left: 0;
}

.connection-point:hover {
  background: #64B5F6;
  transform: translate(-50%, -50%) scale(1.5);
}

.origin {
  position: absolute;
  pointer-events: none;
}

.origin-cross {
  position: absolute;
  width: 1px;
  height: 40px;
  background: #ff4444;
  top: -20px;
  left: 0;
}

.origin-cross::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 1px;
  background: #44ff44;
  top: 20px;
  left: -20px;
}

.origin-label {
  position: absolute;
  top: 25px;
  left: 5px;
  color: #fff;
  font-size: 12px;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 3px;
}

.scene-bounds {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.bound-label {
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 4px;
  border-radius: 2px;
}

.bound-label.top-left {
  top: 5px;
  left: 5px;
}

.bound-label.bottom-right {
  bottom: 5px;
  right: 5px;
}

.info-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  line-height: 1.5;
  backdrop-filter: blur(10px);
  pointer-events: none;
  z-index: 1000;
}

.coordinates-display {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  pointer-events: none;
  z-index: 1000;
}
</style>
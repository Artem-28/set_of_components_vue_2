<template>
  <div ref="rootRef" class="relation-container">
    <slot />
  </div>
</template>

<script setup>

import {computed, inject, onMounted, ref } from "vue";

const props = defineProps({
  connectKey: {
    type: [Number, String],
    required: true,
  },
  to: {
    type: [Number, String],
    required: false,
  },
  excludeFrom: {
    type: [Array, Boolean],
    default: false,
  },
  excludeTo: {
    type: [Array, Boolean],
    default: false,
  },
})

const scene = inject('_scene_', {})
const block = inject('_block_', {});
const fromSocket = {
  left: true,
  top: true,
  right: true,
  bottom: true,
}

const toSocket = {
  left: true,
  top: true,
  right: true,
  bottom: true,
};

let connection = null;
const rootRect = { x: 0, y: 0, width: 0, height: 0 };

const related = ref(false);
const rootRef = ref(null);

const fromRect = computed(() => {
  if (!related.value) return null;

  const { x: blockX, y: blockY } = block.position.value;

  const offsetX = rootRect.x - block.rect.value.x;
  const offsetY = rootRect.y - block.rect.value.y;

  return {
    x: blockX + offsetX,
    y: blockY + offsetY,
    width: rootRect.width,
    height: rootRect.height,
  }
})

const toRect = computed(() => {
  if (!related.value) return null;

  const { x: blockX, y: blockY } = connection.block.position.value;

  const offsetX = connection.rect.x - connection.block.rect.value.x;
  const offsetY = connection.rect.y - connection.block.rect.value.y;

  return {
    x: blockX + offsetX,
    y: blockY + offsetY,
    width: connection.rect.width,
    height: connection.rect.height,
  }
})

const points = computed(() => {
  const data = {
    from: null,
    to: null,
  }
  if (!fromRect.value || !toRect.value) return data;

  data.from = calculatePoints(fromRect.value);
  data.to = calculatePoints(toRect.value);
  return data;
})

const blockPosition = computed(() => {
  const position = { x: 'middle', y: 'middle' };
  const { from, to } = points.value;

  if (!from || !to) return position;

  if (from.right.x < to.left.x) {
    position.x = 'left';
  }

  if (from.left.x > to.right.x) {
    position.x = 'right';
  }

  if (from.bottom.y < to.top.y) {
    position.y = 'top';
  }

  if (from.top.y > to.bottom.y) {
    position.y = 'bottom';
  }

  return position;
})

const relation = computed(() => {
  const { from, to } = points.value;
  if (!from || !to) return null;

  const pos = blockPosition.value;
  const direction = `${pos.x}_${pos.y}`;

  const point = find(from, to);

  if (!point.from || !point.to) return null;

  return {
    from: point.from,
    to: point.to,
    view: `${direction}_${point.direction}`
  }
})

function calculatePoints(rect) {
  const centerH = rect.height / 2;
  const centerW = rect.width / 2;
  return {
    left: { x: rect.x, y: rect.y + centerH },
    top: { x: rect.x + centerW, y: rect.y },
    right: { x: rect.x + rect.width, y: rect.y + centerH },
    bottom: { x: rect.x + centerW, y: rect.y + rect.height },
  };
}

function createRelation() {
  if (!relation.value) return;
  scene.createRelation(props.connectKey, relation)
}

function initializeConnectionPoints() {

  const execute = (points, exclude) => {
    ['left', 'top', 'right', 'bottom'].forEach(key => {
      if (typeof exclude === 'boolean') {
        Object.assign(points, { [key]: !exclude });
        return;
      }
      if (!Array.isArray(exclude)) return;
      Object.assign(points, { [key]: !exclude.includes(key) })
    })
  }

  execute(fromSocket, props.excludeFrom);
  execute(toSocket, props.excludeTo);
}

async function initialize() {
  initializeConnectionPoints();

  const { x, y, height, width } = rootRef.value.getBoundingClientRect();
  rootRect.x = x;
  rootRect.y = y;
  rootRect.width = width;
  rootRect.height = height;

  scene.saveConnection(props.connectKey, {
    block: block.key,
    rect: { ... rootRect },
    socket: toSocket,
  });

  if (!props.to) return;

  connection = await scene.getConnection(props.to);
  related.value = true;
  createRelation();
}

function find(fPoints, tPoints) {
  const keys = ["left", "top", "right", "bottom"];

  let minDist = Infinity;

  const best = {
    from: null,
    to: null,
    direction: '',
  };

  const execute = (fKey) => {
    for (const tKey of keys) {
      if (connection.socket[tKey] !== true) continue;

      const fp = fPoints[fKey];
      const tp = tPoints[tKey];

      const dx = tp.x - fp.x;
      const dy = tp.y - fp.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minDist) {
        minDist = dist;

        best.from = fp;
        best.to = tp;
        best.direction = `${fKey}_${tKey}`
      }
    }
  }

  for (const key of keys) {
    if (fromSocket[key] !== true) continue;
    execute(key)
  }

  return best;
}

onMounted(() => {
  initialize();
});
</script>

<style scoped lang="scss">
.info {
  position: absolute;
  left: 0;
  top: 0;
  background-color: black;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.relation-container {
  color: white;
  position: relative;
  &:before {
    content: none;
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: white;
    transform: translate(0, -50%);
    top: 50%;
  }
  &:after {
    content: none;
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: white;
    transform: translate(-50%, 0);
    left: 50%;
  }
}

</style>
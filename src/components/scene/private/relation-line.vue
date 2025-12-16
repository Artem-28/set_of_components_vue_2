<template>
  <path
      v-if="connected || connecting"
      :d="path"
      fill="none"
      :stroke="color"
      :stroke-width="2"
      marker-end="url(#arrow-head)"
  />
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";
import { line } from "@/components/scene/private/line.constructor";

const props = defineProps({
  fromKey: {
    type: String,
    required: true,
  },
  toKey: {
    type: String,
    required: false,
  },
  float: {
    type: Object,
    required: false,
    validator: ({ x, y }) => typeof x === 'number' && typeof y === 'number'
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})


const scene = inject('_scene_', {})

let from = null;
let to = null;

const connected = ref(false);
const connecting = ref(false);

const toConnectKey = computed(() => props.toKey)

const tPoints = computed(() => {
  if (connected.value) return to.points.value.to;
  if (connecting.value) return { left: props.float };
  return null;
})

const position = computed(() => {
  const pos = { x: 'middle', y: 'middle' };

  const fPoints = from.points.value.from;

  if (connecting.value || !fPoints || !tPoints.value) return pos;

  if (fPoints.right.x < tPoints.value.left.x) {
    pos.x = 'left';
  }

  if (fPoints.left.x > tPoints.value.right.x) {
    pos.x = 'right';
  }

  if (fPoints.bottom.y < tPoints.value.top.y) {
    pos.y = 'top';
  }

  if (fPoints.top.y > tPoints.value.bottom.y) {
    pos.y = 'bottom';
  }

  return pos;
})

const socketKey = computed(() => {
  const keys = ["left", "top", "right", "bottom"];

  const best = {
    from: null,
    to: null,
  };

  if (!connecting.value && !connected.value) return best;

  const fPoints = from.points.value.from;

  let minDist = Infinity;

  const execute = (tKey) => {
    for (const fKey of keys) {
      if (from.socket.from[fKey] !== true) continue;

      const fp = fPoints[fKey];
      const tp = tPoints.value[tKey];

      const dx = tp.x - fp.x;
      const dy = tp.y - fp.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minDist) {
        minDist = dist;

        best.from = fKey;
        best.to = tKey;
      }
    }
  }

  if (connected.value) {
    for (const key of keys) {
      if (to.socket.to[key] !== true) continue;
      execute(key)
    }
  }

  if (connecting.value) {
    execute('left')
  }

  return best;
})

const path = computed(() => {
  const { from: fSocket, to: toSocket } = socketKey.value;
  if (!fSocket || !toSocket) return;

  const { x: posX, y: posY } = position.value;

  const fPoint = from.points.value.from[fSocket];
  const tPoint = tPoints.value[toSocket];

  const arrow = line(fPoint);
  const view = connected.value ? `${posX}_${posY}_${fSocket}_${toSocket}`: null;

  const padding = 50;

  const fx = fPoint.x;
  const fy = fPoint.y;
  const tx = tPoint.x;
  const ty = tPoint.y;

  const dx = tx - fx;
  const dy = ty - fy;
  const cx = dx / 2;
  const cy = (ty - fy) / 2;

  switch (view) {
    case 'left_top_left_right':
    case 'left_middle_left_right':
    case 'left_bottom_left_right':
    case 'middle_top_left_right':
    case 'middle_middle_left_right':
    case 'middle_bottom_left_right':
    case 'right_top_left_right':
    case 'right_middle_left_right':
    case 'right_bottom_left_right':
      arrow.drawX(Math.min(-padding, cx))
          .drawY(cy)
          .drawX(Math.max(dx + padding * 2, 0))
          .drawY(cy)
          .drawX(Math.min(-padding, cx))
      break;
    case 'left_top_right_left':
    case 'left_middle_right_left':
    case 'left_bottom_right_left':
    case 'middle_top_right_left':
    case 'middle_middle_right_left':
    case 'middle_bottom_right_left':
    case 'right_top_right_left':
    case 'right_middle_right_left':
    case 'right_bottom_right_left':
      arrow.drawX(Math.max(padding, cx))
          .drawY(cy)
          .drawX(Math.min(dx - padding * 2, 0))
          .drawY(cy)
          .drawX(Math.max(padding, cx))
      break;
    case 'left_top_right_right':
    case 'left_middle_right_right':
    case 'left_bottom_right_right':
    case 'middle_top_right_right':
    case 'middle_middle_right_right':
    case 'middle_bottom_right_right':
    case 'right_top_right_right':
    case 'right_middle_right_right':
    case 'right_bottom_right_right':
      arrow.drawX(Math.max(dx + padding, padding))
          .drawY(dy)
          .drawX(Math.min(dx - padding, -padding))
      break;
    case 'left_top_left_left':
    case 'left_middle_left_left':
    case 'left_bottom_left_left':
    case 'middle_top_left_left':
    case 'middle_middle_left_left':
    case 'middle_bottom_left_left':
    case 'right_top_left_left':
    case 'right_middle_left_left':
    case 'right_bottom_left_left':
      arrow.drawX(Math.min(dx - padding, -padding))
          .drawY(dy)
          .drawX(Math.max(dx + padding, padding))
      break;
    case 'left_top_bottom_top':
    case 'left_middle_bottom_top':
    case 'left_bottom_bottom_top':
    case 'middle_top_bottom_top':
    case 'middle_middle_bottom_top':
    case 'middle_bottom_bottom_top':
    case 'right_top_bottom_top':
    case 'right_middle_bottom_top':
    case 'right_bottom_bottom_top':
      arrow.drawY(Math.max(padding, cy))
          .drawX(cx)
          .drawY(Math.min(dy - padding * 2, 0))
          .drawX(cx)
          .drawY(Math.max(padding, cy))
      break;
    case 'left_top_top_bottom':
    case 'left_middle_top_bottom':
    case 'left_bottom_top_bottom':
    case 'middle_top_top_bottom':
    case 'middle_middle_top_bottom':
    case 'middle_bottom_top_bottom':
    case 'right_top_top_bottom':
    case 'right_middle_top_bottom':
    case 'right_bottom_top_bottom':
      arrow.drawY(Math.min(-padding, cy))
          .drawX(cx)
          .drawY(Math.max(dy + padding * 2, 0))
          .drawX(cx)
          .drawY(Math.min(-padding, cy))
      break;
    case 'left_top_top_top':
    case 'left_middle_top_top':
    case 'left_bottom_top_top':
    case 'middle_top_top_top':
    case 'middle_middle_top_top':
    case 'middle_bottom_top_top':
    case 'right_top_top_top':
    case 'right_middle_top_top':
    case 'right_bottom_top_top':
      arrow.drawY(Math.min(dy - padding, -padding))
          .drawX(dx)
          .drawY(Math.max(dy + padding, padding))
      break;
    case 'left_top_bottom_bottom':
    case 'left_middle_bottom_bottom':
    case 'left_bottom_bottom_bottom':
    case 'middle_top_bottom_bottom':
    case 'middle_middle_bottom_bottom':
    case 'middle_bottom_bottom_bottom':
    case 'right_top_bottom_bottom':
    case 'right_middle_bottom_bottom':
    case 'right_bottom_bottom_bottom':
      arrow.drawY(Math.max(dy + padding, padding))
          .drawX(dx)
          .drawY(Math.min(dy - padding, -padding))
      break;
    case 'left_top_right_top':
    case 'left_middle_right_top':
    case 'left_bottom_right_top':
    case 'right_top_left_top':
    case 'right_middle_left_top':
    case 'right_bottom_left_top':
      arrow.drawX(cx)
          .drawY(Math.min(dy - padding, 0))
          .drawX(cx)
          .drawY(Math.max(dy, padding))
      break;
    case 'middle_top_right_top':
    case 'middle_middle_right_top':
    case 'right_top_right_top':
      arrow.drawX(Math.max(dx, padding))
          .drawY(cy - padding)
          .drawX(Math.min(dx - padding, 0))
          .drawY(Math.max(cy + padding, padding))
      break
    case 'right_middle_right_top':
    case 'right_bottom_right_top':
    case 'middle_bottom_right_top':
      arrow.drawX(padding)
          .drawY(dy - padding)
          .drawX(dx - padding,)
          .drawY(padding)
      break;
    case 'middle_top_left_top':
    case 'left_top_left_top':
    case 'middle_middle_left_top':
      arrow.drawX(Math.min(dx, -padding))
          .drawY(cy - padding)
          .drawX(Math.max(dx + padding, 0))
          .drawY(Math.max(cy + padding, padding))
      break
    case 'left_bottom_left_top':
    case 'left_middle_left_top':
    case 'middle_bottom_left_top':
      arrow.drawX(-padding)
          .drawY(dy - padding)
          .drawX(dx + padding)
          .drawY(padding)
      break;
    case 'left_top_top_left':
    case 'left_bottom_top_left':
    case 'left_middle_top_left':
    case 'right_top_top_right':
    case 'right_middle_top_right':
    case 'right_bottom_top_right':
      arrow.drawY(Math.min(dy, -padding))
          .drawX(cx)
          .drawY(Math.max( dy + padding, 0))
          .drawX(cx)
      break;
    case 'middle_top_top_left':
    case 'right_top_top_left':
    case 'right_middle_top_left':
      arrow.drawY(-padding)
          .drawX(dx - padding)
          .drawY(dy + padding)
          .drawX(padding)
      break
    case 'middle_bottom_top_left':
    case 'right_bottom_top_left':
    case 'middle_middle_top_left':
    case 'left_top_bottom_left':
    case 'middle_top_bottom_left':
    case 'right_top_bottom_left':
      arrow.drawY(cy)
          .drawX(Math.min(dx - padding, 0))
          .drawY(cy)
          .drawX(Math.max(dx, padding))
      break;
    case 'left_top_top_right':
    case 'left_middle_top_right':
    case 'middle_top_top_right':
      arrow.drawY(-padding)
          .drawX(dx + padding)
          .drawY(dy + padding)
          .drawX(-padding)
      break
    case 'middle_bottom_top_right':
    case 'left_bottom_top_right':
    case 'middle_middle_top_right':
    case 'right_top_bottom_right':
    case 'middle_top_bottom_right':
    case 'left_top_bottom_right':
      arrow.drawY(cy)
          .drawX(Math.max(dx + padding, 0))
          .drawY(cy)
          .drawX(Math.min(dx, -padding))
      break;
    case 'left_top_left_bottom':
    case 'left_middle_left_bottom':
    case 'middle_top_left_bottom':
      arrow.drawX(-padding)
          .drawY(dy + padding)
          .drawX(dx + padding)
          .drawY(-padding)
      break;
    case 'left_bottom_left_bottom':
    case 'middle_bottom_left_bottom':
    case 'right_bottom_left_bottom':
      arrow.drawX(Math.min(dx, -padding))
          .drawY(cy)
          .drawX(Math.max(dx + padding, 0))
          .drawY(cy)
      break;
    case 'right_top_left_bottom':
    case 'right_middle_left_bottom':
    case 'middle_middle_left_bottom':
    case 'left_top_right_bottom':
    case 'left_middle_right_bottom':
    case 'middle_middle_right_bottom':
      arrow.drawX(cx)
          .drawY(dy + padding)
          .drawX(cx)
          .drawY(-padding)
      break
    case 'right_top_right_bottom':
    case 'right_middle_right_bottom':
    case 'middle_top_right_bottom':
      arrow.drawX(padding)
          .drawY(dy + padding)
          .drawX(dx - padding)
          .drawY(-padding)
      break;
    case 'left_bottom_right_bottom':
    case 'right_bottom_right_bottom':
    case 'middle_bottom_right_bottom':
      arrow.drawX(Math.max(dx, padding))
          .drawY(cy)
          .drawX(Math.min(dx - padding, 0))
          .drawY(cy)
      break;
    case 'left_bottom_bottom_right':
    case 'middle_bottom_bottom_right':
    case 'left_middle_bottom_right':
      arrow.drawY(padding)
          .drawX(dx + padding)
          .drawY(dy - padding)
          .drawX(-padding)
      break;
    case 'right_bottom_bottom_right':
    case 'right_middle_bottom_right':
    case 'middle_middle_bottom_right':
    case 'left_middle_bottom_left':
    case 'left_bottom_bottom_left':
    case 'middle_middle_bottom_left':
      arrow.drawY(Math.max(dy, padding))
          .drawX(cx)
          .drawY(Math.min( dy - padding, 0))
          .drawX(cx)
      break;
    case 'right_middle_bottom_left':
    case 'right_bottom_bottom_left':
    case 'middle_bottom_bottom_left':
      arrow.drawY(padding)
          .drawX(dx - padding)
          .drawY(dy - padding)
          .drawX(padding)
      break;
    default:
      arrow.draw(dx, dy);
      break;
  }

  return arrow.build();
})

async function updateTo() {
  to = null;

  if (props.toKey) {
    to = await scene.getConnection(props.toKey);
  }

  connected.value = !!from && !!to;
  connecting.value = !connected.value && !!props.float;
}

async function initialize() {
  from = await scene.getConnection(props.fromKey);
  updateTo();
}


initialize();

watch(toConnectKey, updateTo)
watch(socketKey, () => {
  if (connecting.value) return;

  const key = `${props.fromKey}_${props.toKey}`
  const fromSocket = socketKey.value.from;
  const toSocket = socketKey.value.to;
  scene.updateRelation(key, { fromSocket, toSocket })
})
</script>
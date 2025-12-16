<template>
  <div
      ref="rootRef"
      class="relation-container"
      @mouseenter="enter"
      @mouseleave="leave"
  >
    <div
        v-for="s in sockets"
        :key="s.type"
        :class="s.css"
        @pointerdown.stop="(e) => startConnection(e, s)"

    />
    <slot/>
  </div>
</template>

<script setup>

import {computed, inject, onMounted, ref, onBeforeUnmount} from "vue";

const props = defineProps({
  connectKey: {
    type: [Number, String],
    required: true,
  },
  to: {
    type: Array,
    default: () => ([]),
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

const fromSocket = ref({
  left: true,
  top: true,
  right: true,
  bottom: true,
})

const toSocket = {
  left: true,
  top: true,
  right: true,
  bottom: true,
};

const rootRef = ref(null);
const rootRect = ref({ x: 0, y: 0, width: 0, height: 0 });


const rect = computed(() => {
  const offsetX = rootRect.value.x - block.rect.value.x;
  const offsetY = rootRect.value.y - block.rect.value.y;

  return {
    x: block.position.value.x + offsetX,
    y: block.position.value.y + offsetY,
    width: rootRect.value.width,
    height: rootRect.value.height,
  }
})

const points = computed(() => {
  const { x, y, height, width } = rect.value;
  const cy = height / 2;
  const cx = width / 2;

  const fPoints = {
    left: { x, y: y + cy },
    top: { x: x + cx, y },
    right: { x: x + width, y: y + cy },
    bottom: { x: x + cx, y: y + height }
  }

  const tPoints = {
    left: { x, y: y + cy },
    top: { x: x + cx, y },
    right: { x: x + width, y: y + cy },
    bottom: { x: x + cx, y: y + height }
  }

  return {
    from: fPoints,
    to: tPoints,
  };
})


const activeSocket = computed(() => {
  const active = {
    left: false,
    top: false,
    right: false,
    bottom: false,
  }

  const keys = scene.fromRelations.value[props.connectKey] || [];

  const relations = scene.relations.value;

  keys.forEach(key => {
    const r = relations[key];
    active[r.fromSocket] = true;
  })

  return active;
})

const sockets = computed(() => {
  const data = [];

  ['left', 'top', 'right', 'bottom'].forEach(key => {
    const enable = fromSocket.value[key];
    if (!enable) return;
    const active = activeSocket.value[key];
    let css = `relation-container__socket socket--${key}`;
    if (active) css += ' socket--active';

    data.push({type: key, active, css})
  })

  return data;
})

function startConnection(e, s) {
  const from = {
    key: props.connectKey,
    cx: e.clientX,
    cy: e.clientY,
    ...points.value.from[s.type],
  }
  scene.startConnection(from);
}

function updateRootRect() {
  const {x, y, height, width} = rootRef.value.getBoundingClientRect();
  rootRect.value = { x, y, width, height };
}

function enter() {
  if (!scene.connect.value.from) return;
  scene.updateConnection(props.connectKey);
}

function leave() {
  if (!scene.connect.value.from) return;
  scene.updateConnection(null);
}

function removeRelations() {
  const fKeys = scene.fromRelations.value[props.connectKey] || [];
  fKeys.forEach(key => scene.removeRelation(key))
}

function initializeSockets() {

  const execute = (points, exclude) => {
    ['left', 'top', 'right', 'bottom'].forEach(key => {
      if (typeof exclude === 'boolean') {
        Object.assign(points, {[key]: !exclude});
        return;
      }
      if (!Array.isArray(exclude)) return;
      Object.assign(points, {[key]: !exclude.includes(key)})
    })
  }

  execute(fromSocket.value, props.excludeFrom);
  execute(toSocket, props.excludeTo);
}

async function initialize() {
  initializeSockets();
  updateRootRect();

  scene.saveConnection(props.connectKey, {
    block: block.key,
    points,
    socket: {
      from: fromSocket.value,
      to: toSocket,
    },
  });

  props.to.forEach(toKey => {
    const key = `${props.connectKey}_${toKey}`;
    const relation = {
      key,
      fromKey: props.connectKey,
      toKey,
      fromSocket: null,
      toSocket: null,
    };
    scene.createRelation(key, relation);
  });
}

onMounted(() => initialize());
onBeforeUnmount(() => {
  removeRelations()
  scene.removeConnection(props.connectKey);
});
</script>

<style scoped lang="scss">
.relation-container {
  color: white;
  position: relative;

  &__socket {
    position: absolute;
    display: inline-flex;
    cursor: pointer;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: currentColor;
    z-index: 10;
  }
}

.socket--active {
  color: #185BDE;
}

.socket--left {
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.socket--right {
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
}

.socket--top {
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
}

.socket--bottom {
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}


</style>
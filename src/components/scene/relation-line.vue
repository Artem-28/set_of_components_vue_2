<template>
  <path
      :d="path"
      fill="none"
      :stroke="color"
      :stroke-width="2"
      marker-end="url(#arrow-head)"
  />
</template>

<script setup>
import { computed } from "vue";
import { line } from "@/components/scene/line.constructor";

const props = defineProps({
  relation: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const path = computed(() => {
  const padding = 50;
  const { x: fx, y: fy } = props.relation.from;
  const { x: tx, y: ty } = props.relation.to;

  const dx = tx - fx;
  const dy = ty - fy;
  const cx = dx / 2;
  const cy = (ty - fy) / 2;

  const arrow = line(props.relation.from);

  switch (props.relation.view) {
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
      break;
  }

  return arrow.build();
})
</script>
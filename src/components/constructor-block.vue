<!--<template>-->
<!--  <block :block="block" block-key="id">-->
<!--    <div class="brick">-->
<!--      <relation-container-->
<!--          :connect-key="block.id"-->
<!--          exclude-from-->
<!--          :exclude-to="['bottom']"-->
<!--          class="brick__to-connect"-->
<!--      />-->
<!--      <relation-container-->
<!--          v-for="b in block.buttons"-->
<!--          :connect-key="b.id"-->
<!--          :to="b.next_block_id"-->
<!--          :exclude-from="['top']"-->
<!--          class="brick__from-connect"-->
<!--      />-->
<!--      <relation-container-->
<!--          :exclude-from="['top']"-->
<!--          class="brick__from-connect"-->
<!--      />-->
<!--      <span v-text="block.label" />-->
<!--    </div>-->
<!--  </block>-->
<!--</template>-->

<template>
  <block :block="block" block-key="id">
    <relation-container
        :connect-key="block.id"
        :exclude-to="['bottom']"
        :exclude-from="['top']"
        :to="relations"
    >
      <div class="brick">
        <button @click="removeBlock">remove</button>
        <span v-text="block.label" />
      </div>
    </relation-container>
  </block>
</template>

<script setup>
import Block from "@/components/scene/block";
import RelationContainer from "@/components/scene/relation-container";
import {computed} from "vue";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits(['remove:block'])

const relations = computed(() => {
  const data = [];
  (props.block.buttons || []).forEach(b => {
    data.push(b.next_block_id);
  })
  return data;
})

function removeBlock() {
  emit('remove:block', props.block.id)
}
</script>

<style scoped lang="scss">
.brick {
  position: relative;
  width: 200px;
  height: 100px;
  border: 1px solid white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  &__to-connect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }
  &__from-connect {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
  }
}
.constructor-block {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 180px;
  color: white;
  border: 1px solid white;
  background-color: black;
  &__label {
    height: 50px;
    display: flex;
    align-items: center;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
  }
  &__action {
    margin: 0 10px;
    padding: 10px;
    border: 1px solid white;
  }
  &__connect {
    width: 100%;
  }
}

</style>
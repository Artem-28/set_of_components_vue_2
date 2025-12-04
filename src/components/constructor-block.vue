<template>
  <block :block="block" block-key="id">
    <relation-container
        :connect-key="block.id"
        :to="block.next_block_id"
        class="constructor-block"
        :exclude-from="[]"
    >
      <span class="constructor-block__label" v-text="block.label" />

      <div
          v-if="block.buttons"
          class="constructor-block__actions"
      >
        <relation-container
            v-for="b in block.buttons"
            :key="b.id"
            :connect-key="b.id"
            :to="b.next_block_id"
            class="constructor-block__connect"
        >
          <div class="constructor-block__action" v-text="b.label" />
        </relation-container>
      </div>
    </relation-container>
  </block>
</template>

<script setup>
import Block from "@/components/scene/block";
import RelationContainer from "@/components/scene/relation-container";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  }
})
</script>

<style scoped lang="scss">
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
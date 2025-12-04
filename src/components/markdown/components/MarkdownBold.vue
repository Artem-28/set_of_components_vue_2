<template>
  <span class="markdown-text-bold" v-text="text" />
</template>

<script>
export default {
  name: 'MarkdownBold',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-text-bold {
  font-weight: 600;
}
</style>
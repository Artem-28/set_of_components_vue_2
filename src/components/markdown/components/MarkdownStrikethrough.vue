<template>
  <span class="markdown-text-strikethrough" v-text="text" />
</template>

<script>
export default {
  name: 'MarkdownStrikethrough',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-text-strikethrough {
  text-decoration: line-through;
}

</style>
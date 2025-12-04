<template>
  <span class="markdown-text-italic" v-text="text" />
</template>

<script>
export default {
  name: 'MarkdownItalic',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-text-italic {
  font-style: italic;
}

</style>
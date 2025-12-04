<template>
  <span class="markdown-text-code" v-text="text" />
</template>

<script>
export default {
  name: 'MarkdownCode',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-text-code {
  background: black;
  color: white;
}

</style>
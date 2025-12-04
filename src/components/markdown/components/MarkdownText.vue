<template>
  <span class="markdown-text-free" v-text="text" />
</template>

<script>
export default {
  name: 'MarkdownText',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">

</style>
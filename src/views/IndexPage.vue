<template>
  <div class="index-page">
    <textarea v-model="markdownText" />
    <markdown :text="markdownText" />
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      markdownText: 'Какойто текст с симводоми, **жирный текст**, *** а это курсив***, ~~Зачеркнутый текст~~, а это `блок с кодом` и снова простой текст'
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div class="markdown">
    <component
        v-for="(markdown, idx) in markdowns"
        :key="idx"
        :is="markdown.component"
        :text="markdown.text"
    />
  </div>
</template>

<script>
import { getMarkdownType, Markdown, getMarkdownRegexp } from "@/components/markdown/util/markdown";

export default {
  name: 'markdown',
  components: {
    [Markdown.BOLD]: () => import('./components/MarkdownBold'),
    [Markdown.ITALIC]: () => import('./components/MarkdownItalic.vue'),
    [Markdown.CODE]: () => import('./components/MarkdownCode.vue'),
    [Markdown.STRIKE_THROUGH]: () => import('./components/MarkdownStrikethrough.vue'),
    [Markdown.FREE_TEXT]: () => import('./components/MarkdownText.vue'),
  },
  props: {
    text: {
      type: String,
      default: '',
    }
  },
  computed: {
    markdowns() {
      const result = [];
      let endIndex = 0;
      this.foundMarkdown.forEach((mark, idx) => {

        if (endIndex > mark.index) return;

        const searchData = this.foundMarkdown.slice(idx + 1, this.foundMarkdown.length + 1);
        const endMark = searchData.find(m => m.marker === mark.marker);

        if (!endMark) return;

        const freeText = this.text.slice(endIndex, mark.index);
        const freeTextMarkdown = this.createMarkdown(freeText);

        endIndex = endMark.index + endMark.marker.length;

        const markdownText = this.text.slice(mark.index, endIndex)
        const markdown = this.createMarkdown(markdownText, mark.marker);

        result.push(freeTextMarkdown, markdown);
      });

      if (endIndex < this.text.length) {
        const freeText = this.text.slice(endIndex, this.text.length);
        const freeTextMarkdown = this.createMarkdown(freeText);
        result.push(freeTextMarkdown);
      }

      return result;
    },
    foundMarkdown() {
      const regex = getMarkdownRegexp(
          Markdown.BOLD,
          Markdown.ITALIC,
          Markdown.STRIKE_THROUGH,
          Markdown.CODE,
      )
      const result = [];
      let match;
      while ((match = regex.exec(this.text)) !== null) {
        result.push({ marker: match[0], index: match.index });
      }
      return result;
    },
  },
  methods: {
    createMarkdown(text, marker = null) {
      const type = getMarkdownType(marker);
      const regex = getMarkdownRegexp(type);
      return { text: text.replace(regex, ''), component: type };
    },
  }
}
</script>

<style scoped lang="scss">

</style>
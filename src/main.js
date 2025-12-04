import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Markdown from "@/components/markdown/Markdown";

Vue.config.productionTip = false

Vue.component(Markdown.name, Markdown);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import { createApp } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./permission";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(CKEditor);
app.use(router);
app.mount("#app");

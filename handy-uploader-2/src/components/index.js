import Vue from "vue";
import handyUploader from "./handyUploader.vue";

const Components = { handyUploader };

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;

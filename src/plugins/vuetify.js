import Vue from 'vue';
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // 'mdi' || 'md' || 'fa' || 'fa4'
  },
});
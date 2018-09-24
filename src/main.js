import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueFormWizard from '../node_modules/vue-form-wizard';
import '../node_modules/vue-form-wizard/dist/vue-form-wizard.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle, faBug, faUserShield, faDizzy, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Storage from 'vue-web-storage';
// import {lodash} from 'lodash';

// Object.definePrototype(Vue.prototype,'$lodash', {value: lodash})

library.add(faTimesCircle, faBug, faUserShield, faDizzy, faPlus);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueFormWizard);
Vue.use(Storage, {prefix: 'dnd_tracker'});

Vue.config.productionTip = false;

 // TODO: figure out how to leverage sass for improving styling.
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
// vm.currentRound = null;

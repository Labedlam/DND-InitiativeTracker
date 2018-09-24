import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import initiativeForm from './views/initiativeForm.vue';
import battle from './views/battle.vue';
import heros from './components/heros.vue';
import calculateXp from './components/calculateXp.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: Home
   
    },
    {
      path: '/heros',
      name: 'Heros',
      component: heros
    },
    {
      path: '/initiatitve-form',
      name: 'Initiative Form',
      component: initiativeForm
    }, 
    {
      path: '/battle',
      name: 'Battle Order',
      component: battle
    },
    {
      path: '/xp',
      name: 'Calculate XP',
      component: calculateXp
    }
    
  ]
});

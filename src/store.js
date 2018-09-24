import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.devtools = true;
export default new Vuex.Store({
  state: {
    fightingOrder: null,
    defeatedFighters: [],
    players: null

  },
  mutations: {
    setFightingOrder (state, payload){
      state.fightingOrder = payload;
    },
    setPlayers(state, payload){
      state.players = payload;
      Vue.$storage.set('_heros', state.players);
    },
    addDefeatedFighters (state, payload){
      state.defeatedFighters.push(payload);
    },
    updateDefeatedFighters(state, payload){
      state.defeatedFighters = payload;
    }
  },
  actions: {

  },
  getters: {
    totalXp: state =>{
      if(!state.fightingOrder)return;
      let reducer  = (totalXp, currentValue) =>{
        return   parseInt(totalXp) + parseInt(currentValue) ;
      };
      return state.defeatedFighters.map(x => x.XP).reduce( reducer );
    },
    xpPerHero: (state, getters )=>{
      if(!state.fightingOrder) return;
      return getters.totalXp / state.fightingOrder.length;
    }
  }
});

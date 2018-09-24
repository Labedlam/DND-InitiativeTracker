<template>
  <div class="home">
    <img src="../assets/dndDice.png">
    <HelloWorld msg="Initiative Tracker"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'home',
  components: {
    HelloWorld,
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      console.log("to", to)
      vm.players = vm.$storage.get('_heros');
      if(vm.players){
        vm.$store.commit('setPlayers',vm.players);
        console.log("whats next",next())
        next()
      }else{
        next('heros')
      }
    })
  },
};
</script>

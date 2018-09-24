<template>
    <div>
        <h1>Congratulations, your team has defeated your enemies</h1>
        <h4>Enter the XP for each defeated Monster</h4>
        <div class="row mx-5 my-2 align-self-center" v-for="character in defeatedFighters"
            v-bind:key="character.Name">
           <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span><font-awesome-icon icon="dizzy" /></span>
                    <span class="input-group-text" id="basic-addon3">{{character.Name}}</span>
                  </div>
                  <input class="form-control" 
                          type="number" 
                          placeholder="Xp" 
                          v-model="character.XP"
                          aria-describedby="Xp">
                  <!-- <input type="text" class="form-control" id="basic-url" > -->
            </div>
        </div>
        <div v-if="totalXp">
           Total XP: {{totalXp}}
        </div>
        <h4>Victors</h4>
            <div class="row mx-5 my-2 align-self-center" v-for="character in fightingOrder"
            v-bind:key="character.Name">
                <div class="input-group-prepend">
                    <span><font-awesome-icon icon="user-shield" /></span>
                    <span class="input-group-text" id="basic-addon3">{{character.Name}}</span>
                </div>
                <div v-if="xpPerHero">
                   gained {{xpPerHero}} XP
                </div>
            </div>
            <button class="btn-primary" type="button" @click="clearRound" >Finished</button>
    </div>
</template>
<script>
// TODO: have the ability update individual xp
// --idea- eventually have the ability to keep total xp  recieved. bascially add the rounds xp to total when round is finished. Would you want to know how much you got from each round?? 

 import {mapState, mapGetters} from 'vuex';
 import {debounce as _debounce} from 'lodash';
export default {
    name: 'calculateXp',
    computed:   {
         ...mapGetters([
            'totalXp',
            'xpPerHero',
        ]),
        ...mapState([
            'fightingOrder','defeatedFighters'
        ]),
    },
    // data: function(){
    //     return{
    //         XpPerPlayer: 0,
    //         totalXp: 0
    //     }
    // },
    methods:{
        clearRound: function(){
            this.$store.commit('setFightingOrder', null);
            this.$router.push('/');
        }
    }
    
}
</script>
<style lang="sass" scoped>

</style>

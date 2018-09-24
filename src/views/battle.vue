<template>
  <div class="container">
    <div>
      <form  id="battle" v-cloak v-if="fightingOrder">
          <div v-for="character in fightingOrder"
            v-bind:key="character.Name"
            v-bind:class="{ 'active': character.Active}"
            class="row">
            <div class="card flex-grow-1 mb-3">
              <div class="card-body">
                <div class="row justify-content-around flex-grow-1 mx-0" >
                  <div class="col-xs-10 flex-grow-1" @click="selectFighter(character)">
                    <div class="row mx-0">
                         <div class="col-xs-4" >
                      <span><font-awesome-icon v-if="character.Type === 'Monster'" icon="bug" /></span>
                      <span><font-awesome-icon v-if="character.Type === 'Hero'" icon="user-shield" /></span>
                  </div>
                  <div class="col-xs-4 flex-grow-1">
                    <strong>{{character.Name}} </strong>       
                  </div>
                  <div class="col-xs-4 flex-grow-1">
                    <em>{{character.Condition}}</em>   
                  </div>
                    </div>
                
                  </div>
                
                  <div class="col-xs-2 flex-grow-1">
                    <font-awesome-icon class=""
                                  icon="times-circle" 
                                  v-if="character.Active" 
                                  @click="removeFighterModal(character)"/>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        <!-- <button type="button" class=" my-2 btn btn-outline-primary btn-lg btn-block" @click="addFighterInBattle"><span><font-awesome-icon  icon="plus"/></span> Fighters</button> -->
        <button class="btn btn-primary btn-lg btn-block mt-5 " type="button"  @click="nextFighter()" >Next</button>
    </form>
    </div>

    <!-- Modal: DELETE FIGHTER -->
     <sweet-modal ref="removeFighters">
       <div v-if="needToDelete">
        <h1>Are you sure {{needToDelete.Name}} has been defeated?</h1>
        <button class="btn  btn-outline-danger btn-lg btn-block" type="button" @click="fighterDefeated()">Remove</button>
       </div>
    </sweet-modal>

    <!-- Modal: CONDITION WHEN FIGHTER IS SELECTED -->
    <sweet-modal ref="fighterCondition">
      <div v-if="selectedFighter"> 
        <h1>Update {{selectedFighter.Name}} Condition </h1>
        <form class="form-group" v-if="selectedFighter">
          <select class="form-control" v-model="selectedCondition"> {{selectedFighter.Condition}} 
            <option v-for="option in conditionOptions"  v-bind:key="option">{{option}}</option>
          </select>
          <button  type="button" class="btn btn-danger btn-lg btn-block mt-5" @click="fighterDefeated(selectedFighter,'fighterCondition')">Remove</button>
          <button class="btn btn-primary btn-lg btn-block mt-5 " type="button" @click="updateCondition()">Save</button>
        </form>
       </div>
    </sweet-modal>

     <!-- Modal: disabled CONDITION VALIDATION TRIGGERED IN THE NEXT FIGHTER FUNCTION  -->
    <sweet-modal ref="ConditionValidation">
      <div v-if="selectedFighter"> 
        <h1>Is {{selectedFighter.Name}} still {{selectedFighter.Condition}}? </h1>
        <form class="form-group" v-if="selectedFighter">
          <span v-if="['Disabled'].indexOf(selectedFighter.Condition) > -1">note: if yes, it will skip their turn <br></span>
          <button type="button" class="btn btn-primary btn-lg btn-block my-5" @click="conditionValidation(true, selectedFighter)">Yes</button>
          <button class="btn btn-primary btn-lg my-5 btn-block" type="button" @click="conditionValidation(false, selectedFighter )">No</button>
        </form>
      </div>
  </sweet-modal>

  <sweet-modal ref="addMonstersInBattle">
      <h1>Add Monsters</h1>
      <div class="input-group mb-3 mt-3">
        <input class="form-control" type="text" 
          v-model="monsterName" 
          v-on:keyup.enter="addMonster(monsterName)" 
          placeholder="Enter Name of Monster">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary"
              id="button-addon1" 
              type="button" 
              @click="addMonster(monsterName)">Add</button>
          </div>

      </div>
    
      <form id="MonsterSelect" v-cloak>
          <ul>
            <li v-for="monster in Monsters" 
              v-bind:key="monster.Name" 
              @click="toggleActive(monster)" 
              v-bind:class="{ 'active': monster.Active}"> 
                {{monster.Name}}
              </li>
          </ul>
        </form>
        <!-- <button class="sweet-buttons" slot="button" @click="closeMonstersModal">Done</button> -->
    </sweet-modal>

  </div>

</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue';
  import {mapState, mapMutations} from 'vuex'
  import {findIndex as _findIndex, remove as _remove, differenceBy as _differenceBy} from 'lodash';
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue';
  

  export default {
    //TODO:BUG: when removing a fighter two players are highlighted as active
    //TODO: BUG:when reloading the state. all info disappears, it should keep all the info that was previously there. 
    // TODO: fix the + fighters to add either a monster or hero to the fight
    //TODO: when updating a fighter, allow the ability to remove the fighter.

    name: 'home',
    computed:   {
      ...mapState([
      'fightingOrder','defeatedFighters'
    ])
    },
    components: {
      HelloWorld,
      SweetModal,
      SweetModalTab,
    },
    data: function(){
      return {
        needToDelete: null,
        selectedFighter: null,
        selectedCondition: null,
        conditionOptions: ['Abled', 'Hindered', 'Disabled'],
        allMonster: null,
        Monsters: [],
        monsterName:''

      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fightingOrder[0].Active = true;
        vm.allMonsters =  vm.fightingOrder.filter( (fighter) => { return fighter.Type ===  'Monster' } );   
        next();   // access to component instance via `vm`
      })
    },
    methods:{    
      nextFighter: function(){
        let activeFighter;
        let totalFighters = this.fightingOrder.length;
        let activeFighterIndex = _findIndex(this.fightingOrder, (fighter) => fighter.Active );
        
        this.fightingOrder[activeFighterIndex].Active = false;
        activeFighterIndex++;
        if(activeFighterIndex + 1 > totalFighters) activeFighterIndex = 0;
        activeFighter = this.fightingOrder[activeFighterIndex];
        activeFighter.Active = true;
        if(this.isDisabled(activeFighter)) this.modalConditionValidation(activeFighter);
        if(this.isAllMonsterDefeated()) this.$router.push('xp')

      },
      removeFighterModal: function(character){
        this.needToDelete = character;
        this.$refs.removeFighters.open();
      },
      fighterDefeated: function (character,closeModalref) {
          if(character) this.needToDelete = character;
          let newArray  = this.fightingOrder.filter( (fighter) => { return fighter.ID !==  this.needToDelete.ID } );
          newArray[0].Active = true;
          this.$store.commit('setFightingOrder', newArray);
          this.$store.commit('addDefeatedFighters', this.needToDelete);
          this.needToDelete = null;
          this.$refs.removeFighters.close();
          if( this.isAllMonsterDefeated()){
              if(closeModalref) this.$refs.fighterCondition.close();
              this.$router.push('xp')
          } 
          if(closeModalref) this.$refs.fighterCondition.close();
      },
      isAllMonsterDefeated: function(){
        let monstersLeft =   _differenceBy( this.allMonsters, this.defeatedFighters, 'ID' );
        return monstersLeft.length === 0;
      },
      selectFighter: function(character){
        this.selectedFighter = character;
        this.selectedCondition = this.selectedFighter.Condition
        this.$refs.fighterCondition.open();
      },
      updateCondition: function(){
          this.selectedFighter.Condition = this.selectedCondition
         let updatedFightingOrder = this.fightingOrder.map( fighter => {
           return fighter.Name === this.selectedFighter.Name ? this.selectedFighter : fighter; 
            } )
          this.selectedCondition = null;
          this.$store.commit('setFightingOrder', updatedFightingOrder);
          this.$refs.fighterCondition.close(); 
      },
      isDisabled: function(fighter){
          return  ['Disabled'].indexOf(fighter.Condition) > -1
      },
      modalConditionValidation: function(fighter){
        this.selectedFighter = fighter;
        this.$refs.ConditionValidation.open();
      },
      conditionValidation: function(skip, selectedFighter){
        if(skip){
          this.nextFighter();
        }else{
          this.selectedFighter.Condition = 'Abled';
        }
        this.$refs.ConditionValidation.close();
      },
      addFighterInBattle: function(){
        this.$refs.addMonstersInBattle.open();
      },
        generateID: function(){
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    addMonster: function(monsterName){
        if (monsterName.length === 0) return;
        let monster = {
          ID: this.generateID(),
          Name: monsterName,
          Initiative: 0,
          Active: true,
          Type: 'Monster',
          XP:0
        }
        this.Monsters.push(monster)
        this.monsterName = ''
      },
          
    }
    
  };
</script>
<style scoped lang="scss">
  body{
    font: 15px/1.3 'Open Sans', sans-serif;
    color:#5e5b64;
    text-align:center;
    // div:first-child{
    //   margin: 0 100px 0 100px;
    // }
  }

  a, a:vivisted{
    outline:none;
    color: #389dc1;
  }

  a:hover{
    text-decoration:none;
  }

  section, footer, header, aside, nav{
    display:block;
  }
form h1{
    color:#fff;
    font-size:64px;
    font-family:'Cookie', cursive;
    font-weight: normal;
    line-height:1;
    text-shadow:0 3px 0 rgba(0,0,0,0.1);
}

form ul{
    list-style:none;
    color:#fff;
    font-size:20px;
    font-weight:bold;
    text-align: left;
    margin:20px 0 15px;
    padding:0;
}

form ul li{
    padding:20px 30px;
    background-color:#e3588540;
    margin-bottom:8px;
    box-shadow:0 1px 1px rgba(0,0,0,0.1);
    cursor:pointer;
}


div.active{
    background-color:#8ec16d;
    margin: 50px 0 50px 0;
        -webkit-box-shadow: 0 10px 6px -6px #777;
       -moz-box-shadow: 0 10px 6px -6px #777;
            box-shadow: 0 10px 6px -6px #777;
    // border: 1px solid #000;
}
</style>

<template>
  <div class="container">
    <!-- <input class=" mr-5 form-control" v-model="currentRound.Name" name="roundName" type="text" maxlength="100" placeholder="Enter Name of Round" aria-labelledby="submit-name"> -->
  <form-wizard ref="wizard" shape="circle" color="#3498db" title="" subtitle="It has begun" @on-complete="commenceBattle">

    <!-- Add Heros / Monsters -->
    <tab-content title="Create Round" :before-change="gatherFighters">
      <div class="form-group">
      </div>
      <br>
      <div class="row">
        <div class="col-md-5">
          <button class="btn btn-primary btn-lg" type="button" @click="addMonstersModal"> Add Monsters </button>
          <div  class="row mx-2 mt-2 my-2text-center" v-for="monster in currentRound.Monsters" v-bind:key="monster.ID">
                <div class="card d-flex flex-grow-1">
                  <div class="card-body">
                    <span><font-awesome-icon icon="bug" /></span>
                      {{monster.Name}}
                  </div>
                </div>      
          </div> 
        </div>
        <div class="col-md-2 my-3">
            <strong>Versus</strong>  
        </div>
        <div class="col-md-5">
            <button class="btn btn-primary btn-lg"  type="button" @click="addPlayersModal"> Add Players </button>

                <div  v-if="hero.Active" class="row mx-2 my-2 text-center" v-for="hero in currentRound.Players" v-bind:key="hero.ID">
                <div class="card d-flex flex-grow-1">
                  <div class="card-body">
                    <span><font-awesome-icon icon="user-shield" /></span>
                      {{hero.Name}}
                  </div>
                     
                  </div>      
              </div>    
        </div>
      </div>
    </tab-content>
    
    <!-- Gather Initiative -->
    <tab-content id="GatherInitiative" title="Gather Initiative" :before-change="calculateInitiative" >
        <form id="addInitiative" v-cloak v-if="currentRound.Fighters">
            <!-- <h5 class="mb-4 d-flex ml-auto" v-if="initiativeRound > 0">  Initiative Round {{initiativeRound}}</h5> -->
            <div class="row m-2 align-items-center " v-for="character in currentRound.Fighters" 
              v-bind:key="character.Name"
              v-bind:class="{ 'actitve': character.Active}">
              <div class="card flex-grow-1">
                <div class="card-body">
                  <div class="row">
   <div class="d-flex justify-content-around" v-bind:class="displayPreviousInit">
                    <span class="d-flex">
                    <font-awesome-icon v-if="character.Type === 'Monster'" icon="bug" />
                    <font-awesome-icon v-if="character.Type === 'Hero'" icon="user-shield" />
                    </span>
                    <h5 class="d-flex" id="basic-addon3">{{character.Name}}</h5>
                  </div>
                   
                  <div class="col-md-4" v-if="initiativeRound">
                    {{character.Initiative[initiativeRound - 1]}}
                  </div>
                  <div v-bind:class="displayPreviousInit">
                      <div class="form-group">
                        <!-- this{{character.Initiative[initiativeRound]}} -->
                        <!-- plus 1 indicates that a new initiative should be entered. -->
                          <input v-if='character.Initiative[initiativeRound] === 0 || character.Initiative[initiativeRound]' class="form-control" 
                                  ref="input"
                                  type="number" 
                                  placeholder="Initiative" 
                                  v-model.number="character.Initiative[initiativeRound]"
                                  aria-describedby="Initiative"
                                  @change="onInput($event, character, initiativeRound)">
                      </div>  
                    </div>
                </div>
                  </div>
               
              </div> 
                 
          
                    <!-- initial round -->
                     <!-- <input v-if="initiativeRound === 0" class="form-control" 
                            type="number" 
                            placeholder="Initiative" 
                            v-model.number="character.Initiative[initiativeRound]"
                            aria-describedby="Initiative"> -->
                  

            </div>
          
        </form>
    </tab-content>

    <!-- Confirm -->
    <tab-content title="Confirm" :before-change="calculateInitiative" >
      <div class="row justify-content-center" v-for="character in currentRound.Fighters"  v-bind:key="character.Name">
        <div class="card flex-grow-1 mb-2">
          <div class="card-body">
            <div class="row ">
              <div class="col-md-6">
               <div>
                <font-awesome-icon v-if="character.Type === 'Monster'" icon="bug" />
                <font-awesome-icon v-if="character.Type === 'Hero'" icon="user-shield" />
              </div>
              </div>
              <div class="col-md-6">
                <h5 class="">{{character.Name}}</h5>
              </div>
            </div>
           
           
          </div>
        </div>
      </div>
    </tab-content>

  <!-- Modal: ADD heros -->
    <sweet-modal class="player-add" ref="addPlayers">
        <h1>Select Heros to battle</h1>  
        <br /><br />
        <form id="PlayerSelect" v-cloak>
          <ul>
            <li v-for="player in currentRound.Players" 
              v-bind:key="player.Name" 
              @click="toggleActive(player)" 
              v-bind:class="{ 'active': player.Active}"> 
                {{player.Name}}
              </li>
          </ul>
        </form>
        <button v-if="!newHero" type="button" class=" btn btn-outline-primary btn-lg btn-block" @click="newHero = !newHero"><span><font-awesome-icon  icon="plus"/></span> New Hero</button>
        <input v-if="newHero" type="text" class="form-control" v-model="newHeroName"  v-on:keyup.enter="addNewHero(newHeroName)" placeholder="Enter New Hero..">
        <button class=" mt-5 btn btn-primary btn-lg btn-block" @click="closePlayersModal">Done</button>
    </sweet-modal>

  <!-- Modal: ADD MONSTERS -->
    <sweet-modal ref="addMonsters">
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
            <li v-for="monster in currentRound.Monsters" 
              v-bind:key="monster.Name" 
              @click="toggleActive(monster)" 
              v-bind:class="{ 'active': monster.Active}"> 
                {{monster.Name}}
              </li>
          </ul>
        </form>
        <button class="sweet-buttons" slot="button" @click="closeMonstersModal">Done</button>
    </sweet-modal>

</form-wizard>
  </div>


</template>

<script>
// how to extract useable code?
//XX TODO:When entering this state from the battle state. sure the info doesnt get lost
//TODO: handle when there is multiple player with same number. maybe a modal that pops up with
//TODO: handle next functions so that you may not proceed unless data is filled out

//Create new round
//TODO: add new hero:
//TODO: sync up round name, click edit button, trigger save on enter,
//TODO: clean up design for page so that its more fluid with the rest of the app
//TODO: before hitting next make sure some players and monsters are selected

// gather initiative
//TODO: get rid of the 0s when entering the input
//TODO: update styling
//TODO: cannot click next unless all inputs are set
//TODO: modal popup - roll again- who goes first? drag to order, and put them back in the fighting order array

//CONFIRM
// TODO: display inputs for when there are players have init2 (when they have the same init, have them re roll so that when they hit finished the fighters can be reordered)
// idea--- instead of using a sorting algorithm- take the init2 input and convert into to number in .00 decimal and add to the init , then re-run existing sorting function. if they hit back convert the init back to whole numbers by taking the added decimals to init 2

//local registration
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import { mapState } from "vuex";
// import {groupBy as _groupBy} from 'lodash';

export default {
  components: {
    FormWizard,
    TabContent,
    SweetModal,
    SweetModalTab
  },
  computed: {
    ...mapState(["fightingOrder", "defeatedFighters", "players"])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      vm.currentRound.Fighters = vm.fightingOrder;
      vm.currentRound.Players = vm.players || vm.$storage.get("_heros");
      if (vm.currentRound.Fighters && vm.currentRound.Fighters.length) {
        vm.$refs.wizard.changeTab(0, 2);
      } else {
        next();
      }
    });
  },
  data: function() {
    return {
      currentRound: {
        Name: "",
        Monsters: [],
        Fighters: null,
        Players: null,
        Active: null,
        RunnerUp: null,
        InitiativeOrder: []
      },
      monsterName: "",
      sameInititative: null,
      newHero: false,
      init2: null,
      newHeroName: null,
      initiativeRound: 0
      // displayPreviousInit: {
      // "col-md-4": false,
      // "col-md-6": true
      // }
    };
  },
  computed: {
    displayPreviousInit: function() {
      return {
        // "col-md-4": this.initiativeRound > 0,
        'col-md-6': this.initiativeRound === 0,
        'col-md-4': this.initiativeRound > 0
        // 'text-danger': this.error && this.error.type === 'fatal'
      };
    }
  },
  methods: {
    // this funciton is used to handle diplay issues when user delets input for number. it evaluates to a empty string and is not picked up by the v-if, so if input is null or empty i set to 0
    onInput: function(e, character, round) {
      console.log("here is event", e, character, round);
      const val = e.target.valueAsNumber;
      if (isNaN(val)) {
        character.Initiative[round] = 0;
        this.$forceUpdate();
      }
    },
    addPlayersModal: function() {
      this.$refs.addPlayers.open();
    },
    closePlayersModal: function() {
      this.newHero = !this.newHero;
      if (this.currentRound.Monsters.length === 0) {
        this.$refs.addPlayers.close();
        this.addMonstersModal();
      } else {
        this.$refs.addPlayers.close();
      }
    },
    addMonstersModal: function() {
      this.$refs.addMonsters.open();
    },
    closeMonstersModal: function() {
      let playersToFight = this.currentRound.Players.filter(p => p.Active);
      if (playersToFight.length === 0) {
        this.$refs.addMonsters.close();
        this.addPlayersModal();
      } else {
        this.$refs.addMonsters.close();
      }
    },
    generateID: function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    addMonster: function(monsterName) {
      if (monsterName.length === 0) return;
      let monster = {
        ID: this.generateID(),
        Name: monsterName,
        Initiative: [0],
        Active: true,
        Type: "Monster",
        XP: 0
      };
      this.currentRound.Monsters.push(monster);
      this.monsterName = "";
    },
    toggleActive: function(player) {
      player.Active = !player.Active;
    },
    gatherFighters: function() {
      this.currentRound.Fighters = [];
      let heros = this.currentRound.Players.filter(p => p.Active);
      let monsters = this.currentRound.Monsters.filter(m => m.Active);
      this.currentRound.Fighters = this.currentRound.Fighters.concat(
        heros,
        monsters
      );
      return true;
    },
    calculateInitiative: function() {
      return this.sortFighters();
      // this.sameInititative = sameInitiative;

      // return this.isSameInitiative();
      // return true;
    },
    moveDecimal(num, direction) {
      if (direction === "right") {
        return num / 100;
      }
      if (direction === "left") {
        return Math.round(num * 100);
      }
      console.log("NUM", num);
    },
    isSameInitiative: function() {
      if (this.sameInititative) {
        return false;
      } else {
        return true;
      }

      // let sameInititative = _.groupBy(this.currentRound.Fighters, "Initiative");
      // // let updatedInit = Object.assign({}, this.sameInititative);
      // _.forOwn(sameInititative, (val, key) => {
      //   if (val.length > 1) {
      //     sameInititative = true;
      //     return false;
      //   }
      // });
      // console.log("this is sameInitiiative", sameInititative);
      // if (sameInititative);
      // this.sameInitiative = updatedInit;
      // _.forOwn(this.sameInitiative,(val,key)=>{
      //   _.forEach( val, (fighter) => {
      //     var updatedFighter = _.find( this.currentRound.Fighters, (f) =>{ f.ID === fighter.ID})
      //     if(updatedFighter)updatedFighter.Init2 = 0
      //     } )
      // });
    },
    updateinit2: function() {
      //make an array of grouped init2
      //
    },
    commenceBattle: function() {
      //condition: able/hindered/disabled
      // let canProceed =  this.updateInit2();
      // if(!canProceed){
      //   throw new Error
      //   return
      // }
      if (!this.currentRound.Fighters) {
        this.fightingOrder;
      } else {
        this.currentRound.Fighters.forEach(fighter => {
          (fighter.Active = false), (fighter.Condition = "Abled");
        });
        this.$store.commit("setFightingOrder", this.currentRound.Fighters);
      }
      this.$router.push("battle");
    },
    sortFighters: function() {
      let round = this.initiativeRound;
      let sameInitiative = this.sameInititative;
      // convert initiatives to decimals before sort
      if (round > 0)
        //convert initative rounds to decimal so that you can re order
        this.currentRound.Fighters = this.currentRound.Fighters.map(fighter => {
          fighter.Initiative[round] =
            fighter.Initiative[round - 1] +
            this.moveDecimal(fighter.Initiative[round], "right");
          console.log("1: init: ", fighter.Initiative[round]);
          return fighter;
        });

      this.currentRound.Fighters.sort(function(objA, objB) {
        //initialize next initiative on fighters if they have the same intiative
        if (objB.Initiative[round] === objA.Initiative[round]) {
          if (!objB.Initiative[round + 1]) objB.Initiative.push(0);
          if (!objA.Initiative[round + 1]) objA.Initiative.push(0);
          // set flag noting that a new round of initiative should be entered.
          sameInitiative = true;
        }
        return objB.Initiative[round] - objA.Initiative[round];
      });
      //convert initative rounds back to whole nums so that the numbers display correctly to user
      if (round > 0) {
        this.currentRound.Fighters = this.currentRound.Fighters.map(fighter => {
          fighter.Initiative[round] =
            fighter.Initiative[round] - fighter.Initiative[round - 1];
          fighter.Initiative[round] = this.moveDecimal(
            fighter.Initiative[round],
            "left"
          );

          console.log("2: init: ", fighter.Initiative[round]);
          return fighter;
        });
      }
      // update round and reset sameInitiative flag
      this.initiativeRound = sameInitiative ? round + 1 : round;
      if (sameInitiative) {
        this.sameInititative = false;
        return false;
      } else {
        return true;
      }
    },
    //     isInitativeRoundComplete: function(){
    //       sameInitiative = false;
    //         this.currentRound.Fighters.sort(function(objA, objB) {
    //         //initialize next initiative on fighters if they have the same intiative
    //         if (objB.Initiative[round] === objA.Initiative[round]) {
    //           if (!objB.Initiative[round + 1]) objB.Initiative.push(0);
    //           if (!objA.Initiative[round + 1]) objA.Initiative.push(0);
    //           // set flag noting that a new round of initiative should be entered.
    //           sameInitiative = true;
    //         }
    //         return objB.Initiative[round] - objA.Initiative[round];
    //       });
    //       if(!sameInitiative){
    // this.sameInititative = false;
    //       }
    //     },
    addNewHero: function(heroName) {
      let hero = {
        ID: this.generateID(),
        Name: heroName,
        Initiative: [0],
        Active: true,
        Type: "Hero",
        XP: 0
      };
      this.currentRound.Players.push(hero);
      this.$store.commit("setPlayers", this.currentRound.Players);
      this.newHeroName = "";
      this.newHero = false;
    }
  }
};
</script>
<style scoped lang="scss">
// https://tutorialzine.com/2016/03/5-practical-examples-for-learning-vue-js
// *{
//   margin:0;
//   padding:0;
// }

body {
  font: 15px/1.3 "Open Sans", sans-serif;
  color: #5e5b64;
  text-align: center;

  #addInitiative {
    // background-color: blue;

    // div{
    .input-group-prepend {
      // background-color:rgb(52, 152, 219);
      // display: block;
      width: 50%;
      .input-group-text {
        font-size: 1.2em;
        font-weight: 900;
      }
    }
    input {
      font-size: 1.2em;
      font-weight: 900;
      text-align: center;
    }
  }

  // }
}

a,
a:vivisted {
  outline: none;
  color: #389dc1;
}

a:hover {
  text-decoration: none;
}

section,
footer,
header,
aside,
nav {
  display: block;
}
/*-------------------------
    The order form
--------------------------*/
.player-add {
  //  .theme-light .has-content .is-mobile-fullscreen .is-visible .is-alert{
  //  *{
  .sweet-modal {
    background: #3498db !important;
  }
}

// border-radius: 2px;
// box-shadow: 0 1px 1px #ccc;
// width: 400px;
// padding: 35px 60px;
// margin: 50px auto;

form h1 {
  color: #fff;
  font-size: 64px;
  font-family: "Cookie", cursive;
  font-weight: normal;
  line-height: 1;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
}

form ul {
  list-style: none;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin: 20px 0 15px;
  padding: 0;
}

form ul li {
  padding: 20px 30px;
  background-color: #e35885;
  margin-bottom: 8px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

form ul li span {
  float: right;
}

form ul li.active {
  background-color: #8ec16d;
}
</style>
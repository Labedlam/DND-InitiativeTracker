// client-side js
// run by the browser each time your view template referencing it is loaded
// https://cristijora.github.io/vue-form-wizard/#/
//global registration
console.log(VueFormWizard);
// import VueFormWizard from 'vue-form-wizard'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
const SweetModal = require('SweetModal');
console.log(sweetModal);
// console.log(SweetModalTab); 
Vue.use(VueFormWizard);
// Vue.use(SweetModal);


//local registration
// import {FormWizard, TabContent} from 'vue-form-wizard'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'

console.log("this is vue", Vue);


let rounds = [];
let selectedRound;
let CampaignPlayers = [];

var vm = new Vue({
  el: '#app',
  data: {
    message: '',
    currentRound: null
  },
  methods:{
    startRound : function(){
      console.log("hello")
      let round = {
        Name:"",
        Monsters: [],
        Players: [],
        Active: null,
        RunnerUp: null,
        InitiativeOrder: []
      }
      vm.currentRound = round;
      this.$refs.modal.open()
    }
  },
  components: {
  // FormWizard: VueFormWizard.FormWizard,
  //   TabContent: VueFormWizard.FormWizard
}
})





// let dreams = [];

// // define variables that reference elements on our page
// const dreamsList = document.getElementById('dreams');
// const dreamsForm = document.forms[0];
// const dreamInput = dreamsForm.elements['dream'];

// // a helper function to call when our request for dreams is done
// const getDreamsListener = function() {
//   // parse our response to convert to JSON
//   dreams = JSON.parse(this.responseText);

//   // iterate through every dream and add it to our page
//   dreams.forEach( function(row) {
//     appendNewDream(row.dream);
//   });
// }

// // request the dreams from our app's sqlite database
// const dreamRequest = new XMLHttpRequest();
// dreamRequest.onload = getDreamsListener;
// dreamRequest.open('get', '/getDreams');
// dreamRequest.send();

// // a helper function that creates a list item for a given dream
// const appendNewDream = function(dream) {
//   const newListItem = document.createElement('li');
//   newListItem.innerHTML = dream;
//   dreamsList.appendChild(newListItem);
// }

// // listen for the form to be submitted and add a new dream when it is
// dreamsForm.onsubmit = function(event) {
//   // stop our form submission from refreshing the page
//   event.preventDefault();

//   // get dream value and add it to the list
//   dreams.push(dreamInput.value);
//   appendNewDream(dreamInput.value);

//   // reset form 
//   dreamInput.value = '';
//   dreamInput.focus();
// };
<template>
    <div class="mx-5" >
       <h1 >Add your campaigns heros</h1> 
        <div class="row mx-2 my-2text-center" v-for="hero in ourHeros" v-bind:key="hero.ID">
               <div class="card d-flex flex-grow-1 mb-2">
                   <div class="card-body">
                        <span><font-awesome-icon icon="user-shield" /></span>
                        {{hero.Name}}
                   </div>
                </div>      
        </div>    
        <form @submit.prevent="addHero">
            <div class="input-group mb-3">
                 <input  v-model="typedHero" type="text" class="form-control" id="heroName" placeholder="Hero's Name">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" for="addingHeros" @click="addHero()" >Add</button>
                </div>
            </div>
            <button type="button" class="btn btn-lg btn-block btn-outline-primary" @click="submit()"> Done</button>
        </form>
        
    </div>    

</template>
<script>
// TODO: UD of crud
export default {
    
    name: 'heros',
    data:function(){
      return {
          welcome: 'welcome to the hero component',
          ourHeros: this.$storage.get('heros'),
          typedHero: null,
          
      }
     
    },
   methods: {
       generateID: function(){
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
       addHero: function(e){
           let hero = {
               ID: this.generateID(),
               Name: this.typedHero,
               Type: 'Hero',
               Active: false,
               Initiative: [0],
           }

           if(!this.ourHeros)this.ourHeros =  [];
            if(this.typedHero.length < 1 )return;
            
            this.ourHeros.push(hero);
           this.ourHeors = [...this.ourHeros, this.ourHeros]; 
           this.typedHero = null
       },
       submit: function(){

           if(!this.ourHeros)  throw new Error('Need at least one hero')
           this.$storage.set('_heros', this.ourHeros);
        //    console.log("push", this.$router.push());
           this.$router.push('/');

       }
    }
}
</script>

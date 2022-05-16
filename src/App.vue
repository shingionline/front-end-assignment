<template>
<div class="container">
  <h3 class="text-white pt-3"><b>Ad Targeting</b></h3>
  <h5 class="text-white py-3"><b>Add new rule</b></h5>
  <div class="card">
    <div class="card-body">
      <div class="row">
      <div class="col-4"><label>Type</label>
      <v-select 
            v-model="new_target.type"
            placeholder="Choose target type"
            @input="getRules()"
            :options="target_types"
            label="name">
            <template #option="{ name }">
                <span>{{ name }}</span>
            </template>
            </v-select>
      
      </div>
      <div class="col-8"><label>Rules</label>

      <multi-select v-if="new_target.type"
      v-model="new_target.rules" 
      :multiple="true"
      :close-on-select="true"
      :placeholder="new_target.type ? `Please select ${new_target.type.name}` : 'Please select options'"
      label="name"
      track-by="id"
      :options="rules">
      </multi-select>

       <div class="alert alert-success p-1 text-center" v-else>Please select a type</div>

      <div class="text-end pt-3 pb-3">
        <button class="btn btn-secondary me-2"
        @click="resetRules"
        :disabled="new_target.rules && new_target.rules.length > 0 ? false : ''"
        >Reset</button>
        <button class="btn btn-success"
        @click="addRule"
        :disabled="new_target.rules && new_target.rules.length > 0 ? false : ''"
        >Add rule</button>
        </div>
      </div>
    </div>
    </div>
  </div>

  <h5 class="text-white pt-4 pb-3"><b>Saved targeting rules</b></h5>
  <p class="text-white" v-if="saved_targets.length==0">There are no saved targeting rules</p>
  <div class="card" v-else>
    <div class="card-body">
      <div class="row border-bottom">
      <div class="col-3">
        <label>Type</label>
        </div>
      <div class="col-7"><label>Rules</label></div>
      <div class="col-2"><label>Actions</label></div>
    </div>

    <div class="row border-bottom pt-2" v-for="(target, key) in saved_targets" :key="key">
      <div class="col-3">
        <label>{{target.type.name}}</label>
        </div>
      <div class="col-7">
        <span v-for="(rule, key) in target.rules" :key="key">
        <span class="badge badge-primary me-2">{{rule.name}}</span>
        </span>
        
        </div>
      <div class="col-2">
        <a href="#/" @click="showModal(target)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/></svg></a></div>
    </div>

<div class="text-end pt-3">
        
        <button class="btn btn-success"
        @click="saveChanges"
        >Save changes</button>
        </div>
    </div>
    
  </div>

  <b-modal id="bv-modal-example" hide-footer>
    <template #modal-title>
      <b>Rule for {{selected_rule.type.name}}</b>
    </template>
<div>
  <div>
    <div>
      <p>Are you sure you want to delete this rule?</p>
    </div>
    <div class="row">
      <div class="col-6"><button class="btn btn-secondary w-100" @click="hideModal()">Cancel</button></div>
      <div class="col-6"><button class="btn btn-danger w-100" @click="removeRule(selected_rule)">Yes, delete it</button></div>
    </div>
  </div>
</div>

  </b-modal>

    <b-modal id="bv-modal-exists" hide-footer v-if="new_target.type">
    <template #modal-title>
      <b>Warning</b>
    </template>
<div>
  <div>
    <div>
      <p>A rule for <b>{{new_target.type.name}}</b> already exists</p>
    </div>
    <div class="row">
      <div class="col"><button class="btn btn-success w-100" @click="hideModalExists()">Ok</button></div>
    </div>
  </div>
</div>

  </b-modal>
<div class="text-end text-white fst-italic py-3"><a href="https://shingimushipe.com" style="color:#fff;text-decoration:none;" target="_blank">By Shingi Mushipe</a></div>
</div>
</template>

<script>
import axios from 'axios';
export default {

  data() {
    return {
      target_types: [],
      rules: [],
      new_target: {},
      saved_targets: [],
      selected_rule: {},
    }
  },

  created() {
    this.getTargetTypes();
  },

  methods: {

    showModal(target) {
      this.selected_rule = target;
        
        this.$bvModal.show('bv-modal-example');
      },

      hideModal() {
        this.$bvModal.hide('bv-modal-example');
      },

      showModalExists() {
        
        this.$bvModal.show('bv-modal-exists');
      },

      hideModalExists() {
        this.$bvModal.hide('bv-modal-exists');
      },

    getRules() {
      
      const id = this.new_target.type.id;
      let url = '';
      
      switch(id) {
        case 1: url = 'https://private-anon-dbf7a9eab8-adcashdsp.apiary-mock.com/categories'; break;
        case 2: url = 'https://private-anon-dbf7a9eab8-adcashdsp.apiary-mock.com/countries'; break;
        case 3: url = 'https://private-anon-dbf7a9eab8-adcashdsp.apiary-mock.com/devices'; break;
        case 4: url = ''; break;
        default: url = ''; 
  } 

      if (url !='') {
      axios.get(url)
      .then(response => {
        this.rules = response.data;
      })
      .catch(error => {
        console.log(error);
      });

      } else {
        this.rules = [];
      }

    },

    getTargetTypes() {
      axios.get('https://private-anon-dbf7a9eab8-adcashdsp.apiary-mock.com/types')
      .then(response => {
        this.target_types = response.data;
      })
      .catch(error => {
        console.log(error);
      })
    },

    saveChanges() {
      alert('Save changes button clicked')
    },

    resetRules() {
      this.new_target = {};
    },

    removeRule(target) {
      this.saved_targets.splice(this.saved_targets.indexOf(target), 1);
      this.hideModal();
    },

    addRule() {

      if (this.saved_targets.some(e => e.type === this.new_target.type)) {
        this.showModalExists();
      } else {
        
      this.saved_targets.push(this.new_target);
      this.new_target = {};
      
      }
    }

  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
svg {
  vertical-align: middle;
  width: 1.1rem;
}
.badge {
  display: inline-block;
  padding: 0.5em 0.65em;
  font-size: 0.8rem;
  font-weight: normal;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  background: #198754;
}
.border-bottom {
  border-bottom: 1px solid #616161 !important;
}
</style>
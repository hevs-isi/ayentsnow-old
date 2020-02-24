<template>
    <div>
        <b-navbar toggleable="lg" type="light" id="navbar">
                <b-navbar-brand>
                    <div>
                        <img class="" src="https://www.hevs.ch/img/logo-hes-so-valais-2019.png" height="50em" >
                        <img class="pl-4" src="../assets/ayent.png" height="50em">
                    </div>
                    <div>

                    </div>
                </b-navbar-brand>
            <b-container>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item href="/#/">
                            CARTE
                        </b-nav-item>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">NEIGE</template>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">TEMPÉRATURE</template>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pro de Savioz'  } }">Pro de Savioz</b-dropdown-item>
                        </b-nav-item-dropdown>

                    </b-navbar-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="">
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content" >USER</template>
                                <!-- <b-form-checkbox v-model="checked" @change="checkedChanged" class="text-left ml-3"> Snow </b-form-checkbox>-->
                            <b-dropdown-item class="text-left ml-3">Login</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>
<script>
    /** import {serverBus} from "../main";*/

    export default {
        data() {
            return {
                checked:false,
            }

        },
        methods: {
            checkedChanged (){
                this.checked = !this.checked;
                /** serverBus.$emit('activeSnow', this.checked);*/
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #navbar {
        background-color: #B8B8B8;
    }
</style>

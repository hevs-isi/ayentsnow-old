<template>
    <div v-responsive.lg.xl.md.sm.xs>
        <b-navbar  toggleable="lg" type="light" id="navbar" >
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-navbar-brand >
                    <div >
                        <a href="https://www.hevs.ch/fr/" target="_blank">
                        <img class="" src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" height="50em" >
                        </a>
                        <a href="https://www.ayent.ch/">
                        <img class="pl-4" src="../assets/ayent.png" height="50em">
                        </a>
                    </div>

                </b-navbar-brand>
<!--                <b-navbar-toggle target="nav-collapse" tabs align="center"></b-navbar-toggle>   -->
                <b-collapse  id="nav-collapse" is-nav >
                    <b-navbar-nav  class="ml-auto" >
                        <b-nav-item  href="/#/" > <img src="../assets/svg/globalicon.svg" height="30"> </b-nav-item>

                        <b-nav-item-dropdown >
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content"> <img src="../assets/svg/snowIcon.svg" height="30"></template>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v0', sectorName: 'Pro De Savioz'  } }">Pro de Savioz</b-dropdown-item>

                        </b-nav-item-dropdown>

                        <b-nav-item-dropdown >
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content"><img src="../assets/svg/thermoIcon.svg" height="30">  </template>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pro de Savioz'  } }">Pro de Savioz</b-dropdown-item>
                        </b-nav-item-dropdown>

                        <!-- Test new button Contact with creation of a new page-->
                        <b-nav-item  href="/#/contact"><img src="../assets/svg/contactIcon.svg" height="30"></b-nav-item>

                    </b-navbar-nav>
                    <!-- Right aligned nav items -->
<!--                    <b-navbar-nav class="">     -->
<!--                        <b-nav-item-dropdown>   -->
                            <!-- Using 'button-content' slot -->
<!--                            <template slot="button-content" >USER</template>        -->
<!--                                 <b-form-checkbox v-model="checked" @change="checkedChanged" class="text-left ml-3"> Snow </b-form-checkbox> -->
<!--                            <b-dropdown-item class="text-left ml-3">Login</b-dropdown-item> -->
<!--                        </b-nav-item-dropdown> -->
<!--                    </b-navbar-nav>             -->
                </b-collapse>
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
        background-color: #c4d3eb; /*#f4f7fc*/
        font-family: Roboto;

    }
</style>

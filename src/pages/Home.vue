<template>
    <div class="home" style="padding-left: 20px; padding-right: 20px">
        <h1>Global</h1>
        <br><br>
        <div class="divLeft" v-if="window.width>windowLimitWidth">
        <b-container  fluid class="mh-100">
            <b-row>
                <transition name="slide">
                <b-col><!--880 px-->
                    <l-map
                            style="height: 880px; width: 100%"
                            :zoom="zoom"
                            :center="center"
                            @update:zoom="zoomUpdated"
                            @update:center="centerUpdated"
                            @update:bounds="boundsUpdated"
                            @click="printPosition"
                            @keypress="displayAntennasStatus"
                            class="leaflet-control-layers-list"

                    > <!--@click="printPosition" -->

                        <l-control-layers ref="control"
                                          :sort-layers="true"
                        />

                        <l-tile-layer :url="url" name="Satellite" layer-type="base" />                         <!--change url by url2 and it display first satellite -->
                        <l-tile-layer :url="url2" name="Carte" layer-type="base" />                            <!--change url2 by url and it display first carte -->

                        <l-layer-group
                                layer-type="overlay"
                                name="Capteurs"
                                :visible="true"

                                >
                            <l-marker v-for="(sensor,index) in sensors" :lat-lng="sensor.position" :key="index + 10"
                                      @click="loadData(sensor.id)" :icon="sensor.icon" :visible="true">
                                <l-popup>
                                    <div v-if="sensor.type===1">
                                        <h4>{{sensor.position_name}}</h4>
                                        <div>Hauteur de neige : {{sensor.pressure}} mm</div>
                                        <div>Température au sol : {{sensor.debit}} °C</div>
                                        <div>Température au capteur : {{sensor.debit}} °C</div>


                                    </div>
                                    <div v-if="sensor.type===2">
                                        <h4>{{sensor.position_name}}</h4>
                                        <div>Température du sol : {{sensor.temp}} °C</div>
                                    </div>
                                </l-popup>
                            </l-marker>
                        </l-layer-group>

                        <l-layer-group
                                layer-type="overlay"
                                name="Antennes "
                                :visible="true">

                            <!-- in downAntennas -->
                            <l-marker  v-for="(antenna,index) in antennas" :lat-lng="antenna.position" :key="index + 100"
                                      @click="lastSeenAntenna(antenna.eui, antenna.id)" :icon="antenna.icon"
                                      :visible="true">

                                <l-popup v-if="antenna.isUp == true">

                                    <h5>{{antenna.position_name}}</h5>
                                    <div>latitude: {{antenna.position[0]}}</div>
                                    <div>longitude: {{antenna.position[1]}}</div>
                                    <div>Vu il y a : {{antenna.lastSeen}} secondes</div>

                                </l-popup>
                                <l-popup v-else>
                                        <h5>{{antenna.position_name}}</h5>
                                        <div>latitude: {{antenna.position[0]}}</div>
                                        <div>longitude: {{antenna.position[1]}}</div>
                                        <div> DOWN depuis {{antenna.timestamp}}</div>

                                </l-popup>
                            </l-marker>
                        </l-layer-group>


                    </l-map>
                </b-col>
                </transition>

                <!--Button Status--> <!-- delete layer group to see the button-->

                <b-button  class="btn" squared variant="null" @click="toggleStatus" style="height: fit-content; align-self: center"></b-button>
                <transition name="slide">

                    <b-col v-if="showStatus" cols="3" class="align-self-center">
                    <b-card>
                        <div class="lucida">
                            <h1>Status antennes</h1>
                            <pre>Prochain test dans {{seconds}} secondes...</pre>
                            <div class="">
                                <div v-for="(antenna, index) in antennas" :key="index+200">
                                          <div v-if="antenna.isUp">
                                        <p class="text-left">> {{antenna.position_name}}</p>
                                        <pre class="text-left">     <span style="color: green">OK</span> </pre>
                                    </div>
                                    <div v-else>
                                        <p class="text-left">
                                            > Status {{antenna.position_name}}
                                        </p>
                                        <pre class="text-left">     <span style="color: red">DOWN</span> depuis {{antenna.timestamp}}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-col>
               </transition>

            </b-row>
        </b-container>
        </div>
        <!--big screen temperature-->
        <div class="divRight" v-if="window.width>windowLimitWidth">
            <h2> Température du sol</h2>
            <TemperatureChartGlobal :dataTemperatureGlobalChart="series_dual"/>
            <p> Température actuelle Télécabine : {{lastTempTelecabine}}°C </p>
            <p> Température actuelle Pralan : {{lastTempPralan}}°C </p>
            <p> Température actuelle Pro de Savioz : {{lastTempProDeSavioz}}°C </p>


            <br><br>
        </div>
        <!--small screen temperature-->
        <div  v-if="window.width<=windowLimitWidth">
            <h2>Température du sol</h2>
            <p style="padding-bottom: 6px;padding-top: 6px"> Température actuelle Télécabine : {{lastTempTelecabine}}°C </p>
            <p style="padding-bottom: 6px"> Température actuelle Pralan : {{lastTempPralan}}°C </p>
            <p style="padding-bottom: 6px"> Température actuelle Pro de Savioz : {{lastTempProDeSavioz}}°C </p>
            <br><br>
        </div>
        <!--big screen neige-->
        <div class="divRight" v-if="window.width>windowLimitWidth">
            <h2 > Hauteur de neige</h2>
            <br>

            <table class="table table-striped">
                <thead class="thead-light">
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Il y a 1h</th>
                    <th scope="col">Il y a 30min</th>
                    <th scope="col">Actuellement</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">Télécabine</th>
                    <td>1 cm</td>
                    <td>2 cm</td>
                    <td>3 cm</td>
                </tr>
                <tr>
                    <th scope="row">Pralan</th>
                    <td>4 cm</td>
                    <td>5 cm</td>
                    <td>6 cm</td>
                </tr>
                <tr>
                    <th scope="row">Pro De Savioz</th>
                    <td>7 cm</td>
                    <td>8 cm</td>
                    <td>9 cm</td>
                </tr>

                </tbody>
            </table>
            <!--small screen neige-->
        </div>
        <div  v-if="window.width<=windowLimitWidth">
            <h2> Hauteur de neige</h2>
            <br>

            <table class="table table-striped">
                <thead class="thead-light">
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Il y a 1h</th>
                    <th scope="col">Il y a 30min</th>
                    <th scope="col">Actuellement</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">Télécabine</th>
                    <td>1 cm</td>
                    <td>2 cm</td>
                    <td>3 cm</td>
                </tr>
                <tr>
                    <th scope="row">Pralan</th>
                    <td>4 cm</td>
                    <td>5 cm</td>
                    <td>6 cm</td>
                </tr>
                <tr>
                    <th scope="row">Pro De Savioz</th>
                    <td>7 cm</td>
                    <td>8 cm</td>
                    <td>9 cm</td>
                </tr>

                </tbody>
            </table>


        </div>
       <!-- Width: {{ window.width }},-->
       <!-- Height: {{ window.height }}-->
  </div>

</template>


<script>
    import {LMap, LTileLayer, LMarker, LPopup, LControlLayers, LLayerGroup} from 'vue2-leaflet'
    import Influx from 'influx'
    import {Icon} from 'leaflet'
    import L from 'leaflet'
    import axios from 'axios'
    import credInflux from '../constants/influx'

    import TemperatureChartGlobal from "../components/TemperatureChartGlobal";
    import moment from "moment";
    import NProgress from "nprogress";
    delete Icon.Default.prototype._getIconUrl;

    const queryTempTelecabine = 'select "payload_fields_Illuminance_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + '' + "'" + 'AND time>now()-3h';
    const queryTempPralan = 'select "payload_fields_Illuminance_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/70b3d57ba0000bd0/up' + "'" + 'AND time>now()-3h';
    const queryTempProDeSavioz = 'select "payload_fields_Air humidity_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + "'"  + 'AND time>now()-3h' ;


    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });


    export default {
        name: 'home',
        components: {
            LMap, LTileLayer, LMarker, LPopup, LControlLayers, LLayerGroup, TemperatureChartGlobal

        },
        data() {
            return {
                arrow: require('../assets/svg/left_arrow.svg'),
                showStatus:false,                                                                                       //right button to show antenna status
                timer: null,
                timerIsRunning: false,
                seconds: 30,
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                url2: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 13,
                center: [46.26664685678397, 7.401180267333985],
                bounds: null,
                markers: [
                    [46.096715752047594, 7.214045226573945],
                    [46.093561170654304, 7.212307155132295],
                ],

                sensors: [{
                    type: 1,
                    id: 1,
                    position_name: 'Télécabine',
                    pressure: "-",
                    debit: "-",
                    level: "-",
                    position: [46.29411, 7.39557],
                    icon: this.deviceIcon()
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'Pralan',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.29894, 7.40549],
                    icon: this.deviceIcon()
                }, {
                    type: 2,
                    id: 3,
                    position_name: 'Pro de Savioz',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.26721, 7.39827],
                    icon: this.deviceIcon()
                }],
                antennas: [{
                    type: 1,
                    id: 1,
                    position_name: 'Privée',
                    position: [46.27141, 7.39897],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c22',// need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'École de Botyre',
                    position: [46.27731, 7.40595],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c7b', // need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 3,
                    position_name: 'Office du tourisme',
                    position: [46.29733, 7.40000],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe106166', // need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 5,
                    position_name: 'HEVs',
                    position: [46.24046242, 7.35863492],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe110106',
                    lastSeen: "-",
                    timestamp: "",
                    isUp: false,
                }],
                response: "",
                downAntennas:[],

     //----------Window
                window:{
                    width:0,
                    height:0,
                },
                windowLimitWidth : 700,
    //-----------Temperature
                series_dual:[{
                    data: [],
                }],
                lastTempTelecabine:"",
                lastTempPralan:"",
                lastTempProDeSavioz:"",
    //-----------Neige


            }

        },
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            this.checkAntenna();
    //        this.activeGateways();
            this.startTimer();
            this.checkDevice();

        },
        mounted() {
            this.dualData(queryTempTelecabine, queryTempPralan,queryTempProDeSavioz)

        },
        //VERY VERY important !! Destroy the timer when the user change the page
        beforeDestroy() {
            clearInterval(this.timer);
        },

        destroyed() {
            window.removeEventListener('resize', this.handleResize);

        },
        methods: {
            checkDevice(){
            //     var appID = "altis-irrigation-app";
            //     var accessKey = "ttn-account-v2.YdStTLbI0FKK9DfIFVo8fYKQdw23ct_WGeVZHWp2F3w";
            //     console.log("Program running");
            //
            //     ttn.data(appID, accessKey).then(function (client) {
            //         client.devices(function (devices) {
            //             console.log("Received list of devices")
            //             console.log(devices)
            //         })
            //     })
            //         .catch(function (error) {
            //             console.error("Error", error);
            //         });
             },
            toggleStatus(){
                if (this.showStatus){
                    this.arrow = require('../assets/svg/left_arrow.svg')
                } else {
                    this.arrow = require('../assets/svg/right_arrow.svg')
                }

                this.showStatus = !this.showStatus
            },
            startTimer() {
                if (!this.timerIsRunning) {
                    this.timerIsRunning = true;
                    if (!this.timer) {
                        this.timer = setInterval(this.secondsCallback, 1000);
                    }
                }
            },
            secondsCallback() {
                if (this.seconds <= 0) {
                    this.seconds = 30;
                    this.checkAntenna();

                }
                else if (this.seconds < 31) {
                    this.seconds--;
                }

            },
            zoomUpdated(zoom) {
                this.zoom = zoom;
            },
            centerUpdated(center) {
                this.center = center;
            },
            boundsUpdated(bounds) {
                this.bounds = bounds;
            },

            /**
             * Load data for icon popup
             * !!! change querry with real sensor !!!
             * @param id
             */
            loadData(id) {
                switch (id) {
                    case 1:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("DistanceComputed") FROM "level-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 2:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 3:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 4:
                        Promise.all([client.query('SELECT last("Distance") FROM "level-sensor-5"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[3].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 5:

                        Promise.all([client.query('SELECT last("Soil temperature") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].temp = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("Volumetric water content") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].humidity = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;

                }
            },

            /**
             * print position clicked with the mouse
             */
            printPosition(event) {
                console.log(event.latlng);
            },

            /**
             * print a key if the condition is true, used to display antennas status
             * @param event
             */
            displayAntennasStatus(event){
                if(event.originalEvent.key == 's'){
                    this.toggleStatus()
                    console.log(event.originalEvent.key)
                }

            },

            /**
             * set device icon
             * @returns {*}
             */
            deviceIcon() {
                return L.icon({
                    iconUrl: require('../assets/gps.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                })
            },

            /**
             * set antennas up icon
             * @returns {*}
             */
            antennaIconUp() {
                return L.icon({
                    iconUrl: require('../assets/antennaUp.svg'),
                    iconSize: [80, 80], //64 64
                    iconAnchor: [40, 40],
                    popupAnchor: [0, 0]
                })
            },

            /**
             * set antennas down icon
             * @returns {*}
             */
            antennaIconDown() {
                return L.icon({
                    iconUrl: require('../assets/antennaDown.svg'),
                    iconSize: [80, 80],
                    iconAnchor: [40, 40],
                    popupAnchor: [0, 0]
                })
            },

            /**
             *
             * @param eui
             * @param id
             */
            lastSeenAntenna(eui, id) {
                axios('https://nodered.watermon.ch/gateway?eui=' + eui, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((response) => {
                    let now = new Date();
                    let current_datetime = new Date(response.data.timestamp);
                    let diffTime = (Math.abs(now - current_datetime) / 1000);

                    let formatedDate = Math.ceil(diffTime);
                    this.antennas[id - 1].lastSeen = formatedDate;

                }).catch((e) => {
                    console.log(e);
                });


            },

            /**
             * check all antennas if up or down
             */
            checkAntenna() {
                console.log("Check status antennas");
                for (let i = 0; i < this.antennas.length; i++) {

                    axios('https://nodered.watermon.ch/gateway?eui=' + this.antennas[i].eui, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'origin', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((res) => {
                        let timestamp = new Date(res.data.timestamp);
                        this.antennas[i].timestamp = timestamp
                        let now = new Date();

                        if (this.secondBetweenDate(now, timestamp) < 60) {
                            // to display only the down antennas : create an icon with only transparent background.
                            this.antennas[i].icon = this.antennaIconUp();
                            this.antennas[i].isUp = true;
                            console.log("check antenna : up")

                        } else {
                            this.antennas[i].icon = this.antennaIconDown();
                            this.antennas[i].isUp = false;
                            console.log("check antenna : down")
                            this.downGateways(i)
                        }

                    });

                }


            },

            /**
             * find time between two dates, used to check the antennas
             * @param date1
             * @param date2
             * @returns {number}
             */
            secondBetweenDate(date1, date2) {
                return Math.ceil(Math.abs(date1 - date2) / 1000);
            },

            /**
             * refresh the list of the down antennas
             * @param i
             */
            downGateways(antennaList){

                console.log("activeGateways, home.vue l 436")

                        this.downAntennas[antennaList] = this.antennas[antennaList]
                        console.log(antennaList)
                        console.log(this.antennas[antennaList].isUp)

                console.log("active")
                for (let j = 0; j < this.downAntennas.length; j++) {

                    console.log(j)
                    console.log(this.downAntennas[j])
                }

            },

    //-----------------------------------END MAP PART-------------------------------------------------------------------
    //----------------------------------WINDOW PART --------------------------------------------------------------------

            handleResize : function(){
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
            },
    //---------------------------------START CHART PART-----------------------------------------------------------------
            /**
             * load temperature floor from Télécabine, Pralan AND PRo de Savioz
             * @param queryTelecabine
             * @param queryPralan
             * @param queryProDeSavioz
             */
            dualData: function(queryTelecabine, queryPralan, queryProDeSavioz) {
                let serie1;
                let serie2;
                let serie3;
                console.log(queryProDeSavioz)
                console.log("home.vue l 584 : dualdata load")
                Promise.all([
                    client.query(queryTelecabine),
                ]).then(parsedRes => {
                    serie1 = parsedRes.map( arr => {
                        this.lastTempTelecabine = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2); // temperature sol

                        return Object.assign({}, {
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Illuminance_value']
                            }))
                        });

                    });

                    Promise.all([
                        client.query(queryPralan),
                    ]).then(parsedRes => {
                        serie2 = parsedRes.map( arr => {
                            this.lastTempPralan = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2); //temperature capteur

                            return Object.assign({}, {
                                data: arr.map( obj => Object.assign({}, {
                                    x: (moment(obj.time).unix())*1000,
                                    y: obj['payload_fields_Illuminance_value']
                                }))
                            });

                        });

                        Promise.all([
                            client.query(queryProDeSavioz),
                        ]).then(parsedRes => {
                            serie3 = parsedRes.map( arr => {
                                this.lastTempProDeSavioz = arr[arr.length-1]['payload_fields_Air humidity_value'].toFixed(2); //temperature capteur

                                return Object.assign({}, {
                                    data: arr.map( obj => Object.assign({}, {
                                        x: (moment(obj.time).unix())*1000,
                                        y: obj['payload_fields_Air humidity_value']
                                    }))
                                });

                            });
                        //build final objet to send to chart
                        let serieFinal = [{
                            name : 'Télécabine',
                            color : '#4285f4', //bleu
                            type : 'spline',
                            turboThreshold:60000,           // if no data displayed : augmented it
                            data : serie1[0].data
                        },{
                            name : 'Pralan',
                            color : '#f4b400', //orange
                            type : 'spline',
                            turboThreshold:60000,           // if no data displayed : augmented it
                            data :serie2[0].data,
                        },{
                            name : 'Pro de Savioz',
                            color : '#006600', //orange
                            type : 'spline',
                            turboThreshold:60000,           // if no data displayed : augmented it
                            data :serie3[0].data,
                        }]

                        this.series_dual = serieFinal
                        NProgress.done();
                        }).catch(error => console.log(error))
                    }).catch(error => console.log(error))
                }).catch(error => console.log(error))
            },

    //--------------------------------END CHART TEMPERATURE-------------------------------------------------------------
    //-------------------------------START CHART NEIGE------------------------------------------------------------------


        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../node_modules/leaflet/dist/leaflet.css";



    .lucida h1 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 24px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 26.4px;
    }

    .lucida h3 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 14px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 15.4px;
    }

    .lucida p {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .lucida blockquote {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 17px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }

    .lucida pre {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }


    .leaflet-control-layers-list {
        text-align: left;
    }


    html, body {
        height: 100%;
        background-color: #f4f7fc;

    }

    *{
        font-family: Roboto;
        margin: 0;
        padding: 0;

    }
    .divLeft{
        width: 40%;
        height: 100%;
        float: left;
        text-align: center;
    }
    .divRight{
        width: 60%;
        height: 100%;
        float: right;
        text-align: center;
        padding-left: 20px;

    }
    .btn {
        padding: 0px 0px;
    }

</style>

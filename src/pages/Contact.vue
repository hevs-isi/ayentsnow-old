<template>
    <div class="info" id="contact">
        <b-jumbotron>
            <template v-slot:header>Ayent Snow</template>

            <template v-slot:lead>
                <br>
                <p>Le projet de monitoring de l'état des routes par la</p>
                <a href="https://www.hevs.ch/fr/" target="_blank">
                    <img class="ml-3" src="https://www.hevs.ch/img/logo-hes-so-valais-2019.png" height="100em" >
                </a>

                <br><br>

                <p class="m-3"> en partenariat avec</p>
                <a href="https://www.ayent.ch/" target="_blank">
                    <img class="pl-4" src="https://www.ayent.ch/data/images/accroches/wpThumbnails/Ayent.jpg" height="100em">
                </a>

                <br><br><br>

                <p style=font-weight:bold> HES-SO Haute école d'ingénierie </p>
                <p> Route du Rawyl 47</p>
                <p> Case postale 2134</p>
                <p> 1950 Sion 2</p>
                <br>
                <p> +41 (0)58 606 85 11</p>
                <p> pierre-andre.mudry@hevs.ch </p>

                <br><br>

            </template>

            <hr class="my-4">
            <b-carousel
                    id="carousel-fade"
                    style="text-shadow: 0 0 2px #000"
                    fade
                    indicators
                    class="w-75 m-auto"
            >

                <b-carousel-slide img-src="https://www.anzere.ch/data/images/accroches/Rando/170730_ot_anzere_bisse_ayent_420.jpg">
                    <h3> source : ayent.ch</h3>
                </b-carousel-slide>
                <b-carousel-slide img-src="https://www.ayent.ch/data/images/galeries/villages/La-Place.jpg">
                    <h3> source : ayent.ch</h3>
                </b-carousel-slide>
                <b-carousel-slide img-src="https://www.anzere.ch/data/images/accroches/Rando/171019_ot_anzere_rawyl_025_m.jpg" >
                    <h3> source : anzere.ch</h3>
                </b-carousel-slide>

            </b-carousel>
        </b-jumbotron>
    </div>
</template>

<script>
    export default {
        name: "Contact",
        components: {},
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
    #contact {
        font-family: Roboto;
    }

</style>

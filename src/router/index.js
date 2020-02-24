//Test new head 2
import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/Home'
import neige from '../pages/Neige'
import temperature from '../pages/Temperature'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/neige/:sectorName',
            name: 'neige',
            props: true,
            component: neige
        },
        {
            path: '/temperature/:sectorName',
            name: 'temperature',
            props: true,
            component: temperature
        },
    ],

})

export default router

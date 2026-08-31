import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './app.vue'
import HomePage from './pages/index.vue'
import ArtworkGraph from './services/artworkGraph.js'

// Set up app
const app = createApp(App)

// provide artwork graph app wide
const artworkGraph = new ArtworkGraph()
app.provide('artworkGraph', artworkGraph)

// Set up router
const routes = [
    { path: '/', component: HomePage },
    { path: '/:catchAll(.*)', redirect: '/' },
]
const router = createRouter({ routes, history: createWebHistory() })
app.use(router)

app.mount('body')

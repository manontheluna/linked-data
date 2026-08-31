<template>
    <main>
        <div class="control-panel">
            <input type="text" v-model="searchQuery">
            <button @click="getArtworks(searchQuery)">
                submit
            </button>
            <ul class="artworks">
                <li
                    v-for="(work, index) in works"
                    :key="index"
                    @click="(() => { console.log(work) })"
                >
                    {{ work.label.value }}
                </li>
            </ul>
        </div>
        <div class="visualizer"></div>
    </main>
</template>

<script setup>
import { inject, ref } from 'vue'
const artworkGraph = inject('artworkGraph')

const works = ref()
const searchQuery = ref()

async function getArtworks(searchQuery) {
    works.value = await artworkGraph.userSearch(searchQuery)
    console.log('works in ui: ', works.value)
}
</script>

<style lang="sass">
main
    display: flex
    height: 100vh
    .artworks
        display: flex
        flex-direction: column
        gap: 1rem
        li
            border: 1px dashed
    .control-panel
        border: 1px dashed red
        height: 100%
        flex-shrink: 0
        width: calc(100% / 5)
    .visualizer
        border: 1px dashed blue
        flex-grow: 1
</style>

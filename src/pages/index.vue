<template>
    <main>
        <div class="control-panel">
            <label>
                Search For Artwork
                <input type="text" v-model="searchQuery">
            </label>
            <button @click="getArtworks(searchQuery)">
                submit
            </button>
            <ul class="artworks">
                <li
                    v-for="(work, index) in works"
                    :key="index"
                    @click="getArtworkData(work.artwork.value)"
                >
                    {{ work.label.value }}
                </li>
            </ul>
        </div>
        <div class="visualizer" ref="visualizer">
            <div v-if="nodes" class="center-node">
                <span>
                    {{ nodes?.label }}
                </span>
            </div>
            <!-- related nodes - based on properties gathered using linkedart.js -->
            <div
                v-for="(prop, index) in properties"
                class="related-property"
                :key="index"
                :style="{ top: `${prop.y}px`, left: `${prop.x}px` }"
                @click="getRelatedData(prop)"
            >
                <span>
                    {{ prop.key }}
                </span>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
const artworkGraph = inject('artworkGraph')

const works = ref()
const searchQuery = ref()
const visualizer = ref()
// visualizer dimensions
const dims = ref()

async function getArtworks(searchQuery) {
    works.value = await artworkGraph.userSearch(searchQuery)
}

const nodes = ref()
async function getArtworkData(uri) {
    nodes.value = await artworkGraph.getArtwork(uri)
}

const properties = computed(() => {
    if (!nodes.value) return []
    // filter out id and label dont need for this part of ui
    const keys = Object.keys(nodes.value).filter(key => key !== 'id' && key !== 'label')

    const step = Math.PI * 2 / keys.length

    const cx = dims.value.width / 2
    const cy = dims.value.height / 2

    // center related nodes based on viewport
    // TODO: it would be nice to have a resize observer
    const keysWithAngle = keys.map((key, i) => {
        const angle = i * step
        return {
            key,
            x: cx + Math.cos(angle) * 150,
            y: cy + Math.sin(angle) * 150
        }
    })
    return keysWithAngle
})

async function getRelatedData(label) {
    // this is a problem
    const property = nodes.value[label.key]
    // some properties come as an array, some as an object, check before just in case
    // currently grabbing just the first of any objects for testing and GUI purposes
    // TODO: should iterate through properties to get all relevant values
    const relationship = Array.isArray(property) ? property[0] : property
    // if no id just exit
    if (!relationship.id) return
    const data = await artworkGraph.getSecondaryRelationship(relationship.id)
    nodes.value = data
}

onMounted(() => {
    dims.value = visualizer.value.getBoundingClientRect()
})
</script>

<style lang="sass">
main
    display: flex
    height: 100vh
    input
        width: 100%
    span
        text-overflow: ellipsis
        max-width: 100%
        white-space: nowrap
        overflow: hidden
        padding: .5rem
    .artworks
        display: flex
        flex-direction: column
        gap: .5rem
        list-style: none
        li
            cursor: pointer
            padding: .5rem
            background: lightblue
            border-radius: .5rem
    .center-node
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 8rem
        height: 8rem
        background: lightblue
        border-radius: 100%
        display: flex
        align-items: center
        justify-content: center
    .control-panel
        height: 100%
        flex-shrink: 0
        width: calc(100% / 4)
        display: flex
        flex-direction: column
        padding: 1rem
        gap: .5rem
        background: #ededed
    .related-property
        position: absolute
        transform: translate(-50%, -50%)
        width: 4rem
        height: 4rem
        background: lightpink
        border-radius: 100%
        display: flex
        align-items: center
        justify-content: center
        transition: .2s all ease-in-out
        cursor: pointer
    .visualizer
        flex-grow: 1
        position: relative
        background: #000
</style>

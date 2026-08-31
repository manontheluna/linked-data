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
                    @click="getArtworkData(work.artwork.value)"
                >
                    {{ work.label.value }}
                </li>
            </ul>
        </div>
        <div class="visualizer" ref="visualizer">
            <div v-if="nodes" class="center-node">
                {{ nodes?.label }}
            </div>
            <!-- related nodes -->
            <div
                v-for="(prop, index) in properties"
                class="related-property"
                :key="index"
                :style="{ transform: `translate(${prop.x}px, ${prop.y}px)`}"
            >
                <span>
                    {{ prop.k }}
                </span>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
const artworkGraph = inject('artworkGraph')

const works = ref()
const searchQuery = ref()
const visualizer = ref()

async function getArtworks(searchQuery) {
    works.value = await artworkGraph.userSearch(searchQuery)
    console.log('works in ui: ', works.value)
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
    console.log(step)
    const keysWithAngle = keys.map((k, i) => {
        const angle = i * step
        return {
            k,
            x: Math.cos(angle) * 150,
            y: Math.sin(angle) * 150
        }
    })
    return keysWithAngle
})

</script>

<style lang="sass">
main
    display: flex
    height: 100vh
    input
        width: 100%
    .artworks
        display: flex
        flex-direction: column
        gap: 1rem
        li
            border: 1px dashed
            cursor: pointer
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
        border: 1px dashed red
        height: 100%
        flex-shrink: 0
        width: calc(100% / 5)
    .related-property
        position: absolute
        top: 50%
        left: 50%
        width: 4rem
        height: 4rem
        background: lightpink
        border-radius: 100%
        display: flex
        align-items: center
        justify-content: center
        text-overflow: ellipsis
        span
            text-overflow: ellipsis
    .visualizer
        border: 1px dashed blue
        flex-grow: 1
        position: relative

</style>

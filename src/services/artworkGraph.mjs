// example query
// https://data.getty.edu/museum/collection/<ENTITY_TYPE>/<ENTITY_ID>

import {
    getCarriedOutBy,
    getClassifications,
    getCultures,
    getDigitalImages,
    getDimensionsDescriptions,
    getMaterialStatements,
    getProductionTimespans,
    getWorkTypes
} from '@thegetty/linkedart.js'

// getty collection url
const URL = 'https://data.getty.edu/museum/collection/'
// sparql
const SPARQL_ENDPOINT = 'https://data.getty.edu/museum/collection/sparql'

export default class ArtworkGraph {
    // queries DB what user inputs
    async userSearch(query) {
        const searchQuery = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT ?artwork ?label WHERE {
                ?artwork rdf:type <http://www.cidoc-crm.org/cidoc-crm/E22_Human-Made_Object> .
                ?artwork rdfs:label ?label .
                FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${query}")))
            }
        `

        const response = await fetch(SPARQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                Accept: 'application/sparql-results+json'
            },
            body: searchQuery
        })

        const data = await response.json()
        return data.results.bindings
    }

    async getArtwork(uri) {
        const response = await fetch(`${uri}`)
        const data = await response.json()

        // return carried out by, classifications, cultures, digital images, material statements, production timespans
        // work types
        return {
            data,
            creator: getCarriedOutBy(data),
            classifications: getClassifications(data),
            cultures: getCultures(data),
            images: getDigitalImages(data),
            dims: getDimensionsDescriptions(data),
            timespans: getProductionTimespans(data),
            materials: getMaterialStatements(data)
        }
    }
}
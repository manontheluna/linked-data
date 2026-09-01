// example query
// https://data.getty.edu/museum/collection/<ENTITY_TYPE>/<ENTITY_ID>

import {
    getCarriedOutBy,
    getClassifications,
    getCultures,
    getDigitalImages,
    getDimensionsDescriptions,
    getFieldValuesByClassifications,
    getPrimaryName,
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

        // returns artwork + related properties to display on GUI
        return {
            id: data.id,
            label: getPrimaryName(data),
            creator: getCarriedOutBy(data),
            // classifications: getClassifications(data),
            // cultures: getCultures(data),
            // images: getDigitalImages(data),
            dimensions: getDimensionsDescriptions(data),
            timespans: getProductionTimespans(data),
            // use explicit material value here, contains uri for further queries
            // materials: data.made_of,
            types: getWorkTypes(data)
        }
    }

    async getSecondaryRelationship(uri) {
        const data = await fetch(`${uri}`)
        const response = await data.json()

        if (response.type === 'Person') {
            return {
                id: response.id,
                label: response._label,
                born: response.born,
                died: response.died,
                classifications: getClassifications(response),
                identifiedBy: response.identified_by
            }
        }
        return response
    }
}
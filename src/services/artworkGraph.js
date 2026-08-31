// example query
// https://data.getty.edu/museum/collection/<ENTITY_TYPE>/<ENTITY_ID>

// getty collection url
const URL = 'https://data.getty.edu/museum/collection/'
// sparql
const SPARQL_ENDPOINT = 'https://data.getty.edu/museum/collection/sparql'

export default class ArtworkGraph {
    async userSearch(query) {
        console.log('@before query')
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

        console.log('@after query')

        const data = await response.json()
        console.log('query data/json: ', data)

        console.log('results: ', data.results)
        console.log('first result: ', data.results.bindings[0].artwork.value)

        const artworkData = await fetch(`${data.results.bindings[0].artwork.value}`)
        console.log('artwork data: ', await artworkData.json())

        // console.log('getty collection data: ', await fetch(``))
        return data.results.bindings
    }
}
import * as algoliasearch from 'algoliasearch'

const client = algoliasearch(`APP_ID`, `API_KEY`);
import { flatMap, pick, omit } from 'lodash'


export const getBySeveralCollections = (client: any) => async (indexesParams: []) => {
  // @ts-ignore
  return new Promise(async (resolve, reject) => {
    // @ts-ignore
    return client.search(indexesParams, (e, { results } = {}) => {
      if (e) return reject({ error: e })
      // @ts-ignore
      const data = flatMap(results.map(({ hits }) => hits)).map(doc => omit(doc, ['objectID', '_highlightResult']))
      return resolve({ data })
    })
  })
}

export const getByParams = (index: any) => async (attributesToRetrieve: string[], query: string, hitsPerPage: number = 10) => {
  // @ts-ignore
  return new Promise(async (resolve, reject) => {
    // @ts-ignore
    return index.search({ query, attributesToRetrieve, hitsPerPage }, (e, { hits } = {}) => {
      if (e) return reject({ error: e })
      // @ts-ignore
      return resolve({ data: hits.map(doc => pick(doc,attributesToRetrieve)) })
    })
  })
}

(async () => {
    // const adultIndex = client.initIndex(`adults`)
    // // @ts-ignore
    // const { data } = await getByParams(adultIndex)(['name', 'email'], 'ca', 5)
    // console.log(data)
  const query = [{
    indexName: 'adults',
    query: 'an',
    params: {
      attributesToRetrieve: ['name', `email`],
      hitsPerPage: 3,
    }
  },{
    indexName: 'children',
    query: 'an',
    params: {
      attributesToRetrieve: ['name', `age`],
      hitsPerPage: 5,
      filters: 'age <= 5'
    }
  }]

  // @ts-ignore
  const  { data, error } = await getBySeveralCollections(client)(query)
  console.log(data)
})()


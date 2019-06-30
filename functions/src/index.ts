import * as functions from 'firebase-functions'
import * as algoliasearch from 'algoliasearch'

const env = functions.config()

const client = algoliasearch(env.algolia.appid, env.algolia.apikey)
const adultsIndex = client.initIndex(`adults`)
const childrenIndex = client.initIndex(`children`)

export const algoliaAdultsSync = functions
  .firestore.document(`adults/{doc}`).onWrite(async (change, _context) => {
    const oldData = change.before
    const newData = change.after
    const data = newData.data()
    const objectID = newData.id // <---- prop name is important

    if (!oldData.exists && newData.exists) {
      // create
      return adultsIndex.addObject(Object.assign({}, {
        objectID
      }, data))
    } else if (!newData.exists && oldData.exists) {
      // deleting
      return adultsIndex.deleteObject(objectID)
    } else {
      // updating
      return adultsIndex.saveObject(Object.assign({}, {
        objectID
      }, data))
    }  
})

export const algoliaChildrenSync = functions
  .firestore.document(`children/{doc}`).onWrite(async (change, _context) => {
    const oldData = change.before
    const newData = change.after
    const data = newData.data()
    const objectID = newData.id // <---- prop name is important

    if (!oldData.exists && newData.exists) {
      return childrenIndex.addObject(Object.assign({}, {
        objectID
      }, data))
    } else if (!newData.exists && oldData.exists) {
      return childrenIndex.deleteObject(objectID)
    } else  {
      return childrenIndex.saveObject(Object.assign({}, {
        objectID
      }, data))
    }

  })
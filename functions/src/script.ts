import * as admin from 'firebase-admin'
const Chance = require('chance')
const chance = new Chance()
const serviceAccount = require(`./firebase-key.json`)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore()
const children = firestore.collection(`children`);
const adult = firestore.collection(`adults`);

(async () => {
  for (let i=1; i <= 500; i++) {
    children.doc().set({
      name: chance.name(),
      type: 'children',
      age: chance.age({ type: 'child' })
    })

    adult.doc().set({
      name: chance.name(),
      email: chance.email({ domain: "supercool.com" }),
      type: 'adults',
      age: chance.age({ type: 'adult' })
    })
  }
})()
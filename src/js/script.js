import { API } from '../../node_modules/oba-wrapper/js/index.js'

async function init() {
  const oba = new API()
  const stream = await oba.createStream("search/banaan")
  stream
    .pipe(toJSON)
}

function toJSON(stream) {
  console.log(stream)
}
init()

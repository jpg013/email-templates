async function connect(container) {
  const { cdn } = container

  if (!cdn) {
    return new Error('missing required dependency')
  }

  const retrieveObjectMetaData = key => cdn.headObject(key)
  const makeObjectLink = key => cdn.makeObjectLink(key)

  async function putObject(fileId, object, opts={}) {
    // Object exists?
    if (!opts.upsert && await retrieveObjectMetaData(fileId)) {
      return
    }

    try {
      const args = { ACL: 'public-read' }

      return await cdn.putObject(fileId, object, args)
    } catch(e) {
      console.log('error', e)
    }
  }

  return {
    makeObjectLink,
    putObject
  }
}

module.exports = Object.create({connect})

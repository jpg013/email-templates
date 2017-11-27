async function connect(container) {
  const { cdn } = container

  if (!cdn) {
    return new Error('missing required dependency')
  }

  async function retrieveObjectMetaData(key) {
    try {
      const metaData = await cdn.headObject(key)
    } catch(e) {
      console.log(e)
    }
  }

  const makeObjectLink = key => cdn.makeObjectLink(key)

  return {
    retrieveObjectMetaData,
    makeObjectLink
  }
}

module.exports = Object.create({connect})

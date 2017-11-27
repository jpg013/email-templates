async function connect(container) {
  const { cdn } = container

  if (!cdn) {
    return new Error('missing required dependency')
  }

  const retrieveObjectMetaData = key => cdn.headObject(key)
  const makeObjectLink = key => cdn.makeObjectLink(key)

  function putPublicObject(key, objectData, opts={}) {
    const args = {
      ...opts,
      ACL: 'public-read'
    }

    return cdn.putObject(key, objectData, args)
  }

  return {
    retrieveObjectMetaData,
    makeObjectLink,
    putPublicObject
  }
}

module.exports = Object.create({connect})

async function connect(container) {
  const { cache } = container

  if (!cache) {
    throw new Error('missing required cache dependency')
  }

  function set(key, val) {
    const result = cache.set(key, val)
    return result
  }

  function get(key) {
    return new Promise((resolve, reject) => {
      cache.get(key, (err, val) => err ? reject(err) : resolve(val))
    })
  }

  return {
    get,
    set
  }
}

module.exports = Object.create({ connect })

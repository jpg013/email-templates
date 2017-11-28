async function connect(container) {
  const { cache } = container

  if (!cache ) {
    throw new Error('missing required cache dependency')
  }

  async function set(key, val, opts={}) {
    if (!opts.upsert && await exists(key)) {
      return
    }

    return await cache.set(key, val)
  }

  function get(key) {
    return new Promise((resolve, reject) => {
      cache.get(key, (err, val) => err ? reject(err) : resolve(val))
    })
  }

  function exists(key) {
    return new Promise((resolve, reject) => {
      cache.exists(key, (err, val) => err ? reject(err) : resolve(val))
    })
  }

  return {
    get,
    set
  }
}

module.exports = Object.create({ connect })

const reqBasic = async (ctx, next) => {
  try {
    await next
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'Nope... you need to authenticate first. With a proper user!'
    } else {
      throw err
    }
  }
}

module.exports = {
  reqBasic
}

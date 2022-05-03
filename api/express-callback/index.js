module.exports = function makeExpressCallback(controller) {
  return (req, res, next) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      user: req?.user,
      file: req?.file,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent')
      }
    }
    controller(httpRequest)
      .then(httpResponse => {
        const { statusCode, message, data = {}, cookies = null } = httpResponse;
        if(cookies) {
          cookies.forEach(cookie => {
            const { key, value, options } = cookie;
            res.cookie( key, value, options );
          });
        }
        res.status(statusCode).send({ message, data })
      })
      .catch(error => next(error))
  }
}
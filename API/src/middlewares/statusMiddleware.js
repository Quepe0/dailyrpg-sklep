function handleBadRequest(err, req, res, next) {
    if (err.statusCode === 400) {
      res.status(400).json({
        message: "Złe żądanie"
      })
    } else {
      next(err);
    }
}
  
function handleInternalServerError(err, req, res, next) {
    if (err.statusCode === 500) {
      console.error(err.stack);
      res.status(500).json({
        message: "Wystąpił błąd serwera"
      })
    } else {
      next(err);
    }
}
  
function handleServiceUnavailable(err, req, res, next) {
    if (err.statusCode === 503) {
      res.status(503).json({
        message: "Serwer niedostępny"
      })
    } else {
      next(err);
    }
}
  
function handleNotFound(req, res) {
    res.status(404).json({
        message: "Podana lokalizacja nie została odnaleziona"
    })
}
  
module.exports = {
    handleBadRequest,
    handleInternalServerError,
    handleServiceUnavailable,
    handleNotFound,
};  
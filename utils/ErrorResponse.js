class ErrorResponse extends Error{
    constructor(error, statusCode){
        super(error)
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.message)
    }
}

module.exports = ErrorResponse;
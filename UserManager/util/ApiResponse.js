var ApiResponse = function (cnf) {
    this.success = cnf.success;
    this.extras = cnf.extras;
    this.message = cnf.message;
    this.info = cnf.info;
};

module.exports = ApiResponse;
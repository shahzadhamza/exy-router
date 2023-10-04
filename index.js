const validate = require("./validate");
const swagger = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const methods = require("methods");

const r = function (req, res, next) {
  const self = this;
  var slice = Array.prototype.slice;
  methods.concat("all").forEach(function (method) {
    self[method] = function (path) {
      let route = this.route(path);
      let schema;
      if (typeof arguments[1] !== "function" && !Array.isArray(arguments[1])) {
        schema = arguments[1];
        route[method].apply(route, [
          validate(schema),
          ...slice.call(arguments, 2),
        ]);
      } else {
        route[method].apply(route, slice.call(arguments, 1));
      }
      swagger.addSpec(path, method, schema);
      return this;
    };
  });

  self.setupDocs = function (path, options = {}) {
    swagger.init(options);
    this.use(path, swaggerUi.serve, (req, res, next) => {
      if (swagger?.spec) {
        swaggerUi.setup(swagger.spec)(req, res, next);
      }
      next();
    });
  };

  return this.call(req, res, next);
};

module.exports = (expressRouter) => {
  return r.bind(expressRouter);
};

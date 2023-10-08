const Ajv = require("ajv").default;
const ajv = new Ajv();

function validate(schema, data) {
  const _validate = ajv.compile(schema);
  const isValid = _validate(data);
  if (isValid) {
    return true;
  } else {
    throw _validate.errors;
  }
}

module.exports = (data) => (req, res, next) => {
  try {
    if (data?.schema) {
      const { schema } = data;
      if (schema?.body) {
        validate(schema.body, req.body);
      }
      if (schema?.params) {
        validate(schema.params, req.params);
      }
      if (schema?.query) {
        validate(schema.query, req.query);
      }
      if (schema.response) {
        const r = function (body) {
          try {
            const s = schema.response[res.statusCode];
            if (validate(s, body)) {
              this.call(res, body);
            }
          } catch (err) {
            res.statusCode = 400;
            this.call(res, err).end();
          }
        };
        res.json = r.bind(res.json);
      }
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err).end();
  }
};

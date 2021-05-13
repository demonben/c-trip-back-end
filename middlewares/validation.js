const Ajv = require('ajv').default;
const ajv = new Ajv();

function validateBody(schema) {
  const validateNewPet = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validateNewPet(req.body);
    if (!valid) {
      res.status(400);
      res.send({ errors: validateNewPet.errors });
    } else {
      next();
    }
  };
}

module.exports = validateBody;

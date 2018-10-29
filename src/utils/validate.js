const validator = require('jsonschema').validate

const schema = {
  type: 'Object',
  required: true,
  properties: {
    id: {
      type: 'integer',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    breed: {
      type: 'string',
      required: true,
    },
    birthYear: {
      type: 'number',
      required: true,
    },
    photo: {
      type: 'string',
      format: 'url',
    },
  },
}

// lets throw error if validation fails
function validate(data) {
  validator(data, schema, { throwError: true })
}

module.exports = validate

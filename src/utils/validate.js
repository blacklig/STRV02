const validator = require('jsonschema').validate

const schema = {
    type: 'Object',
    required: true,
    properties: {
        id: {    // id
            type: 'integer',
            required: true,
        },
        name: {    // name
            type: 'string',
            required: true,
        },
        breed: {    // breed
            type: 'string',
            required: true,
        },
        birthYear: {   // birth year
            type: 'number',
            required: true,
        },
        photo: {    // photo url
            type: 'string',
            format: 'url',
        },
    },
}

// lets throw error if validation fails
function validate(data) {
    validator(data,schema,{throwError: true})
}

module.exports = validate
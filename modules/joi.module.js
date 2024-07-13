const Joi = require("joi");

module.exports.Make = ({
    bodyRequest = {},
    schema = Joi.object({})
}) => {
    let isValidated = true;
    let message = `Validation succeeded.`

    const { error } = schema.validate(bodyRequest)
    if (error) {
        isValidated = false;
        message = `Validation failed, ${error.message}`;
    }

    return {
        isValidated,
        message,
    }
}
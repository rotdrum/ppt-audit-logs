const axios = require("axios");

const ServiceUrl = "http://YOUR_ENDPOINT_URL";
const ApiKey = process.env.YOUR_ENDPOINT_API_KEY ? `Bearer ${process.env.YOUR_ENDPOINT_API_KEY}` : "";

module.exports.MyGetFunction = async ({
    authorization = ApiKey,
}) => {
    try {
        const response = await axios.get(
            `${ServiceUrl}/path/to/endpoint`,
            {
                headers: {
                    authorization
                }
            }
        );
        return {
            "statusCode": Number(response.status || 0),
            "result": response.data,
        }
    } catch (error) {
        const response = error.response || {};
        const response_data = response.data || {
            "message": `Server Error ${error.message || error}`
        }
        return {
            "statusCode": Number(response.status || 500),
            "result": response_data,
        }
    }
}

module.exports.MyPostFunction = async ({
    authorization = ApiKey,
    body = {}
}) => {
    try {
        const response = await axios.post(
            `${ServiceUrl}/path/to/endpoint`,
            {
                ...body
            },
            {
                headers: {
                    authorization
                }
            }
        );
        return {
            "statusCode": Number(response.status || 0),
            "result": response.data,
        }
    } catch (error) {
        const response = error.response || {};
        const response_data = response.data || {
            "message": `Server Error ${error.message || error}`
        }
        return {
            "statusCode": Number(response.status || 500),
            "result": response_data,
        }
    }
}
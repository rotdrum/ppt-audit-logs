const fs = require("fs");
const path = require("path");

module.exports = () => {
    if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == "") {
        const PathOfEnv = `${__dirname}/../../.`;
        const EnvName = `${process.env.ENV_TYPE || ""}.env`;
        if (fs.existsSync(path.join(PathOfEnv, EnvName))) {
            require("dotenv").config({
                path: path.join(PathOfEnv, EnvName)
            });
        } else {
            require("dotenv").config({
                path: path.join(PathOfEnv, '.env')
            });
        }

        if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == "") {
            throw new Error(`${path.join(PathOfEnv, EnvName)} not found.`);
        }
    }
}
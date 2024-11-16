const { env } = require("process");

module.exports = {
    apps: [
        {
            name: "invetory-management",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
                ENV_VAR1: "value1",
            },
        },
    ],
};
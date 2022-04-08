const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin({
    outputFormat: "humanVerbose",
    loaderTopFiles: 5
});

module.exports = {
    webpack: {
        configure: smp.wrap({

        })
    }
};
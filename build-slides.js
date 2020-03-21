const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

require('dotenv').config();

const slidesConfig = {
    "src": process.env.REMARK_SLIDES_SRC,
    "output": process.env.REMARK_SLIDES_OUTPUT,
    "template": process.env.REMARK_SLIDES_TEMPLATE
};
const argv = require('optimist').argv;

let isWatchModeEnabled = !!argv.watch;

const srcDirPath = path.join(__dirname, slidesConfig.src);
const outDirPath = path.join(__dirname, slidesConfig.output);
const customTemplate = path.join(__dirname, slidesConfig.template);

function init() {
    fs.readdir(srcDirPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        if (!fs.existsSync(outDirPath)) {
            fs.mkdirSync(outDirPath);
        }
        files.forEach(function (file) {
            let command = 'npx markdown-to-slides -l '+ customTemplate + ' ' + getSrcFile(file) + ' -o ' + getDestFile(file);
            if(isWatchModeEnabled) {
                command = 'npx markdown-to-slides -w -l '+ customTemplate + ' ' + getSrcFile(file) + ' -o ' + getDestFile(file);
            }
            exec(command, function (e, stdout, stderr) {
                console.log(stderr);
                if (e) throw e;
            });
        });
    });
}

function getSrcFile(mdFileName) {
    return path.join(srcDirPath, mdFileName);
}

function getDestFile(mdFileName) {
    return path.join(outDirPath, path.parse(mdFileName).name + ".html");
}

init();
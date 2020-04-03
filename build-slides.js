const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

require('dotenv').config();

const slidesConfig = {
    "src": process.env.REMARK_SLIDES_SRC || "src/md",
    "output": process.env.REMARK_SLIDES_OUTPUT || "dist/",
    "template": process.env.REMARK_SLIDES_TEMPLATE || "src/index.dynamic.template.html",
    "static_dir": process.env.REMARK_STATIC_DIR || "."
};
const argv = require('optimist').argv;

let isWatchModeEnabled = !!argv.watch;

const srcDirPath = path.join(__dirname, slidesConfig.src);
const outDirPath = path.join(__dirname, slidesConfig.output);
createDir(outDirPath);

const customTemplate = path.join(__dirname, slidesConfig.template);

const distTemplateFile = path.join(__dirname, slidesConfig.output + "/index.template.html");

const staticDir = slidesConfig.static_dir;

function init() {
    createDistTemplateFile();

    fs.readdir(srcDirPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            let command = 'npx markdown-to-slides -l '+ distTemplateFile + ' ' + getSrcFile(file) + ' -o ' + getDestFile(file);
            if(isWatchModeEnabled) {
                command = 'npx markdown-to-slides -w -l '+ distTemplateFile + ' ' + getSrcFile(file) + ' -o ' + getDestFile(file);
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

function createDistTemplateFile() {
    fs.copyFile(customTemplate, distTemplateFile, (err) => {
        if (err) throw err;
    });

    fs.readFile(distTemplateFile, 'utf8', function (err,data) {
        if (err) return console.log(err);

        var result = data.replace(/{{staticPath}}/g, staticDir);

        fs.writeFile(distTemplateFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

}

function createDir(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

init();
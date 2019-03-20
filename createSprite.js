const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { parse }  =  require('node-html-parser');
const axios = require('axios');

var fs = require('fs');
var parseString = require('xml2js').parseString;

const directory = 'separated-svgs';
var shell = require('shelljs');

// This script take sprite.svg and separate all icons into a folder.
const separateSvgs = function () {
    return axios.get("https://admin-gaming.coral.co.uk/library/icons/coral.svg").then((res) => {

        const spriteData = res.data;
        const root = parse(spriteData);

        var symbolTag = root.querySelectorAll('symbol');

        shell.exec(`mkdir ${directory}/svgs`);

        for (var i = 0; i < symbolTag.length; i++) {
            symbolTag[i].rawAttrs += ' xmlns="http://www.w3.org/2000/svg"';
            symbolTag[i].tagName = 'svg';

            // folder path for separated SVGs
            fs.writeFile(`${directory}/svgs/` + symbolTag[i].id + ".svg", symbolTag[i], function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }
    });
}

// This script convert sprite.svg to visual html page, and create new sprite.svg
const svgManipulate = function(directory, spriteName) {
    setTimeout(function(){
        shell.exec(`mkdir ./${directory}/opt-svgs`);
        shell.exec(`svgo ./${directory}/svgs/*.svg -o ./${directory}/opt-svgs --config=svgo.yml`);
        shell.exec(`spritesh --input ${directory}/opt-svgs --output ${spriteName}`);

        // transform sprite.svg to html element
        fs.readFile(`${spriteName}`, 'utf8', function (err,spriteData) {

            if (err) {
                return console.log(err);
            }else{
                spriteData = spriteData.slice(spriteData.indexOf('>') + 1);
                spriteData = '<div class="sprite-svgs">' + spriteData;
                spriteData = spriteData.replace(/svg/g, 'div');

                var document = parseString(spriteData, function (err, spriteData2) {
                    for( var i=0; i < spriteData2.div.symbol.length; i++ ){
                        spriteData = spriteData.replace(/[<]symbol/, '<div class="svg-item"><span>#' + spriteData2.div.symbol[i].$.id.toUpperCase() + '</span>' + '<svg');
                        spriteData = spriteData.replace(/[<][/]symbol/, '</svg></div');
                    }
                });

                // delete svgs folders
                shell.exec(`rm -rf ${directory}/opt-svgs ${directory}/svgs`);

                // Insert spriteData to svg-sprite-index.html
                fs.readFile('./svg-sprite-index.html', 'utf8', (err, html) => {
                    //console.log(html);
                    fs.writeFileSync('./svg-sprite-index.html', html.replace(`<div class="sprite-svgs"></div>`, `${spriteData}`));
                });
            }
        });
    }, 500);

};


separateSvgs().then(() => {
    svgManipulate(directory, 'coral.svg');
});

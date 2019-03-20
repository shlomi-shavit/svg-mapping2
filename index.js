
var svgsDom = [];
var svgsSymbol = [];

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            $( '#svgTxtarea' ).val( e.target.result );
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function appendSVG(svg, svgID) {
    $('#uploaded-svgs-container').append(`<div class="svg-item"><span>#${svgID} </span> ${svg}<div>`);

    // reset input field
    $('#upload-input').value = '';
    $('#upload-input').val('');
}

function svgToSymbol(){
    spriteData = spriteData.slice(spriteData.indexOf('>') + 1);
    spriteData = '<symbol>' + spriteData;
    spriteData = spriteData.replace(/svg/g, 'div');

    var document = parseString(spriteData, function (err, spriteData2) {
        for( var i=0; i < spriteData2.div.symbol.length; i++ ){
            spriteData = spriteData.replace(/[<]symbol/, '<div class="svg-item"><span>#' + spriteData2.div.symbol[i].$.id.toUpperCase() + '</span>' + '<svg');
            spriteData = spriteData.replace(/[<][/]symbol/, '</svg></div');
        }
    });
}

$(document).ready(function() {

    document.getElementById('upload-input').addEventListener('change', handleFileSelect, false);

    // Submit event
    $(document).on('click', '#submit-upload', function(e) {

        let fileName = $('#upload-input').val().replace(/C:\\fakepath\\/i, '');
        fileName = fileName.slice(0, fileName.indexOf('.'));

        const svg = {
            fileName: fileName,
            content: $('#svgTxtarea').val()
        };

        if($('#upload-input').val() !== ''){
            svgsDom.push(svg);
            appendSVG(svg.content, fileName);
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            console.log(svg);
            console.log(svg.content);
            console.log(fileName);
            console.log(svgsDom);
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        }else{
            console.log('empty');
        }

    });

});
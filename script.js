function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function abs(num){
    if (num < 0){
        return num * -1
    }
    return num
}

function pixelRangeEquals(pix1, pix2, range){
    range -= abs(pix1[0] - pix2[0])
    range -= abs(pix1[1] - pix2[1])
    range -= abs(pix1[2] - pix2[2])

    return range > 0
}


document.getElementById('image-upload').addEventListener('change', function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('canvas').addEventListener('click', function (event) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var x = event.offsetX;
    var y = event.offsetY;
    var pixelData = ctx.getImageData(x, y, 1, 1).data;
    console.log(pixelData);

    // var rgbColor = 'rgb(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ')';
    document.getElementById('src-color').value = rgbToHex(...pixelData);
});

document.getElementById('replace-button').addEventListener('click', function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var srcColor = hexToRgb(document.getElementById('src-color').value);
    var dstColor = hexToRgb(document.getElementById('dst-color').value);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        if (pixelRangeEquals([data[i], data[i+1], data[i+2]], [srcColor.r, srcColor.g, srcColor.b], 50)){
            data[i] = dstColor.r;0
            data[i + 1] = dstColor.g;
            data[i + 2] = dstColor.b;
        }
        // if (data[i] == srcColor.r && data[i + 1] == srcColor.g && data[i + 2] == srcColor.b) {
            
        // }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    var downloadLink = document.getElementById('download-link');
    downloadLink.href = canvas.toDataURL();
    downloadLink.style.display = 'block';
});

window.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Add your canvas drawing code here...

    const magnifyingGlass = document.getElementById('magnifying-glass');
    const magnifiedCtx = magnifyingGlass.getContext('2d');
    const magnifiedSize = 200;
    const magnification = 3; // Adjust the magnification level as needed

    // Set the size of the magnified canvas
    magnifyingGlass.width = magnifiedSize;
    magnifyingGlass.height = magnifiedSize;

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        magnifyingGlass.style.visibility = 'visible';
        magnifyingGlass.style.left = event.clientX - magnifyingGlass.offsetWidth / 2 + 'px';
        magnifyingGlass.style.top = event.clientY - magnifyingGlass.offsetHeight / 2 + 'px';

        // Clear the magnified canvas
        magnifiedCtx.clearRect(0, 0, magnifiedSize, magnifiedSize);

        // Draw the magnified portion of the canvas onto the magnified canvas
        magnifiedCtx.drawImage(canvas, x - magnifiedSize / (2 * magnification), y - magnifiedSize / (2 * magnification), magnifiedSize / magnification, magnifiedSize / magnification, 0, 0, magnifiedSize, magnifiedSize);
        
        magnifyingGlass.style.backgroundPosition = `-${x * magnification}px -${y * magnification}px`;
    });

    canvas.addEventListener('mouseout', () => {
        magnifyingGlass.style.visibility = 'hidden';
    });
});
const { Jimp } = require('jimp');

async function checkDimensions() {
    const input = process.argv[2];
    try {
        const image = await Jimp.read(input);
        console.log(`Width: ${image.bitmap.width}, Height: ${image.bitmap.height}`);
    } catch (err) {
        console.error(err);
    }
}

checkDimensions();

const { Jimp } = require('jimp');
const path = require('path');

async function removeWhite() {
  const input = process.argv[2];
  const output = process.argv[3];

  try {
    const image = await Jimp.read(input);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // If close to white, make transparent
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Alpha to 0
      }
    });

    image.write(output, (err) => {
      if (err) throw err;
      console.log('Processed', output);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

removeWhite();

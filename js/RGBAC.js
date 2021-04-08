const RGBAC = {
  encrypt(r, g, b, a, c) {
    r -= r & 3;
    g -= g & 3;
    b -= b & 3;
    a -= a & 3;

    let _1 = (c >> 6) & 3;
    let _2 = (c >> 4) & 3;
    let _3 = (c >> 2) & 3;
    let _4 = (c >> 0) & 3;

    return {
      r: r + _1,
      g: g + _2,
      b: b + _3,
      a: a + _4,
    };
  },

  decrypt(r, g, b, a) {
    let _1 = (r & 3) << 6;
    let _2 = (g & 3) << 4;
    let _3 = (b & 3) << 2;
    let _4 = (a & 3) << 0;

    return _1 + _2 + _3 + _4;
  },

  encodeImage(image, text) {
    text = text
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U');
    text += '@$$$';
    if (text.length > image.width * image.height - 4) {
      throw `Invalid range [0, ${image.width * image.height - 4}]`;
    }

    let _canvas = document.createElement('canvas');
    let _context = _canvas.getContext('2d');
    let _width = _canvas.width = image.width;
    let _height = _canvas.height = image.height;
    let _imageData;

    _context.drawImage(image, 0, 0);
    _imageData = _context.getImageData(0, 0, _width, _height);

    for (let i=0; i<_imageData.data.length; i+=4) {
      let _color = RGBAC.encrypt(
        _imageData.data[i + 0],
        _imageData.data[i + 1],
        _imageData.data[i + 2],
        _imageData.data[i + 3],
        text.charAt(i/4) ? text.charAt(i/4).charCodeAt() : 0,
      );
      _imageData.data[i + 0] = _color.r;
      _imageData.data[i + 1] = _color.g;
      _imageData.data[i + 2] = _color.b;
      _imageData.data[i + 3] = _color.a;
    }
    
    _context.putImageData(_imageData, 0, 0);
    return _canvas.toDataURL();
  },

  decodeImage(image) {
    let _canvas = document.createElement('canvas');
    let _context = _canvas.getContext('2d');
    let _width = _canvas.width = image.width;
    let _height = _canvas.height = image.height;
    let _imageData;
    let _text = '';

    _context.drawImage(image, 0, 0);
    _imageData = _context.getImageData(0, 0, _width, _height);

    for (let i=0; i<_imageData.data.length; i+=4) {
      let char = RGBAC.decrypt(
        _imageData.data[i + 0],
        _imageData.data[i + 1],
        _imageData.data[i + 2],
        _imageData.data[i + 3],
      );

      if (char != 0) {
        _text += String.fromCharCode(char);
      }
    }

    let _EOF = _text.indexOf('@$$$');
    return _text.substring(0, _EOF);
  },
};
(function () {
  // Tab Uygulaması

  const tableOfElement = (domElement, dataName) => {
    return [...domElement.querySelectorAll(`[${dataName}]`)]
      .reduce((obj, item) => {
        obj[item.getAttribute(dataName)] = item;
        return obj;
      }, {});
  };
  
  const clearClass = (obj) => {
    for (let prop in obj) {
      obj[prop].classList.remove('active');
    }
  };
  
  [...document.querySelectorAll('.tab')]
    .forEach((tab) => {
  
      let tabHeaders = tableOfElement(tab, 'data-name');
      let tabBodies = tableOfElement(tab, 'data-parent');
  
      for (let prop in tabHeaders) {
        tabHeaders[prop].addEventListener('click', () => {
          clearClass(tabHeaders);
          clearClass(tabBodies);
  
          tabHeaders[prop].classList.add('active');
          tabBodies[prop].classList.add('active');
        });
      }
      
    });
})();

const writeInput = document.getElementById('write-input');
const writeImage = document.getElementById('write-image');
const writeArea = document.getElementById('write-area');
const writeButton = document.getElementById('write-button');
const readInput = document.getElementById('read-input');
const readImage = document.getElementById('read-image');
const readArea = document.getElementById('read-area');

writeInput.addEventListener('change', () => {
  let file = writeInput.files[0];
  let reader = new FileReader();
  reader.addEventListener('load', () => {
    writeImage.src = reader.result;
    writeImage.addEventListener('load', () => {
      writeArea.value = '';
      writeArea.placeholder = `En fazla, ${writeImage.width * writeImage.height - 4} karakter girebilirsin`;
      writeArea.focus();
    });
  });
  reader.readAsDataURL(file);
});

writeButton.addEventListener('click', () => {
  let anchor = document.createElement('a');
  anchor.href = RGBAC.encodeImage(writeImage, writeArea.value);
  anchor.download = 'veri';
  anchor.click();
});

readInput.addEventListener('change', () => {
  let file = readInput.files[0];
  let reader = new FileReader();
  reader.addEventListener('load', () => {
    readImage.src = reader.result;
    readImage.addEventListener('load', () => {
      readArea.value = RGBAC.decodeImage(readImage);
    });
  });
  reader.readAsDataURL(file);
});

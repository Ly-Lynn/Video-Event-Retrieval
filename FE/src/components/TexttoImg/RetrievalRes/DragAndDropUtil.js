function getTextWidth(content) {
    const text = document.createElement("div");
    document.body.appendChild(text);
  
    text.style.height = "auto";
    text.style.width = "auto";
    text.style.position = "absolute";
    text.style.whiteSpace = "no-wrap";
    text.style.paddingLeft = "10px";
    text.style.paddingRight = "10px";
    text.innerHTML = content;
  
    const width = Math.ceil(text.clientWidth);
    let updatedWidthWithMarginAndBorder = width + 12;
    document.body.removeChild(text);
  
    if (updatedWidthWithMarginAndBorder > 220) {
      updatedWidthWithMarginAndBorder = 220;
    }
    if (updatedWidthWithMarginAndBorder < 60) {
      updatedWidthWithMarginAndBorder = 60;
    }
  
    return updatedWidthWithMarginAndBorder;
  }
  
  export function chunkArray(array, maxWidth = 560) {
    let index = 0;
  
    let maxContentWidth = 560;
    if (maxWidth === null) {
      maxContentWidth = 560;
    } else {
      maxContentWidth = 760;
    }
  
    const arrayLength = array.length;
    const tempArray = [];
    let currentLength = 0;
    let startIndex = 0;
    let endIndex = array.length - 1;
  
    for (index = 0; index < arrayLength; index += 1) {
      currentLength = currentLength + getTextWidth(array[index].content);
      if (currentLength > maxContentWidth) {
        endIndex = index;
        tempArray.push(array.slice(startIndex, endIndex));
        startIndex = endIndex;
        currentLength = array[index].content.length;
        index = index - 1;
      }
      if (index === arrayLength - 1) {
        //handles last elements
        tempArray.push(array.slice(startIndex, arrayLength));
      }
    }
  
    return tempArray;
  }
  
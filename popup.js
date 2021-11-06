// Initialize butotn with users's prefered color
let grabAct = document.getElementById('grabAct');

// When the button is clicked, inject setPageBackgroundColor into current page
grabAct.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
});

console.log('test code ', chrome.runtime.onMessage);

// The body of this function will be execuetd as a content script inside the
// current page
function grabPageInfo() {
  // console.log('grabPageInfo: ', document);
  // // productName: product-intro__head-name
  // // productImages: product-intro__thumbs-item
  // // productSize: product-intro__size-radio & !disable
  // // productColor: product-intro__color-choose > aria-label
}

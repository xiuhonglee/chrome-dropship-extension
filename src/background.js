class Main {
  constructor() {
    chrome.runtime.onMessage.addListener(this.grabProductInfo.bind(this));
  }

  grabProductInfo(request) {
    if (request.contentScriptQuery === 'grabProductInfo') {
      this.sendRequest();
    }
  }

  sendRequest() {
    fetch('https://xiuhong.myshopify.com/admin/api/2021-10/products.json', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'X-Shopify-Access-Token': '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',
      },
    })
      .then((response) => response.json())
      .then((res) => console.log(res))
      .catch((error) => {});
  }
}

new Main();

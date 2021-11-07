// Default keys
const shop_id = 'xiuhong';
const api_secret = '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';

class Main {
  constructor() {
    chrome.runtime.onMessage.addListener(this.grabProductInfo.bind(this));
  }

  grabProductInfo(request) {
    if (request.contentScriptQuery === 'grabProductInfo') {
      this.sendRequest(request);
    }
  }

  sendRequest({ title, images }) {
    fetch(`https://${shop_id}.myshopify.com/admin/api/2021-10/products.json`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-Shopify-Access-Token': api_secret,
      },
      body: JSON.stringify({
        product: {
          title,
          images: images.map((imgLink) => {
            let completeLink =
              imgLink.indexOf('https:') > -1 ? imgLink : `https:${imgLink}`;
            completeLink = completeLink.replace(/webp$/, 'jpg');
            return {
              src: completeLink,
            };
          }),
          options: [
            { name: 'Color', values: ['Blue', 'Black'] },
            { name: 'Size', values: ['155', '159'] },
            { name: 'Price', values: ['1.00'] },
          ],
          variants: [
            {
              option1: 'Blue',
              option2: '155',
              option3: '1.00',
            },
            {
              option1: 'Black',
              option2: '159',
              option3: '1.00',
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .then((res) => console.log(res))
      .catch((error) => {});
  }
}

new Main();

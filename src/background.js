// Default keys
const shop_id = 'xiuhong';
const api_secret = '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';

class Main {
  constructor() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.contentScriptQuery === 'grabProductInfo') {
        this.sendRequest(request)
          .then((response) => response.json())
          .then((response) => {
            sendResponse(response);
          })
          .catch((err) => sendResponse(err));
      }
      return true;
    });
  }

  mapVariants() {
    return [
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
    ];
  }

  dealImages(images = []) {
    return images.map((imgLink) => {
      let completeLink =
        imgLink.indexOf('https:') > -1 ? imgLink : `https:${imgLink}`;
      completeLink = completeLink.replace(/webp$/, 'jpg');
      return {
        src: completeLink,
      };
    });
  }

  dealOption({ sizes, colors }) {
    const reMapColor = colors.map((chunck) => chunck[1].value);
    return [
      { name: 'Size', values: sizes },
      { name: 'Color', values: reMapColor },
    ];
  }

  dealVariants(sizes, colors) {
    const reMapColor = colors.map((chunck) => chunck[1].value);
  }

  sendRequest({ title, images, price, sizes, colors }) {
    return fetch(
      `https://${shop_id}.myshopify.com/admin/api/2021-10/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-Shopify-Access-Token': api_secret,
        },
        body: JSON.stringify({
          product: {
            title,
            images: this.dealImages(images),
            options: this.dealOption({ price, sizes, colors }),
            variants: [
              {
                price: price,
                option1: sizes[0],
                option2: 'Blue',
              },
              {
                price: price,
                option1: sizes[1],
                option2: 'Black',
              },
            ],
          },
        }),
      },
    );
  }
}

new Main();

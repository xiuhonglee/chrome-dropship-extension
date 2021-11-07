// Default keys
const shop_id = 'coding-challenge-xiuhong';
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

  dealOption({ sizeList, colorList }) {
    const sizes = sizeList
      .filter((item) => item.attr_name === 'Size')
      .map((item) => item.attr_value_en);
    const colors = colorList.map((item) => {
      return item.productDetails.filter(
        (item) => item.attr_name_en === 'Color',
      )[0].attr_value_en;
    });

    return [
      { name: 'Size', values: sizes },
      { name: 'Color', values: colors },
    ];
  }

  dealVariants({ sizeList, colorList }) {
    const sizes = sizeList
      .filter((item) => item.attr_name === 'Size')
      .map((item) => item.attr_value_en);

    const colorRelatePrice = colorList.map((item) => {
      const color = item.productDetails.filter(
        (item) => item.attr_name_en === 'Color',
      )[0].attr_value_en;
      const price = item.retailPrice.usdAmount;

      return { color, price };
    });

    const variants = [];
    for (let i = 0; i < colorRelatePrice.length; i++) {
      for (let j = 0; j < sizes.length; j++) {
        variants.push({
          option1: sizes[j],
          option2: colorRelatePrice[i].color,
          price: colorRelatePrice[i].price,
        });
      }
    }
    return variants;
  }

  sendRequest({ title, images, colorList, sizeList }) {
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
            options: this.dealOption({ colorList, sizeList }),
            variants: this.dealVariants({ colorList, sizeList }),
          },
        }),
      },
    );
  }
}

new Main();

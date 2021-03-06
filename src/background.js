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

  unique(arr, key) {
    if (!arr) return arr;
    if (key === undefined) return [...new Set(arr)];
    const map = {
      string: (e) => e[key],
      function: (e) => key(e),
    };
    const fn = map[typeof key];
    const obj = arr.reduce((o, e) => ((o[fn(e)] = e), o), {});
    return Object.values(obj);
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
      { name: 'Color', values: this.unique(colors) }, // There may be duplicates
    ];
  }

  getColorAndRelatedPrice(colorList = []) {
    return colorList.map((item) => {
      const color = item.productDetails.filter(
        (item) => item.attr_name_en === 'Color',
      )[0].attr_value_en;
      const price = item.retailPrice.usdAmount;

      return { color, price };
    });
  }

  getSizeAndRelatedPrice(sizeList = []) {
    return sizeList.map((item) => {
      const size = item.attr_value_en;
      const price = item.price?.retailPrice?.usdAmount;
      return { size, price };
    });
  }

  // generate sku by size * color * price
  dealVariants({ sizeList, colorList }) {
    const sizeAndRelatePrice = this.getSizeAndRelatedPrice(sizeList);
    let colorAndRelatedPrice = this.getColorAndRelatedPrice(colorList);
    colorAndRelatedPrice = this.unique(colorAndRelatedPrice, 'color'); // There may be duplicates

    const variants = [];

    if (sizeAndRelatePrice.length === 0 && colorAndRelatedPrice.length === 0)
      return variants;
    if (sizeAndRelatePrice.length === 0) {
      for (let i = 0; i < colorAndRelatedPrice.length; i++) {
        variants.push({
          option2: colorAndRelatedPrice[i].color,
          price: colorAndRelatedPrice[i].price,
        });
      }
      return variants;
    } else if (sizeAndRelatePrice.length === 0) {
      for (let i = 0; i < sizeAndRelatePrice.length; i++) {
        variants.push({
          option1: sizeAndRelatePrice[i].size,
          price: sizeAndRelatePrice[i].price,
        });
      }
      return variants;
    } else {
      for (let i = 0; i < colorAndRelatedPrice.length; i++) {
        for (let j = 0; j < sizeAndRelatePrice.length; j++) {
          variants.push({
            option1: sizeAndRelatePrice[j].size,
            option2: colorAndRelatedPrice[i].color,
            price: colorAndRelatedPrice[i].price,
          });
        }
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

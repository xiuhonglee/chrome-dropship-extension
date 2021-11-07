const root = document.createElement('div');
root.setAttribute('id', '__extension_root__');
document.body.appendChild(root);

const { createElement: el } = React;

let goodsDetailv2SsrData = Object.create(null);
document.addEventListener('webpage', (res) => {
  console.log('hhhaa', res);
  const {
    detail: { colorList, sizeList },
  } = res;
  goodsDetailv2SsrData.colorList = colorList;
  goodsDetailv2SsrData.sizeList = sizeList;
});

class Container extends React.Component {
  state = { showDialog: false, fetchLoading: false, showMessage: false };

  setShowDialog(flag = true) {
    this.setState({ showDialog: flag });
  }

  setShowMessage(flag = true) {
    this.setState({ showMessage: flag });
  }

  renderDialogHeader() {
    const close = el(
      'span',
      {
        className: 'shopify_dialog_close',
        onClick: () => {
          this.setShowDialog(false);
        },
      },
      '',
    );
    return el(
      'div',
      { className: 'shopify_dialoag_header' },
      'Product Info',
      close,
    );
  }

  renderProductContent() {
    const header = this.renderDialogHeader();
    const list = el(
      'ul',
      { className: 'shopify_dialog_list_wrap' },
      ...this.renderProductItem(),
    );
    const bottom = this.renderDialogBottom();

    const children = [header, list, bottom];
    return el('div', { className: 'shopify_dialog_content' }, ...[children]);
  }

  unique(arr = []) {
    return arr.filter(function (item, index, arr) {
      return arr.indexOf(item, 0) === index;
    });
  }

  getProductTitle() {
    return document.querySelector('.product-intro__head-name').innerText;
  }

  getProductImages() {
    const list = document.querySelectorAll(
      '.product-intro__main-item .j-verlok-lazy',
    );
    const imgs = [];
    for (let i = 0; i < list.length; i++) {
      imgs.push(list[i].dataset.src);
    }
    // cause swipe component need repeat one image
    return this.unique(imgs);
  }

  getProductPrice() {
    return document.querySelector(
      '.product-intro__head-price .original .from span',
    ).innerText;
  }

  getProductSizes() {
    var list = document.querySelectorAll('.product-intro__size-radio-inner');
    const sizes = [];
    for (let i = 0; i < list.length; i++) {
      sizes.push(list[i].innerText);
    }
    return sizes;
  }

  getProductColors() {
    var list = document.querySelectorAll('.product-intro__color-radio');
    const colors = [];
    for (let i = 0; i < list.length; i++) {
      const thumbnail = document.querySelectorAll(
        '.product-intro__color-radio .color-inner img',
      )[i].src;
      colors.push({ type: 'thumbnail', value: thumbnail });
      colors.push({ type: 'color', value: list[i].ariaLabel });
    }
    const chuncks = [];
    for (let j = 0; j < colors.length; j += 2) {
      chuncks.push(colors.slice(j, j + 2));
    }
    return chuncks;
  }

  renderProductAttr(attr) {
    var content = [
      el('span', { className: 'shopify_product_attr placeholder' }, '-'),
    ];

    switch (attr) {
      case 'Title':
        const title = this.getProductTitle();
        content = [title];
        break;
      case 'Images':
        const imgs = this.getProductImages();

        content = imgs.map((href) =>
          el('img', {
            className: 'shopify_product_img',
            src: href.replace('_900x.webp', '_50x.webp'),
            onClick: () => {
              open(href);
            },
          }),
        );
        break;

      case 'Price':
        const price = this.getProductPrice();
        content = [price];
        break;
      case 'Sizes':
        const sizes = this.getProductSizes();
        if (sizes.length === 0) return content;

        content = sizes.map((size) =>
          el('div', { className: 'shopify_product_size_item' }, size),
        );
        break;
      case 'Colors':
        const colors = this.getProductColors();
        if (colors.length === 0) return content;

        content = colors.map((chunck) =>
          el(
            'div',
            {
              className: 'shopify_product_colors_item',
              onClick: () => {
                open(chunck[0].value);
              },
            },
            el('img', {
              className: 'shopify_product_colors_inner',
              src: chunck[0].value,
            }),
            el(
              'div',
              { className: 'shopify_product_color_txt' },
              chunck[1].value,
            ),
          ),
        );
      default:
        break;
    }
    return el('div', { className: 'shopify_product_attr' }, ...content);
  }

  renderProductItem() {
    const productsInfo = ['Title', 'Images', 'Price', 'Sizes', 'Colors'];
    return productsInfo.map((attr) =>
      el(
        'li',
        { className: `shopify_attr_item shopify_product_${attr}` },
        el('span', { className: 'shopify_product_label' }, `${attr} :`),
        this.renderProductAttr(attr),
      ),
    );
  }

  renderBottomStatus() {
    return el(
      'div',
      { className: 'shopify_dialog_bottom_status_info' },
      'Save to your shopify store',
    );
  }

  renderBottomBtn() {
    const title = this.getProductTitle();
    const images = this.getProductImages();

    return el(
      'div',
      {
        className: 'shopify_dialog_bottom_btn',
        onClick: async () => {
          const self = this;
          const { fetchLoading } = this.state;
          // add request lock
          if (fetchLoading) return;
          this.setState({ fetchLoading: true });
          debugger

          chrome.runtime.sendMessage(
            {
              contentScriptQuery: 'grabProductInfo',
              title,
              images,
              colorList: goodsDetailv2SsrData.colorList,
              sizeList: goodsDetailv2SsrData.sizeList,
            },
            function () {
              self.setState({ fetchLoading: false });

              setTimeout(() => {
                self.setShowMessage(false);
              }, 2500);
            },
          );
          this.setShowDialog(false);
          this.setShowMessage(true);
        },
      },
      'Save',
    );
  }

  renderDialogBottom() {
    const status = this.renderBottomStatus();
    const btn = this.renderBottomBtn();
    return el('div', { className: 'shopify_dialog_bottom' }, status, btn);
  }

  renderDialog() {
    const { showDialog } = this.state;
    const children = showDialog ? [this.renderProductContent()] : [];

    return el(
      'div',
      { className: showDialog ? 'shopify_dialog' : 'hidden' },
      ...children,
    );
  }

  renderGrabBtn() {
    return el(
      'div',
      {
        className: 'grab_btn',
        onClick: () => {
          this.setShowDialog(true);
        },
      },
      'grab',
    );
  }

  renderConfirmation() {
    const { fetchLoading, showMessage } = this.state;
    const content = showMessage
      ? fetchLoading
        ? 'grab product info ...'
        : 'grab product info success !'
      : '';
    return el(
      'div',
      {
        className: 'shopify_confirmation',
        style: { top: showMessage ? '20px' : '-100px' },
      },
      el(
        'span',
        {
          className: 'shopify_confirm_msg',
        },
        content,
      ),
    );
  }

  render() {
    return React.createElement(
      'div',
      { className: 'shopify_wrap' },
      this.renderGrabBtn(),
      this.renderDialog(),
      this.renderConfirmation(),
    );
  }
}

window.ReactDOM.render(React.createElement(Container), root);

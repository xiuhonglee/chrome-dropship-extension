const root = document.createElement('div');
root.setAttribute('id', '__extension_root__');
document.body.appendChild(root);

const { createElement: el } = React;

let __goodsDetailv2SsrData = Object.create(null);
document.addEventListener('webpage', (res) => {
  const { detail } = res;
  __goodsDetailv2SsrData = Object.assign({}, __goodsDetailv2SsrData, detail);
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

  getProductTitle() {
    return __goodsDetailv2SsrData.currentProductDetail?.detail?.goods_name;
  }

  getProductImages() {
    const goods_imgs =
      __goodsDetailv2SsrData.currentProductDetail?.goods_imgs || [];
    const main_img = goods_imgs.main_image;
    const detail_imgs = goods_imgs.detail_image;
    return [main_img, ...detail_imgs];
  }

  getProductPrice() {
    const price =
      __goodsDetailv2SsrData.currentProductDetail?.detail?.salePrice
        ?.usdAmountWithSymbol;
    return price;
  }

  getProductSizes() {
    return __goodsDetailv2SsrData.sizeList.map((item) => item.attr_value_en);
  }

  getProductColors() {
    const colorList = __goodsDetailv2SsrData.colorList;
    const colorAndImgs = colorList.map((item) => {
      const color = item.productDetails.filter(
        (item) => item.attr_name_en === 'Color',
      )[0].attr_value_en;
      const thumbnail = item.color_image;
      return { color, thumbnail };
    });

    return colorAndImgs;
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
            src: href.thumbnail_webp,
            onClick: () => {
              open(`https:${href.origin_image}`);
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
                open(`https:${chunck.thumbnail}`);
              },
            },
            el('img', {
              className: 'shopify_product_colors_inner',
              src: chunck.thumbnail,
            }),
            el('div', { className: 'shopify_product_color_txt' }, chunck.color),
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
    const images = this.getProductImages().map((item) => item.origin_image);

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

          chrome.runtime.sendMessage(
            {
              contentScriptQuery: 'grabProductInfo',
              title,
              images,
              colorList: __goodsDetailv2SsrData.colorList,
              sizeList: __goodsDetailv2SsrData.sizeList,
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

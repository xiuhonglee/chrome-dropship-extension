const root = document.createElement('div');
root.setAttribute('id', '__extension_root__');
document.body.appendChild(root);

const { createElement: el } = React;

class Container extends React.Component {
  state = { show: false };

  setShowDialog(flag = true) {
    this.setState({ show: flag });
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

    const children = [header, list];

    return el('div', { className: 'shopify_dialog_content' }, ...[children]);
  }

  getProductTitle() {
    return document.querySelector('.product-intro__head-name').innerText;
  }

  getProductImages() {
    const list = document.querySelectorAll('.product-intro__main-item img');
    const imgs = [];

    for (let i = 0; i < list.length; i++) {
      imgs.push(list[i].dataset.src);
    }
    return imgs;
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
    var list = document.querySelectorAll('.product-intro__color-block');
    const colors = [];
    for (let i = 0; i < list.length; i++) {
      const thumbnail = document.querySelectorAll(
        '.product-intro__color-block .color-inner img',
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
            { className: 'shopify_product_colors_item' },
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

  renderDialogBottom() {
    return el('div', { className: 'shopify_dialog_bottom' });
  }

  renderDialog() {
    const { show } = this.state;
    const children = show
      ? [this.renderProductContent(), this.renderDialogBottom()]
      : [];
    return el(
      'div',
      { className: show ? 'shopify_dialog' : 'hidden' },
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

  render() {
    return React.createElement(
      'div',
      { className: 'shopify_wrap' },
      this.renderGrabBtn(),
      this.renderDialog(),
    );
  }
}

ReactDOM.render(React.createElement(Container), root);

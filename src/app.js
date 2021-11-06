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

  renderProductAttr(attr) {
    var content = [];
    switch (attr) {
      case 'Title':
        content = ['SHEIN Toddler Girls Colorblock Sweater Dress'];
        break;
      case 'Images':
        content = [
          el('img', {
            className: 'shopify_product_img',
            src: 'https://img.ltwebstatic.com/images3_pi/2021/08/26/16299645986fda292ae7d6ef589492dd9d8a31d6aa_thumbnail_100x.webp',
          }),
          el('img', {
            className: 'shopify_product_img',
            src: 'https://img.ltwebstatic.com/images3_pi/2021/08/26/1629964599e938b9edf8c439e5f598d119551dfbcc_thumbnail_100x.webp',
          }),
        ];
        break;
      case 'Price':
        content = ['US$11.00'];
        break;
      case 'Sizes':
        content = ['2Y', '3Y', '4Y', '5Y'].map((size) =>
          el('div', { className: 'shopify_product_size_item' }, size),
        );
        break;
      case 'Colors':
        content = [
          el('img', {
            className: 'shopify_product_colors_inner',
            src: 'https://img.ltwebstatic.com/images3_pi/2021/10/28/1635385851c67bd3ca71c556dcf6b3fc5a0a8f0439_thumbnail_220x293.webp',
          }),
          'Red',
          el('img', {
            className: 'shopify_product_colors_inner',
            src: 'https://img.ltwebstatic.com/images3_pi/2021/10/28/16353858403c4249eefd6b1b2a6831c77f1c9f987e_thumbnail_220x293.webp',
          }),
          'Black',
        ];
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

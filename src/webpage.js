// webpage env can access window.goodsDetailv2SsrData

// namespace
const SHOPIFY_DRIPSHIP_EXTENSION = {};

SHOPIFY_DRIPSHIP_EXTENSION.current_color_detail =
  goodsDetailv2SsrData.productIntroData?.detail || [];

SHOPIFY_DRIPSHIP_EXTENSION.relation_color =
  goodsDetailv2SsrData.productIntroData?.relation_color || [];

SHOPIFY_DRIPSHIP_EXTENSION.colorList = [
  SHOPIFY_DRIPSHIP_EXTENSION.current_color_detail,
  ...SHOPIFY_DRIPSHIP_EXTENSION.relation_color,
];
SHOPIFY_DRIPSHIP_EXTENSION.sizeList =
  goodsDetailv2SsrData.productIntroData?.attrSizeList;

// Don't need setTimeout here actually ...
setTimeout(() => {
  const evt = new CustomEvent('webpage', {
    detail: {
      currentProductDetail: goodsDetailv2SsrData.productIntroData,
      colorList: SHOPIFY_DRIPSHIP_EXTENSION.colorList,
      sizeList: SHOPIFY_DRIPSHIP_EXTENSION.sizeList,
    },
  });
  document.dispatchEvent(evt);
}, 300);

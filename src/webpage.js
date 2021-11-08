// webpage env can access window.goodsDetailv2SsrData

const current_color_detail =
  goodsDetailv2SsrData.productIntroData?.detail || [];
const relation_color =
  goodsDetailv2SsrData.productIntroData?.relation_color || [];

const colorList = [current_color_detail, ...relation_color];
const sizeList = goodsDetailv2SsrData.productIntroData?.attrSizeList;
debugger

// Don't need setTimeout here actually ...
setTimeout(() => {
  const evt = new CustomEvent('webpage', { detail: { colorList, sizeList } });
  document.dispatchEvent(evt);
}, 300);

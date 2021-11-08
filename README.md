# Install

1. Download repo's code
2. Open the Extension Management page by navigating to chrome://extensions
3. Enable Developer Mode by clicking the toggle switch next to Developer mode
4. Click the Load unpacked button and select the repo's directory

# Todo

- Code work
  - [Efficient]
    - import some devDependies such as react-bable with webpack
    - use jsx instead of original react syntax
  - [Opti] deal with other boundary condition or undefined error and so on
- Business work
  - [Feature] collect all images of diffrent color types, now just collected images of current color type
  - [Feature] add image to every varient
  - [Feature] manage api_id and api_secret in option.html of extension
  - [Opti] update goods info of same product instead of adding a repeated one

# Log

- [Opti] get title & size & images from goodsDetailv2SsrData
- [Opti]
  - add namespace
  - get color by goodsDetailv2SsrData
- [Fix] The variant 'size / color' already exists
- [Fix] generate sku by color*size*price
- [Feature] add variants
  - ssrData contains detail data of goods in webpage
  - Need inject script into page, If want to access webpage data
- [Feature] add confirmation at top of page
- [Fix] styles disorder
- [Fix] Runtime err: The message port closed before a response was received
- [Fix] Solve repeat image
- [Feature] Debugging shopify's REST API
- [Feature] Split css file

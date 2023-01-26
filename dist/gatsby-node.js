"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.onPreInit = exports.onCreateNode = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _gatsbySourceFilesystem = require("gatsby-source-filesystem");
var _pdfImage = require("pdf-image");
const onCreateNode = async ({
  node,
  actions: {
    createNode,
    createNodeField,
    createParentChildLink
  },
  createNodeId,
  cache
}) => {
  if (node.internal.mediaType === "application/pdf") {
    let pdfNode = node;
    let pageImagePath = "";
    try {
      let pdfImage = new _pdfImage.PDFImage(pdfNode.absolutePath, {
        convertOptions: {
          "-trim": ""
        }
      });
      pageImagePath = await pdfImage.convertPage(0);
    } catch (err) {
      console.error("error occurred with pdf-image");
      console.error(err);
      return;
    }
    _fs.default.readFile(pageImagePath, async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let pageImage = await (0, _gatsbySourceFilesystem.createFileNodeFromBuffer)({
        buffer: data,
        createNode,
        createNodeId,
        cache
      });
      if (pageImage) {
        createParentChildLink({
          parent: node,
          child: pageImage
        });
      }
    });
  }
};
exports.onCreateNode = onCreateNode;
const onPreInit = async () => {
  console.log("Loaded gatsby-transformer-pdf-image");
};
exports.onPreInit = onPreInit;
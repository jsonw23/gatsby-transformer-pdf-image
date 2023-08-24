import fs from "fs"
import { createFileNodeFromBuffer } from "gatsby-source-filesystem";
import { PDFImage } from "pdf-image"

import type { GatsbyNode } from "gatsby"
import type { FileSystemNode } from "gatsby-source-filesystem"

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({ node, actions: { createNode, createNodeField, createParentChildLink }, createNodeId, cache }) => {
    if (node.internal.mediaType === "application/pdf") {
        let pdfNode = node as FileSystemNode
        let pageImagePath = ""
        try {
            let pdfImage = new PDFImage(pdfNode.absolutePath)
            pageImagePath = await pdfImage.convertPage(0)
        } catch (err) {
            console.error("error occurred with pdf-image")
            console.error(err)
            return
        }
        fs.readFile(pageImagePath, async (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            let pageImage = await createFileNodeFromBuffer({
                buffer: data,
                createNode,
                createNodeId,
                cache,
            })
            if (pageImage) {
                createParentChildLink({ parent: node, child: pageImage })
            }
        })
    }
}

export const onPreInit: GatsbyNode["onPreInit"] = async () => {
    console.log("Loaded gatsby-transformer-pdf-image")
}
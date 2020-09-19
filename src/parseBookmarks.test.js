import { sample } from "."
import fs from "fs"
import { parseBookmarks } from "./parseBookmarks"
import xmldom from "xmldom"

test("parseBookmarks", () => {
  const html = fs.readFileSync("./test/chrome_bookmarks.html", {
    encoding: "utf8",
  })
  const expectedRaw = JSON.parse(
    fs.readFileSync("./test/chrome_bookmarks_raw.json")
  )
  const expectedFlat = JSON.parse(
    fs.readFileSync("./test/chrome_bookmarks_flat.json")
  )

  expect(parseBookmarks(html, { DOMParser: xmldom.DOMParser })).toEqual(
    expectedRaw
  )
  expect(
    parseBookmarks(html, { DOMParser: xmldom.DOMParser, flatten: true })
  ).toEqual(expectedFlat)
})

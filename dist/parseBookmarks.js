"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBookmarks = parseBookmarks;

function parseBookmarks(html, options = {}) {
  if (!options.DOMParser) {
    // Only works in a browser
    options.DOMParser = DOMParser;
  }

  const getNodeAttributeString = (node, name) => {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];

      if (attr.name.toLowerCase() === name) {
        return attr.value;
      }
    }

    return undefined;
  };

  const getNodeAttributeInt = (node, name) => {
    const s = getNodeAttributeString(node, name);

    if (s) {
      return parseInt(s);
    }

    return undefined;
  };

  const processFolderNode = dlNode => {
    var _node$firstChild, _node$firstChild2;

    let items = [];
    let folderItem = null;

    for (let node = dlNode.firstChild; node; node = node.nextSibling) {
      if (node.nodeType !== 1) {
        // Ignore everything but element nodes
        continue;
      }

      switch (node.tagName.toLowerCase()) {
        default:
        case "p":
        case "dt":
          break;

        case "h3":
          if (folderItem) {
            // There was an h3 with no dl after it
            items.push(folderItem);
          }

          folderItem = {
            title: (_node$firstChild = node.firstChild) === null || _node$firstChild === void 0 ? void 0 : _node$firstChild.textContent,
            type: "folder",
            added: getNodeAttributeInt(node, "add_date"),
            lastModified: getNodeAttributeInt(node, "last_modified")
          };
          break;

        case "dl":
          if (!folderItem) {
            // No h3 seen, so ignore it
            continue;
          }

          folderItem.children = processFolderNode(node);
          items.push(folderItem);
          folderItem = null;
          break;

        case "a":
          items.push({
            title: (_node$firstChild2 = node.firstChild) === null || _node$firstChild2 === void 0 ? void 0 : _node$firstChild2.textContent,
            type: "bookmark",
            url: getNodeAttributeString(node, "href"),
            icon: getNodeAttributeString(node, "icon"),
            added: parseInt(getNodeAttributeInt(node, "add_date")),
            lastModified: getNodeAttributeInt(node, "last_modified")
          });
          break;
      }
    }

    return items;
  };

  const flattenItems = (items, path) => {
    let newItems = [];
    items.forEach(item => {
      if (item.type === "folder") {
        newItems = newItems.concat(flattenItems(item.children, path + item.title + "/"));
      } else {
        newItems.push({
          title: item.title,
          url: item.url,
          path,
          added: item.added,
          icon: item.icon
        });
      }
    });
    return newItems;
  };

  const doc = new options.DOMParser(html).parseFromString(html, "text/html");
  const dlNodes = doc.getElementsByTagName("DL");
  let items = processFolderNode(dlNodes[0]);

  if (options.flatten) {
    items = flattenItems(items, "/");
  } // DEBUG: Leave for debugging
  // console.log(JSON.stringify(items, null, "  "))


  return items;
}
//# sourceMappingURL=parseBookmarks.js.map
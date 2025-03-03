class Node {
  constructor(name, data, children) {
    this.name = name;
    this.children = children;
    this.data = data;
  }
}

function isAlpha(c) {
  return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
}
function isAlphaNumeric(c) {
  return isAlpha(c) || (c >= '0' && c <= '9');
}

function parseData(str, idx) {
  let tagName = '';

  while (str[idx] != '<') {
    tagName += str[idx];
    idx += 1;
  }
  return [tagName, idx];
}

function parseTagName(str, idx) {
  function startsWithXML(tagName) {
    let lowercaseTag = tagName.toLowerCase();
    return lowercaseTag.length > 3 && lowercaseTag.substring(0, 3) == 'xml';
  }
  let tagName = '';
  while (isAlphaNumeric(str[idx]) || str[idx] == '_' || str[idx] == ':') {
    tagName += str[idx];
    idx += 1;
  }
  if (
    (isAlphaNumeric(tagName[0]) || tagName[0] == '_' || tagName[0] == ':') &&
    !startsWithXML(tagName)
  ) {
    return [tagName, idx];
  }
  return null;
}

function parseOpenTag(str, idx) {
  try {
    while (/\s/.test(str[idx])) {
      idx += 1;
    }
    if (str[idx] == '<') {
      idx += 1;
    } else {
      return null;
    }
    const [tagName, newIdx] = parseTagName(str, idx);
    idx = newIdx;
    if (str[idx] == '>') {
      idx += 1;
    } else {
      return null;
    }
    return [tagName, idx];
  } catch (error) {
    return null;
  }
}

function parseCloseTag(str, idx) {
  try {
    while (/\s/.test(str[idx])) {
      idx += 1;
    }
    if (str[idx] == '<' && str[idx + 1] == '/') {
      idx += 2;
    } else {
      return null;
    }
    const [tagName, newIdx] = parseTagName(str, idx);
    idx = newIdx;
    if (str[idx] == '>') {
      idx += 1;
    } else {
      return null;
    }
    return [tagName, idx];
  } catch (error) {
    return null;
  }
}

export function parseXML(str, idx) {
  try {
    const [openTagName, newIdx1] = parseOpenTag(str, idx);
    idx = newIdx1;
    let result = parseXML(str, idx);

    let data = '';
    let children = [];

    if (result != null) {
      while (result !== null) {
        children.push(result[0]);
        idx = result[1];
        result = parseXML(str, idx);
      }
    } else {
      result = parseData(str, idx);
      data = result[0];
      idx = result[1];
    }
    const [closeTagName, newIdx2] = parseCloseTag(str, idx);
    if (openTagName == closeTagName) {
      return [new Node(openTagName, data, children), newIdx2];
    }
    return null;
  } catch (error) {
    return null;
  }
}
/*
console.log(parseOpenTag('<A>', 0));
console.log(parseCloseTag('</A>', 0));
console.log(parseXML('<A></A>', 0));

let xml = `<book>
    <title>Introduction to Programming</title>
    <author>Aparna</author>
    <year>2025</year>
</book>`;
console.log(parseXML('<A><B>test</B><B></B></A>', 0));
console.log(parseXML(xml, 0));
*/

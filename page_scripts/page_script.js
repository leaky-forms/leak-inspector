let minLogoPath;

function sendMessageToContentScript(message, eventName) {
  document.dispatchEvent(
    new CustomEvent(eventName, { detail: message })
  );
}

document.addEventListener("modifyInputElementSetterGetter", function (e) {
  let inputElement = getElementByXpath(e.detail);
  let realHTMLInputElement = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  Object.defineProperty(inputElement, "value", {
    enumerable: true,
    configurable: true,
    // set: realHTMLInputElement.set,
    get: function () {
      const elValue = realHTMLInputElement.get.call(this);
      const xpath = getXPath(inputElement);
      const fieldName = inputElement.getAttribute("leaky-field-name");
      const stack = new Error().stack.split("\n");
      stack.shift();
      if( (stack.length>1) && (stack[1].startsWith('    at HTMLInputElement.recordInput (chrome-extension://') || stack[1].startsWith('    at HTMLInputElement.recordInput (moz-extension://'))){
        return elValue;
      }
      const timeStamp = Date.now();
      // mask the password field
      const sniffValue = (fieldName === 'password') ? elValue.replace(/./g, '*') : elValue;
      // send the sniff details to the background script
      sendMessageToContentScript(
        { elValue: sniffValue, xpath, fieldName, stack, timeStamp },
        "inputSniffed"
      );

      return elValue;
    },
  });
});

// Was taken from https://gist.github.com/iimos/e9e96f036a3c174d0bf4
function getXPath(el) {
  try {
    if (typeof el === "string") {
      return document.evaluate(el, document, null, 0, null);
    }
    if (!el || el.nodeType != 1) {
      return "";
    }
    if (el.id) {
      return `//*[@id='${el.id}']`;
    }
    const elTagName = el.tagName;
    const sames = Array.from(el.parentNode.children).filter(
      (x) => x.tagName == elTagName
    );
    return (
      this.getXPath(el.parentElement) +
      "/" +
      elTagName.toLowerCase() +
      (sames.length > 1 ? `[${sames.indexOf(el) + 1}]` : "")
    );
  } catch (error) {
    console.log("Exception occured while getting xpath of element.", el);
    return "";
  }
}

document.addEventListener("leakOccured", function (e) {
  let leakedField = getElementByXpath(e.detail);
      if (leakedField) {
        highlightInputField(leakedField);
      }
});

document.addEventListener("passMinLogoPath", function (e) {
  minLogoPath = e.detail;
});

function highlightInputField(inputField) {
  if (!inputField.style.background.includes('icons/logo_min.png')) {
    inputField.style.background = 'url("'+ minLogoPath+ '") 97.25% 10px no-repeat'
  }
}

function getElementByXpath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

let minLogoPath;
function addEventHandlerToEl(inputEl, eventType, eventHandler) {
  inputEl.addEventListener(eventType, eventHandler);
}

function recordInput(event) {
  let inputFields = [];
  let url = document.location.href;
  let PIIFields = document.querySelectorAll("[leaky-field-name]");
  for (const inputField of PIIFields) {
    let value = inputField.value;
    if (value.length < 5) {
      continue;
    }
    let xpath = getXPath(inputField);
    let fieldName = inputField.getAttribute("leaky-field-name");
    inputFields.push({ value, fieldName, xpath });
  }
  if (inputFields.length) {
    sendMessageToContentScript({ url, inputFields }, "inputFieldChanged");
  }
}

function addSniffListener2ExistingElements() {
  let shownInputFields = getAllPIIFields(true);
  for (const inputEl of shownInputFields) {
    inputEl.element.setAttribute("leaky-field-name", inputEl.fieldName);
    modifyInputElementSetterGetter(inputEl.element);
    addEventHandlerToEl(inputEl.element, "input", recordInput);
  }
}

// add reference
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 1000);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function monitorPiiElements() {
  // console.log('*****Debounced ****');
  let shownInputFields = getAllPIIFields(true);
  for (const inputEl of shownInputFields) {
    inputEl.element.setAttribute("leaky-field-name", inputEl.fieldName);
    modifyInputElementSetterGetter(inputEl.element);
    addEventHandlerToEl(inputEl.element, "input", recordInput);
  }
}

function addSniffListener2DynamicallyAddedElements() {
  // based on https://stackoverflow.com/questions/54017611
  debouncedMonitorPiiEls = debounce(monitorPiiElements, 500);
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        // monitor the newly added input elements
        debouncedMonitorPiiEls();
      }
    });
  });
  // start the Mutation Observer
  observer.observe(document, { childList: true, subtree: true });
}

function sendMessageToContentScript(message, eventName) {
  document.dispatchEvent(
    new CustomEvent(eventName, { detail: message })
  );
}

function modifyInputElementSetterGetter(inputElement) {
  let realHTMLInputElement = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  Object.defineProperty(inputElement, "value", {
    enumerable: true,
    configurable: true,
    // set: realHTMLInputElement.set,
    get: function () {
      let elValue = realHTMLInputElement.get.call(this);
      const xpath = getXPath(inputElement);
      const fieldName = inputElement.getAttribute("leaky-field-name");
      const stack = new Error().stack.split("\n");
      stack.shift();
      if( (stack.length>1) && stack[1].startsWith('    at HTMLInputElement.recordInput (moz-extension://')){
        return elValue;
      }
      const timeStamp = Date.now();
      // mask the password field
      if (fieldName === 'password') {
        elValue = elValue.replace(/./g, '*');
      }
      // send the sniff details to the background script
      sendMessageToContentScript(
        { elValue, xpath, fieldName, stack, timeStamp },
        "inputSniffed"
      );

      return elValue;
    },
  });
}

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

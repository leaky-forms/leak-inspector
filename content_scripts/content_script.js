let pathPassed = false;
const scriptNames = [
  "page_scripts/page_script.js"
];


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

chrome.storage.local.get(["extension_switch"], function (items) {
  if(items['extension_switch']){
    for (const script of scriptNames) {
      let scriptPath = chrome.runtime.getURL(script);
      injectPageScript(scriptPath);
    }
  }
});

let tabId;
function injectPageScript(scriptPath) {
  let s = document.createElement("script");
  s.src = scriptPath;
  s.async = false;
  s.setAttribute("type", "text/javascript");
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
  // console.log("Inject finished", scriptPath);
}

chrome.runtime.sendMessage({ type: "getTabId" }, (tabIdFromBg) => {
  tabId = tabIdFromBg;
});

document.addEventListener("inputSniffed", function (e) {
  let data = e.detail;
  chrome.runtime.sendMessage({
    type: "inputSniffed",
    sniffDetails: { tabId, data },
  });
  // console.log(
  //   `Input value ${data.inputValue} was read by a ${data.type} which is ${data.domain} from the ${data.fieldName} field whose xpath is ${data.xpath}.`
  // );
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.message === 'reqLeakOccurred') {
    if(!pathPassed){
      let minLogoPath = chrome.runtime.getURL('icons/logo_min.png');
        document.dispatchEvent(
          new CustomEvent('passMinLogoPath', { detail: minLogoPath })
        );
        pathPassed = true;
    }
    request.xpaths.forEach(xpath => {
      document.dispatchEvent(
        new CustomEvent('leakOccured', { detail: xpath })
      );
    });
  }
});

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
    chrome.runtime.sendMessage({
      type: "inputFieldChanged",
      data: { url, inputFields },
    });
  }
}

function addSniffListener2ExistingElements() {
  let shownInputFields = getAllPIIFields(true);
  for (const inputEl of shownInputFields) {
    let xpath = getXPath(inputEl.element);
    inputEl.element.setAttribute("leaky-field-name", inputEl.fieldName);
    document.dispatchEvent(
      new CustomEvent('modifyInputElementSetterGetter', { detail: xpath })
    );
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
    let xpath = getXPath(inputEl.element);
    inputEl.element.setAttribute("leaky-field-name", inputEl.fieldName);
    document.dispatchEvent(
      new CustomEvent('modifyInputElementSetterGetter', { detail: xpath })
    );
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

addSniffListener2DynamicallyAddedElements();
addSniffListener2ExistingElements();
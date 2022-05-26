let pathPassed = false;
const scriptNames = [
  "page_scripts/fathom/fathom.js",
  "page_scripts/fathom/email_detector.js",
  "page_scripts/autofill/heuristicsRegexp.js",
  "page_scripts/autofill/FormAutofill.js",
  "page_scripts/autofill/CreditCard.js",
  "page_scripts/autofill/FormAutofillUtils.js",
  "page_scripts/autofill/FormAutofillHeuristics.js",
  "page_scripts/isShown.js",
  "page_scripts/pii_fields_detection.js",
  "page_scripts/page_script_utils.js",
  "page_scripts/page_script.js",
];

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

document.addEventListener("inputFieldChanged", function (e) {
  let data = e.detail;
  chrome.runtime.sendMessage({
    type: "inputFieldChanged",
    data,
  });
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

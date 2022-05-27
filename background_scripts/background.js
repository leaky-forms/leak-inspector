let input_elements = {};
let leaky_requests = {};
let sniffs = {};
let activeTabId, lastUrl, lastTitle;
const BADGE_TYPE_GOOD = 'good';
const BADGE_TYPE_BAD = 'bad';

let tds = new Trackers();
// initialize with the blocklist info
tds.setLists([tds_tracker_info]);

chrome.tabs.onActivated.addListener(function (tab) {
  chrome.tabs.get(tab.tabId, function (tab) {
    let tabId = tab.id;
    activeTabId = tabId;
    lastUrl = tab.url;
    lastTitle = tab.title;
    try {
      let reqStorageId = "leaky_requests" + "_" + tabId;
      let sniffStorageId = "sniffs" + "_" + tabId;

      chrome.storage.local.get([reqStorageId, sniffStorageId], storageRes => {
        if(Object.keys(storageRes).length){
        let leakNum = Object.keys(storageRes[reqStorageId]).length;
        let sniffNum = Object.keys(storageRes[sniffStorageId]).length;
          if(leakNum){
            console.log(`Tab changed (${tabId}) - found leaks`);
            setBadge(tabId);
          }else if(sniffNum){
            console.log(`Tab changed (${tabId}) - found sniffs`);
          }
        }else {
            console.log(`Tab changed (${tabId}) - no leaks or sniffs`);
        }
      });
    } catch (error) {
      console.log("Error getting tab elements", tabId);
    }
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  activeTabId = tab.id;
  lastUrl = tab.url;
  lastTitle = tab.title;
  if (changeInfo.status === "loading" && lastUrl === 'chrome://newtab/') {
    console.log(`Tab initialized, ${tabId}`);
    afterReloadAndNewTab(tabId);
  }
});

function afterReloadAndNewTab(tabId) {
  input_elements[tabId] = undefined;
  leaky_requests[tabId] = {};

  let reqStorageObj = {};
  reqStorageObj["leaky_requests_" + tabId] = {};
  chrome.storage.local.set(reqStorageObj);

  let sniffStorageObj = {};
  sniffStorageObj["sniffs_" + tabId] = {};
  chrome.storage.local.set(sniffStorageObj);

  sniffs[tabId] = {};

  chrome.storage.local.get("thirdPartyControl", items => {
    window.thirdPartyControl = items["thirdPartyControl"];
  });
  chrome.storage.local.get("requestControl", items => {
    window.requestControl = items["requestControl"];
  });
  chrome.browserAction.setIcon({
    path: `../icons/logo_min.png`,
  });
  setBadge(tabId);
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (["reload", "link", "typed", "generated"].includes(details.transitionType) &&
    details.url === lastUrl) {

    chrome.webNavigation.onCompleted.addListener(function onComplete() {

      afterReloadAndNewTab(details.tabId);
      console.log('Tab reloaded', details.tabId);

      chrome.webNavigation.onCompleted.removeListener(onComplete);
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let tabId;
  let tabUrl;
  try {
    tabId = sender.tab.id;
    tabUrl = sender.url;
  } catch (error) {
    tabId = -1;
  }
  if (message.type == "inputFieldChanged") {
    input_elements[tabId] = message.data;
  } else if (message.type == "getTabId") {
    sendResponse(sender.tab.id);
  } else if (message.type == "inputSniffed") {
    const sniffDetails = message.sniffDetails.data;
    const msgTabId = message.sniffDetails.tabId;
    let sniffDetail = checkSniff(
      sniffDetails.elValue,
      sniffDetails.xpath,
      sniffDetails.fieldName,
      sniffDetails.stack,
      tabUrl
    );

    if (sniffDetail) {
      if (sniffs[msgTabId] === undefined) {
        sniffs[msgTabId] = [];
      }
      let sniffsInserted = false;
      for (const sniff of sniffDetail) {
        console.log(
          `${sniffDetails.elValue} WAS SNIFFED! Details: ${sniff.type
          } ${JSON.stringify(sniff.domain)}`
        );
        chrome.tabs.sendMessage(tabId, {
          message: "sniffOccurred",
          xpath: sniff.xpath,
        });
        if (!sniffs[msgTabId][sniff.domain]) {
          sniffs[msgTabId][sniff.domain] = {
            trackerDetails: sniff.trackerDetails,
            details: [],
            type: sniff.type,
          };
        }
        const previouslySniffedDetails = sniffs[msgTabId][sniff.domain]["details"].find(d => d.inputField.fieldName===sniffDetails.fieldName && d.inputField.xpath===sniffDetails.xpath);
        // if previously sniffed, then -update- sniff details
        if (!!previouslySniffedDetails) {
          previouslySniffedDetails.inputField.value = sniffDetails.elValue
          previouslySniffedDetails.timeStamp = sniffDetails.timeStamp
        } else { // -insert- sniff details
          sniffsInserted = true;
          sniffs[msgTabId][sniff.domain]["details"].push({
            inputField: {
              fieldName: sniffDetails.fieldName,
              value: sniffDetails.elValue,
              xpath: sniffDetails.xpath,
            },
            timeStamp: sniffDetails.timeStamp,
          });
        }
      }
      let sniffStorageObj = {};
      sniffStorageObj["sniffs_" + tabId] = sniffs[msgTabId];
      chrome.storage.local.set(sniffStorageObj);
      if (sniffsInserted) {
        setBadge(msgTabId);
      }
      chrome.runtime.sendMessage({
        type: "BGToPopupSniff",
      });
    }
  } else if (message.type == "requestControl") {
    window[message.storageId] = message.value;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (request) {
    let reqCancel = {
      block: false,
    };
    chrome.storage.local.get("extension_switch", items => {
      if(!items['extension_switch']){
        return { cancel: reqCancel.block};
      }
    });
    let reqTabId = activeTabId;
    let inputElsOnTab = input_elements[reqTabId];
    if (inputElsOnTab) {
      const tabURL = inputElsOnTab.url;
      const tabHost = extractHostFromURL(tabURL);
      const reqUrl = request.url;
      const requestHost = extractHostFromURL(reqUrl);
      const requestBaseDomain = getBaseDomain(requestHost);
      if(!isThirdParty(requestHost, tabHost) ) {
        return {
          cancel: false,
        };
      }
      let search_terms = [];
      let longerThan5Chars = inputElsOnTab.inputFields.filter(
        (inputVal) => inputVal.value.length > 5
      );
      search_terms = search_terms.concat(longerThan5Chars);
      if (!search_terms.length) {
        return {
          cancel: false,
        };
      }
      const tdsResult = tds.getTrackerData(reqUrl, tabURL, request.type);
      if(!window.thirdPartyControl && !tdsResult){
        return {
          cancel: false,
        };
      }
      reqCancel = checkRequest(
        request,
        inputElsOnTab,
        tdsResult,
        request.timeStamp,
        requestBaseDomain
      );
    }

    if (reqCancel.block) {
      if (!leaky_requests[reqTabId][reqCancel.domain]) {
        leaky_requests[reqTabId][reqCancel.domain] = {
          trackerDetails: reqCancel.trackerDetails,
          details: [],
          type: reqCancel.type,
        };
      }
      reqCancel.inputFields.forEach((inputFieldDetails) => {
        leaky_requests[reqTabId][reqCancel.domain]["details"].push({
          inputField: inputFieldDetails,
          timeStamp: reqCancel.timeStamp,
        });
      });
      setBadge(reqTabId);
      let reqStorageObj = {};
      reqStorageObj["leaky_requests_" + reqTabId] = leaky_requests[reqTabId];
      chrome.storage.local.set(reqStorageObj);

      chrome.runtime.sendMessage({
        type: "BGToPopupLeak",
      });
      chrome.tabs.sendMessage(reqTabId, {
        message: "reqLeakOccurred",
        xpaths: reqCancel.inputFields.map((el) => el.xpath),
      });
      return { cancel: (reqCancel.block && window.requestControl) };
    }

    return { cancel: (reqCancel.block && window.requestControl)};
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "blocking"]
);

chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.local.set({ ['requestControl']: true }, function () {
    console.log('Req control initialized!');
  });
  chrome.storage.local.set({ ['thirdPartyControl']: true }, function () {
    console.log('Sniffer control initialized!');
  });
  chrome.storage.local.set({ ['extension_switch']: true }, function () {
    console.log('Extension switch initialized!');
  });
  if (typeof(chrome.browserAction.setBadgeBackgroundColor)!=="function") {
    chrome.browserAction.setBadgeBackgroundColor=function(){}; // create "NOOP" polyfill
  }
});

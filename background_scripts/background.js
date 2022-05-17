let input_elements = {};
let leaky_requests = {};
let sniffs = {};
let activeTabId, lastUrl, lastTitle;
const BADGE_TYPE_GOOD = 'good';
const BADGE_TYPE_BAD = 'bad';

let tds = new Trackers();
// initialize with the blocklist info
tds.setLists([tds_tracker_info]);


function checkSniff(elValue, xpath, fieldName, stack, tabURL) {
  // Taken from https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/bfbd47a4c7a1b37e3ae73dc432386bd12798dbf1/shared/js/content-scope/tracking-cookies-1p-protection.js#L14
  const lineTest = /(\()?(http[^)]+):[0-9]+:[0-9]+(\))?/;
  try {
    // Based on https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/bfbd47a4c7a1b37e3ae73dc432386bd12798dbf1/shared/js/content-scope/tracking-cookies-1p-protection.js#L31-L38
    let scriptOrigins = new Set();
    let scriptURLs = new Set();
    for (const stackFrame of stack) {
      const res = stackFrame.match(lineTest);
      const scriptUrl = res && res[2];  // url is the second capture group
      if (scriptUrl) {
        scriptOrigins.add(getHostName(scriptUrl));
        scriptURLs.add(scriptUrl);
      }
    }

    const tabDomain = getBaseDomainFromUrl(tabURL);
    // quit if all scripts have the same domain as the website
    const sameSiteScript = [...scriptOrigins].every(
      (host) =>
        getBaseDomain(host) === tabDomain || host.endsWith(`.${tabDomain}`)
    );
    if (sameSiteScript) {
      return undefined;
    }

    // quit if all scripts have the same entity (owner) as the website
    const sameEntityDomain = [...scriptOrigins].every(
      (host) =>
        entities[tabDomain] &&
        entities[getBaseDomain(host)] &&
        entities[tabDomain] === entities[host]
    );
    if (sameEntityDomain) {
      return undefined;
    }

    // take third-party scripts only
    let thirdPartyScriptUrls = Array.from(scriptURLs).filter(
      (url) => getBaseDomainFromUrl(url) !== tabDomain
    );

    // run the tracker detection
    const tdsResults = [...thirdPartyScriptUrls].map((scriptURL) => {
      return {
        domain: getBaseDomainFromUrl(scriptURL),
        tracker: tds.getTrackerData(scriptURL, tabURL, ""),
      };
    });

    let trackersList = [];
    for (const tdsResult of tdsResults) {
      let domainType;
      let trackerDetails;
      if (tdsResult.tracker === null || tdsResult.tracker.action !== "block") {
        // if the tracker is not in the blocklist, then it is not a tracker
        domainType = "Third Party"; // not in the blocklist
      } else {
        domainType = "Tracker Script";
        trackerDetails = tdsResult.tracker.tracker;
      }
      let trackerRes = {
        xpath: xpath,
        inputValue: elValue,
        type: domainType,
        fieldName,
        domain: tdsResult.domain,
        trackerDetails: trackerDetails,
      };
      trackersList.push(trackerRes);
    }
    const allThirdParty = [...trackersList].every(
      (host) =>
        host['type'] === 'Third Party'
    );
    if (!window.snifferControl && allThirdParty) {
      return undefined;
    }
    return trackersList;
  } catch (e) {
    console.warn("Error in HTML input getter override", e);
  }
}

function setBadge(currTabId) {
  chrome.storage.local.get("extension_switch", function (storage) {
    let badgeText = "";
    let badgeBackgroundColor = [0,255,0,255]; // green

    // if extension is switched on
    if (storage.extension_switch) {
 
      let leakyReqNum = 0;
      let leakyReqs = leaky_requests[currTabId];
      if(leakyReqs){
        for (const domain of Object.keys(leakyReqs)) {
          leakyReqNum += leakyReqs[domain].details.length;
        }
      }

      badgeText = leakyReqNum.toString();

      if (leakyReqNum > 0) {
        badgeBackgroundColor = [255,0,0,255]; // red
      } else {
        let sniffNum = 0;
        const tabSniffs = sniffs[currTabId];
        if (tabSniffs) {
          for (const domain of Object.keys(tabSniffs)) {
            sniffNum += tabSniffs[domain].details.length;
          }
        }
        if (sniffNum > 0) {
          badgeText = sniffNum.toString();
          badgeBackgroundColor = [255,255,0,255]; // yellow
        }
      }
    }

    chrome.browserAction.setBadgeText({text:badgeText, tabId:currTabId});
    chrome.browserAction.setBadgeBackgroundColor({color:badgeBackgroundColor, tabId:currTabId});
  });
}

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

  chrome.storage.local.get("snifferControl", items => {
    window.snifferControl = items["snifferControl"];
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
        const previouslySniffedDetails=sniffs[msgTabId][sniff.domain]["details"].find(d => d.inputField.fieldName===sniffDetails.fieldName && d.inputField.xpath===sniffDetails.xpath);
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
  chrome.storage.local.set({ ['snifferControl']: true }, function () {
    console.log('Sniffer control initialized!');
  });
  chrome.storage.local.set({ ['extension_switch']: true }, function () {
    console.log('Extension switch initialized!');
  });
  if (typeof(chrome.browserAction.setBadgeBackgroundColor)!=="function") {
    chrome.browserAction.setBadgeBackgroundColor=new Function(); // create "NOOP" polyfill
  }
});

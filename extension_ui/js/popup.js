let currentTab;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  currentTab = tabs[0];
});

function addSliderView(htmlPath, tabType) {
  $("#sliding-container").load(htmlPath, { key: "value" }, function () {
    chrome.storage.local.get([tabType + "_" + currentTab.id], listEls => {
    let listElsInTab = listEls[tabType + "_" + currentTab.id];
    renderURL(extractHostFromURL(currentTab.url));
    renderList(listElsInTab, tabType);
    document
      .getElementById("popup-container")
      .classList.add("sliding-subview--open");
    document
      .getElementById("js-hero-close")
      .addEventListener("click", removeSliderView, false);
  });
  });
}

function renderList(listElements, tabType) {
  let detailsDiv = document.getElementById("domain-list");
  const liElements = detailsDiv.getElementsByTagName('li');
  if(liElements.length){
    let first = detailsDiv.firstElementChild;
    while (first) {
        first.remove();
        first = detailsDiv.firstElementChild;
    }
  }
  if(!listElements){
    return;
  }
    Object.keys(listElements).forEach((key) => {
      let tracker = listElements[key].trackerDetails;
      let groupedFields = listElements[key].details.reduce(function (r, a) {
        r[a.inputField.fieldName] = r[a.inputField.fieldName] || [];
        r[a.inputField.fieldName].push(a);
        return r;
      }, Object.create(null));
      let listEl = document.createElement("li");
      listEl.setAttribute("id", "domain-element");
      listEl.setAttribute("class", "site-info__trackers__company-list__url-list");
      let urlDiv = document.createElement("div");
      urlDiv.setAttribute("class", "url site-info__domain block");
      urlDiv.innerText = key;
      let categoryDiv = document.createElement("div");
      categoryDiv.setAttribute("class", "category");
      if (tracker && tracker.owner.name) {
        let displayCategories = ["Analytics", "Advertising", "Social Network"];
        let category = "";
        let categoryRes = displayCategories.some((displayCat) => {
          const match = tracker.categories.find((cat) => cat === displayCat);
          if (match) {
            category = match;
            return true;
          }
          return false;
        });
        if (categoryRes) {
          categoryDiv.innerText = category;
        } else {
          categoryDiv.innerText = tracker.categories.length
            ? tracker.categories[0]
            : listEl.type;
        }
      } else {
        categoryDiv.innerText = listEl.type;
      }
      let findingsDiv = document.createElement("div");
      let fieldsList = document.createElement("ol");
      fieldsList.setAttribute('class', 'default-list site-info__trackers__company-list');
      Object.keys(groupedFields).forEach(key => {
        let fieldEl = document.createElement("li");
        fieldEl.setAttribute("id", "field-element");
        let fieldName = document.createElement("div");
        fieldName.setAttribute('class', 'leaked-fields');
        let fieldValue = groupedFields[key].length
        if(groupedFields[key].slice(-1)[0]['inputField']['value']){
          fieldValue = `(${groupedFields[key].length}) ${key}: ${groupedFields[key].slice(-1)[0]['inputField']['value']}`;
        }else{
          fieldValue = `(${groupedFields[key].length}) ${key}`;
        }
        fieldName.innerText = fieldValue;
        fieldEl.appendChild(fieldName);
        fieldsList.appendChild(fieldEl);
      });
      findingsDiv.appendChild(fieldsList);
      listEl.appendChild(urlDiv);
      listEl.appendChild(categoryDiv);
      listEl.appendChild(findingsDiv);
      detailsDiv.appendChild(listEl);
    });
}

function removeSliderView() {
  document
    .getElementById("popup-container")
    .classList.remove("sliding-subview--open");
}

function renderURL(tabURL) {
  let titleElements = document.getElementsByClassName("hero__title");
  for (const titleElement of titleElements) {
    titleElement.textContent = tabURL;
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let views = chrome.extension.getViews({ type: "popup" });
  if (request.type === "BGToPopupSniff" && views.length > 0) {
    let leak_details_div = document.getElementById("sniff-details");
    chrome.storage.local.get("sniffs_" + currentTab.id, listElsInTab => {
    let sniffs = listElsInTab["sniffs_" + currentTab.id];
    if(sniffs){
      document.getElementById("sniffs_text").textContent = `${
        Object.keys(sniffs).length > 0
        ? Object.values(sniffs)
            .map((el) => el.details)
            .map((el) => el.length)
            .reduce((partialSum, a) => partialSum + a, 0)
        : 0
    } Sniff Attempts`;
      if (leak_details_div !== null) {
        renderList(sniffs, "sniffs");
      }
    }
  });
  } else if (request.type === "BGToPopupLeak" && views.length > 0) {
    let sniff_details_div = document.getElementById("leak-details");
    chrome.storage.local.get("leaky_requests_" + currentTab.id, listElsInTab => {
      let reqs = listElsInTab["leaky_requests_" + currentTab.id];
      if(reqs){
        document.getElementById("leaky_req_text").textContent = `${
          Object.keys(reqs).length > 0
              ? Object.values(reqs)
                .map((el) => el.details)
                .map((el) => el.length)
                .reduce((partialSum, a) => partialSum + a, 0)
            : 0
        } Leaky Requests`;
        if (sniff_details_div !== null) {
            renderList(reqs, "leaky_requests");
        }
      }
    });
  }
});

function toggleButtonControl(storageId, buttonId) {
  chrome.storage.local.get(storageId, items => {
    if (items[storageId]) {
      chrome.storage.local.set({ [storageId]: false }, function () {
        document.getElementById(buttonId).ariaPressed = false;
        document
          .getElementById(buttonId)
          .classList.remove("toggle-button--is-active-true");
        document
          .getElementById(buttonId)
          .classList.add("toggle-button--is-active-false");
          if(storageId==='requestControl'){
            chrome.runtime.sendMessage({
              type: "requestControl",
              storageId,
              value: false,
            });
          }else if(storageId==='snifferControl'){
            chrome.tabs.query(
              { currentWindow: true, active: true },
              function (tabs) {
                let activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {
                  message: "snifferControl",
                  value: false,
                });
              }
            );
          }
      });
    } else {
      chrome.storage.local.set({ [storageId]: true }, function () {
        document.getElementById(buttonId).ariaPressed = true;
        document
          .getElementById(buttonId)
          .classList.remove("toggle-button--is-active-false");
        document
          .getElementById(buttonId)
          .classList.add("toggle-button--is-active-true");
          if(storageId==='requestControl'){
 chrome.runtime.sendMessage({
          type: "requestControl",
          storageId,
          value: true,
        });
          }else if(storageId==='snifferControl'){
            chrome.tabs.query(
              { currentWindow: true, active: true },
              function (tabs) {
                let activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {
                  message: "snifferControl",
                  value: true,
                });
              }
            );
          }
      });
    }
  });
}

function initializeStorage(storageId, buttonId) {
  chrome.storage.local.get(storageId, items => {
    if (items[storageId]) {
      chrome.storage.local.set({ [storageId]: true }, function () {
        document.getElementById(buttonId).ariaPressed = true;
        document
          .getElementById(buttonId)
          .classList.remove("toggle-button--is-active-false");
        document
          .getElementById(buttonId)
          .classList.add("toggle-button--is-active-true");
      });
    } 
    else {
      chrome.storage.local.set({ [storageId]: false }, function () {
        document.getElementById(buttonId).ariaPressed = false;
        document
          .getElementById(buttonId)
          .classList.remove("toggle-button--is-active-true");
        document
          .getElementById(buttonId)
          .classList.add("toggle-button--is-active-false");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  $("#hamburger-menu-container").load("../html/hamburger-menu.html");
  $("#site-info-container").load("../html/site-info.html", function () {
    renderURL(extractHostFromURL(currentTab.url));
    initializeStorage("snifferControl", "sniffer-blocker-button");
    initializeStorage("requestControl", "request-blocker-button");
    document
      .getElementById("sniffer-blocker-button")
      .addEventListener("click", function () {
        toggleButtonControl("snifferControl", "sniffer-blocker-button"), false;
      });
    document
      .getElementById("request-blocker-button")
      .addEventListener("click", function () {
        toggleButtonControl("requestControl", "request-blocker-button"), false;
      });
    // addSliderListener("site-info", "../html/sliding-view.html", 'site_info');

    chrome.storage.local.get("sniffs_" + currentTab.id, sniffList => {
      let sniffs = sniffList["sniffs_" + currentTab.id];
    if (sniffs) {
      document.getElementById("sniffs_text").textContent = `${
        Object.keys(sniffs).length > 0
          ? Object.values(sniffs)
              .map((el) => el.details)
              .map((el) => el.length)
              .reduce((partialSum, a) => partialSum + a, 0)
          : 0
      } Sniff Attempts`;
    }
    });

    chrome.storage.local.get("leaky_requests_" + currentTab.id, leakList => {
    let leaks = leakList["leaky_requests_" + currentTab.id];
    if (leaks) {
      document.getElementById("leaky_req_text").textContent = `${
        Object.keys(leaks).length > 0
          ? Object.values(leaks)
              .map((el) => el.details)
              .map((el) => el.length)
              .reduce((partialSum, a) => partialSum + a, 0)
          : 0
      } Leaky Requests`;
    }
    });

    initSwitchButton();
    addSliderListener(
      "request-leaks-info",
      "../html/leaky-requests.html",
      "leaky_requests"
    );
    addSliderListener("sniffs-info", "../html/sniffs-details.html", "sniffs");
    document.getElementById("switch_button").onclick = function () {
      toggleExtensionControl();
    };
  });
});

function initSwitchButton() {
  const storageId = "extension_switch";
  chrome.storage.local.get(storageId, items => {
    if (items) {
      if (items[storageId]) {
        document.getElementById("switch_button").classList.add("switch-active");
      } else {
        document
          .getElementById("switch_button")
          .classList.remove("switch-active");
        document
          .getElementById("control-buttons")
          .classList.add("control-buttons-disable");
      }
    }
  });
}

function switchOnOff(boolValue) {
  let elementInfo = [
    { storageId: "snifferControl", buttonId: "sniffer-blocker-button" },
    { storageId: "requestControl", buttonId: "request-blocker-button" },
  ];
  for (const element of elementInfo) {
    if (!boolValue) {
      chrome.storage.local.set({ [element.storageId]: false }, function () {
        document.getElementById(element.buttonId).ariaPressed = false;
        document
          .getElementById(element.buttonId)
          .classList.remove("toggle-button--is-active-true");
        document
          .getElementById(element.buttonId)
          .classList.add("toggle-button--is-active-false");
        chrome.runtime.sendMessage({
          type: "requestControl",
          storageId: element.storageId,
          value: false,
        });
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
              message: "snifferControl",
              value: false,
            });
          }
        );
      });
    } else {
      chrome.storage.local.set({ [element.storageId]: true }, function () {
        document.getElementById(element.buttonId).ariaPressed = true;
        document
          .getElementById(element.buttonId)
          .classList.remove("toggle-button--is-active-false");
        document
          .getElementById(element.buttonId)
          .classList.add("toggle-button--is-active-true");
        chrome.runtime.sendMessage({
          type: "requestControl",
          storageId: element.storageId,
          value: true,
        });
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
              message: "snifferControl",
              value: true,
            });
          }
        );
      });
    }
  }
}

function toggleExtensionControl() {
  const storageId = "extension_switch";
  chrome.storage.local.get(storageId, items => {
    if (items[storageId]) {
      chrome.storage.local.set({ [storageId]: false }, function () {
        switchOnOff(false);
        document
          .getElementById("switch_button")
          .classList.remove("switch-active");
        document
          .getElementById("control-buttons")
          .classList.add("control-buttons-disable");
      });
    } else {
      chrome.storage.local.set({ [storageId]: true }, function () {
        switchOnOff(true);
        document.getElementById("switch_button").classList.add("switch-active");
        document
          .getElementById("control-buttons")
          .classList.remove("control-buttons-disable");
      });
    }
  });
}

function addSliderListener(elId, htmlPath, tabType) {
  document.getElementById(elId).addEventListener("click", () => {
    addSliderView(htmlPath, tabType);
  });
}

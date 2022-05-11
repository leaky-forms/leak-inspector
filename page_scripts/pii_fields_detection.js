function getAutofillElements() {
  let autoFillElements = [];
  try {
    const inputEls = Array.from(document.getElementsByTagName("input"));
    const autofillResultsByForms = FormAutofillHeuristics.getFormInfo(
      inputEls,
      false
    );
    for (const form of autofillResultsByForms) {
      let elements = form.fieldDetails.map((formEl) => ({ ...formEl }));
      let shownElements = elements.map((el) => ({
        fieldName: el.fieldName,
        element: el.element,
        isShown: isShown(el.element),
      }));
      autoFillElements = autoFillElements.concat(shownElements);
    }
  } catch (error) {
    // console.log(`Error occured while finding autofill elements: `, error.message);
  }
  return autoFillElements;
}

function _hasLabelMatchingRegex(element, regex) {
  // @ts-ignore
  if (element.labels !== null && element.labels.length) {
    // @ts-ignore
    if (regex.test(element.labels[0].textContent)) {
      return true;
    }
  }

  return false;
}

function isInferredUsernameField(element) {
  const expr =
    /user.name|username|display.name|displayname|user.id|userid|screen.name|screenname|benutzername|benutzer.name|nickname|profile.name|profilename/i;

  let ac = element.autocomplete ? element.autocomplete.fieldName : undefined;
  if (ac && ac === "username") {
    return true;
  }

  if (
    _elementAttrsMatchRegex(element, expr) ||
    _hasLabelMatchingRegex(element, expr)
  ) {
    return true;
  }

  return false;
}

function _elementAttrsMatchRegex(element, regex) {
  if (
    regex.test(element.id) ||
    // @ts-ignore
    regex.test(element.name) ||
    regex.test(element.className)
  ) {
    return true;
  }

  let placeholder = element.getAttribute("placeholder");
  if (placeholder && regex.test(placeholder)) {
    return true;
  }
  return false;
}

function getUsernameFields() {
  let usernameFields = [];
  try {
    const inputElements = document.getElementsByTagName("input");
    usernameFields = Array.from(inputElements).filter(
      (b) => isInferredUsernameField(b) === true
    );
  } catch (error) {
    // console.log(`Error occured while finding username elements: `, error.message);
  }
  return usernameFields.map((element) => ({
    fieldName: "username",
    element,
    isShown: isShown(element),
  }));
}

function getPasswordFields() {
  let passwordFields = [];
  try {
    passwordFields = [...document.querySelectorAll("input[type=password]")];
  } catch (error) {
    // console.log(`Error occured while finding password elements: `, error.message);
  }
  return passwordFields.map((element) => ({
    fieldName: "password",
    element,
    isShown: isShown(element),
  }));
}

function getEmailsByFathom() {
  let emailsByFathom = [];
  try {
    emailsByFathom = [...fathom.detectEmailInputs(document)];
  } catch (error) {
    // console.log(`Error occured while finding password elements: `, error.message);
  }
  return emailsByFathom.map((element) => ({
    fieldName: "email",
    element,
    isShown: isShown(element),
  }));
}

function getAllPIIFields(isShown) {
  let allPIIFields = [];
  const autofillFields = getAutofillElements();
  allPIIFields = allPIIFields.concat(autofillFields);
  const usernameFields = getUsernameFields();
  let onlyInUsernameFields = usernameFields.filter(function (obj) {
    return autofillFields.map((el) => el.element).indexOf(obj.element) == -1;
  });
  if (onlyInUsernameFields.length) {
    allPIIFields = allPIIFields.concat(onlyInUsernameFields);
  }
  const emailFieldsByFathom = getEmailsByFathom();
  let onlyInEmailsByFathom = emailFieldsByFathom.filter(function (obj) {
    return allPIIFields.map((el) => el.element).indexOf(obj.element) == -1;
  });
  if (onlyInEmailsByFathom.length) {
    allPIIFields = allPIIFields.concat(onlyInEmailsByFathom);
  }
  let passwordFields = getPasswordFields();
  allPIIFields = allPIIFields.concat(passwordFields);
  if (isShown) {
    allPIIFields = allPIIFields.filter((element) => element.isShown);
  }
  return allPIIFields;
}

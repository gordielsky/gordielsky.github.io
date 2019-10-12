function showSectionEdu() {
  var eduElem = document.querySelector("#education");
  var expCWIElem = document.querySelector("#caseware-exp");
  var expUHNElem = document.querySelector("#uhn-exp");
  var expOtherElem = document.querySelector("#other-exp");
  if (eduElem.style.display == "none") {
    if (expCWIElem.style.display == "") {
      expCWIElem.style.display = "none"
    }
    if (expUHNElem.style.display == "") {
      expUHNElem.style.display = "none"
    }
    if (expOtherElem.style.display == "") {
      expOtherElem.style.display = "none"
    }
    eduElem.style.display = "";
  } else {
    eduElem.style.display = "none";
    var eduInp = document.querySelector("#input-edu");
    eduInp.checked = "";
  }
}

function showSectionExpCWI() {
  var eduElem = document.querySelector("#education");
  var expCWIElem = document.querySelector("#caseware-exp");
  var expUHNElem = document.querySelector("#uhn-exp");
  var expOtherElem = document.querySelector("#other-exp");
  if (expCWIElem.style.display == "none") {
    if (eduElem.style.display == "") {
      eduElem.style.display = "none"
    }
    if (expUHNElem.style.display == "") {
      expUHNElem.style.display = "none"
    }
    if (expOtherElem.style.display == "") {
      expOtherElem.style.display = "none"
    }
    expCWIElem.style.display = "";
  } else {
    expCWIElem.style.display = "none";
    var inp = document.querySelector("#input-cwi");
    inp.checked = "";
  }
}

function showSectionExpUHN() {
  var eduElem = document.querySelector("#education");
  var expCWIElem = document.querySelector("#caseware-exp");
  var expUHNElem = document.querySelector("#uhn-exp");
  var expOtherElem = document.querySelector("#other-exp");
  if (expUHNElem.style.display == "none") {
    if (eduElem.style.display == "") {
      eduElem.style.display = "none"
    }
    if (expCWIElem.style.display == "") {
      expCWIElem.style.display = "none"
    }
    if (expOtherElem.style.display == "") {
      expOtherElem.style.display = "none"
    }
    expUHNElem.style.display = "";
  } else {
    expUHNElem.style.display = "none";
    var inp = document.querySelector("#input-uhn");
    inp.checked = "";
  }
}

function showSectionExpOther() {
  var eduElem = document.querySelector("#education");
  var expCWIElem = document.querySelector("#caseware-exp");
  var expUHNElem = document.querySelector("#uhn-exp");
  var expOtherElem = document.querySelector("#other-exp");
  if (expOtherElem.style.display == "none") {
    if (eduElem.style.display == "") {
      eduElem.style.display = "none"
    }
    if (expCWIElem.style.display == "") {
      expCWIElem.style.display = "none"
    }
    if (expUHNElem.style.display == "") {
      expUHNElem.style.display = "none"
    }
    expOtherElem.style.display = "";
  } else {
    expOtherElem.style.display = "none";
    var inp = document.querySelector("#input-other");
    inp.checked = "";
  }
}
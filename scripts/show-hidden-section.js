function showSectionEdu() {
  var eduElem = document.querySelector("#education");
  var expElem = document.querySelector("#experience");
  if (eduElem.style.display == "none") {
    if (expElem.style.display == "") {
      expElem.style.display = "none"
    }
    eduElem.style.display = "";
  } else {
    eduElem.style.display = "none";
    var eduInp = document.querySelector("#input-edu");
    eduInp.checked = "";
  }
}

function showSectionExp() {
  var expElem = document.querySelector("#experience");
  var eduElem = document.querySelector("#education");
  if (expElem.style.display == "none") {
    if (eduElem.style.display == "") {
      eduElem.style.display = "none"
    }
    expElem.style.display = "";
  } else {
    expElem.style.display = "none";
    var expInp = document.querySelector("#input-exp");
    expInp.checked = "";
  }
  
}
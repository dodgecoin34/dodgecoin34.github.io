var params = new URLSearchParams(window.location.search);

var bar = document.querySelectorAll(".bottom_element_grid");

// zaznaczanie aktywnej zakładki
var bottom = localStorage.getItem("bottom");

if (bottom) {
  bar.forEach((element) => {
    var image = element.querySelector(".bottom_element_image");
    var text = element.querySelector(".bottom_element_text");

    var send = element.getAttribute("send");

    if (send === bottom) {
      image.classList.add(send + "_open");
      text.classList.add("open");
    } else {
      image.className = "bottom_element_image " + send;
      text.classList.remove("open");
    }
  });
}

// GŁÓWNA FUNKCJA NAWIGACJI (STATYCZNA)
function sendTo(page, top, bottom) {
  if (top) localStorage.setItem("top", top);
  if (bottom) localStorage.setItem("bottom", bottom);

  location.href = page + ".html?" + params.toString();
}

// klik dolnego paska
bar.forEach((element) => {
  element.addEventListener("click", () => {
    var target = element.getAttribute("send");
    localStorage.setItem("bottom", target);
    sendTo(target);
  });
});

// ANDROID – wysokość paska
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) return 2;
  if (/iPad|iPhone|iPod/.test(userAgent)) return 3;

  return 4;
}

if (getMobileOperatingSystem() === 2) {
  var barEl = document.querySelector(".bottom_bar");
  if (barEl) barEl.style.height = "70px";
}

// utils (zostawione, bo mogą być używane gdzie indziej)
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

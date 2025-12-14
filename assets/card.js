var time = document.getElementById("time");
var params = new URLSearchParams(window.location.search);

// ustawienie czasu
setClock();
function setClock() {
  var date = new Date();
  time.innerHTML =
    "Czas: " +
    date.toLocaleTimeString("pl-PL") +
    " " +
    date.toLocaleDateString("pl-PL");
  setTimeout(setClock, 1000);
}

// rozwijanie dodatkowych danych
var unfold = document.querySelector(".info_holder");
unfold.addEventListener("click", () => {
  unfold.classList.toggle("unfolded");
});

// funkcja do wstawiania danych do card
function setData(id, value) {
  document.getElementById(id).innerHTML = value;
}

// zapis i odczyt IndexedDB
function getDb() {
  return new Promise((resolve, reject) => {
    var request = window.indexedDB.open("cwelObywatel", 1);
    request.onerror = (e) => reject(e.target.error);
    request.onupgradeneeded = (e) => {
      var db = e.target.result;
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "data" });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
  });
}

function getStore(db) {
  return db.transaction("data", "readwrite").objectStore("data");
}

function getData(db) {
  return new Promise((resolve, reject) => {
    var store = getStore(db);
    var request = store.get("data");
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

function saveData(db, data) {
  return new Promise((resolve, reject) => {
    var store = getStore(db);
    var request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

// wstawienie danych do card
function loadReadyData(result) {
  if (!result) return;

  // zamiana wartości na czytelne
  var sexText = result.sex === "k" ? "Kobieta" : "Mężczyzna";

  setData("name", result.name?.toUpperCase() || "");
  setData("surname", result.surname?.toUpperCase() || "");
  setData("nationality", result.nationality?.toUpperCase() || "");
  setData("fathersName", "WOJCIECH");
  setData("mothersName", "AGATA");

  if (result.day && result.month && result.year) {
    let d = result.day.padStart(2, "0");
    let m = result.month.padStart(2, "0");
    setData("birthday", `${d}.${m}.${result.year}`);
  }

  setData("familyName", result.familyName || "");
  setData("sex", sexText);
  setData("fathersFamilyName", result.fathersFamilyName || "");
  setData("mothersFamilyName", result.mothersFamilyName || "");
  setData("birthPlace", result.birthPlace || "");
  setData("countryOfBirth", result.countryOfBirth || "");
  setData(
    "adress",
    `ul. ${result.address1 || ""}<br>${result.address2 || ""} ${result.city || ""}`
  );

  // PESEL generowany losowo
  var later = result.sex === "k" ? "0382" : "0295";
  var day = result.day.padStart(2, "0");
  var month = result.month.padStart(2, "0");
  var year = result.year.toString().substring(2);
  setData("pesel", year + month + day + later + "7");

// ustawiamy daty wydania i ważności ręcznie
var given = new Date(2022, 8, 11); // miesiące w JS liczone od 0, więc 6 = lipiec
var expiry = new Date(2032, 8, 11); // 10 lat później

setData("givenDate", given.toLocaleDateString("pl-PL"));
setData("expiryDate", expiry.toLocaleDateString("pl-PL"));

  // homeDate
  if (!localStorage.getItem("homeDate")) {
    var home = new Date();
    home.setFullYear(Math.floor(Math.random() * (2019 - 2012 + 1)) + 2012);
    home.setMonth(Math.floor(Math.random() * 12));
    home.setDate(Math.floor(Math.random() * 25) + 1);
    localStorage.setItem("homeDate", home.toLocaleDateString("pl-PL"));
  }
  document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate");
}

// główna funkcja
async function loadData() {
  var db = await getDb();
  var stored = await getData(db);

  // 1. jeśli są zapisane dane w IndexedDB → wstaw
  if (stored) loadReadyData(stored);

  // 2. jeśli są parametry w URL → nadpisz i zapisz w IndexedDB
  if (params.toString()) {
    let result = Object.fromEntries(params);
    result.data = "data";
    loadReadyData(result);
    await saveData(db, result);
  }
}

// start
loadData();

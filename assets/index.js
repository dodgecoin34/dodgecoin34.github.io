// selector płci
var selector = document.querySelector(".selector_box");

selector.addEventListener("click", () => {
  selector.classList.toggle("selector_open");
});

// czyszczenie błędu daty po kliknięciu
document.querySelectorAll(".date_input").forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".date").classList.remove("error_shown");
  });
});

// płeć
var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
  option.addEventListener("click", () => {
    sex = option.id;
    document.querySelector(".selected_text").innerHTML = option.innerHTML;
    selector.classList.remove("selector_open");
  });
});

// czyszczenie błędów inputów
document.querySelectorAll(".input_holder").forEach((element) => {
  var input = element.querySelector(".input");
  input.addEventListener("click", () => {
    element.classList.remove("error_shown");
  });
});

// przycisk "wejdź"
document.querySelector(".go").addEventListener("click", () => {
  var empty = [];
  var params = new URLSearchParams();

  params.set("sex", sex);

  // data urodzenia
  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  [day, month, year].forEach((input) => {
    if (isEmpty(input.value)) {
      document.querySelector(".date").classList.add("error_shown");
      empty.push(input);
    } else {
      params.set(input.id, input.value);
    }
  });

  // pozostałe inputy
  document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");

    if (isEmpty(input.value)) {
      empty.push(element);
      element.classList.add("error_shown");
    } else {
      params.set(input.id, input.value);
    }
  });

  // jeśli są błędy – scroll do pierwszego
  if (empty.length !== 0) {
    empty[0].scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    forwardToId(params);
  }
});

// helpers
function isEmpty(value) {
  return /^\s*$/.test(value);
}

function forwardToId(params) {
location.href = "id.html?" + params.toString();
}

// instrukcja (rozwijanie)
var guide = document.querySelector(".guide_holder");

guide.addEventListener("click", () => {
  guide.classList.toggle("unfolded");
});

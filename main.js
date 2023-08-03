"use strict";
// Variables
const summarySlide = document.querySelector(".summary");
let form2Data = [];
let paymentPlan, paymentDuration, pricePaid;
let priceValuesForm3, totalPriceForm3, addOnsForm3;
let form3Numbers = [];
let selectedAddons, allSelected;
let summaryTotal, controls;
let isMobile = false;

// For the sidebar
const indicatorNumbers = document.querySelectorAll(".number");

for (let i = 0; i <= indicatorNumbers.length; i++) {
  indicatorNumbers.forEach((number) => {
    number.setAttribute("data-slide", `${i++}`);
  });
}

// For slide implementation
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");

let currentSlide = 0; // Ensure to correct this after manipulation.

// This decides the version of slide to be used.
window.addEventListener('load', () => {
  slidePicker();
  adjustControlsPosition();
})

// Functions
function slidePicker(slide) {
  isMobile ? mobileSlide(slide) : goToSlide(slide);
}

slidePicker(currentSlide);

function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    s.classList.remove("active-slide");

    if (!s.classList.contains("active-slide")) {
      s.querySelectorAll(".lower-btns").forEach((btn) => btn.remove());
    }

    if (s.style.transform === `translateX(0%)`) {
      s.classList.add("active-slide");
      if (s.classList.contains("active-slide")) {
        s.querySelector("form")?.insertAdjacentHTML(
          "beforeend",
          `
        <div class="lower-btns" id="lower-btns">
          <a href="#" onClick = "prevSlide()">Go Back</a>
          <button type="submit">Next Step</button>
        </div>
        `
        );
      }
    }
  });
}

function mobileSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    s.classList.remove("active-slide");

    if (!s.classList.contains("active-slide")) {
      s.querySelectorAll(".lower-btns").forEach((btn) => btn.remove());
    }

    if (s.style.transform === `translateX(0%)`) {
      s.style.display = "flex"; // This is what fixed the issue that I had (might change it to visibility)
      s.classList.add("active-slide");
      if (s.classList.contains("active-slide")) {
        s.querySelector("form")?.insertAdjacentHTML(
          "beforeend",
          `
        <div class="lower-btns" id="lower-btns">
          <a href="#" onClick = "prevSlide()">Go Back</a>
          <button type="submit">Next Step</button>
        </div>
        `
        );
      }
    } else {
      s.style.display = "none"; // And this too.
    }
  });
}



function objectify(keys, values) {
  const newObject = keys.reduce((acc, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});

  return newObject;
}

const activateStep = function (slide) {
  // How this function works is that we remove the active class of the dots before adding the active class to the specific dot that's actually active.
  document
    .querySelectorAll(".number")
    .forEach((dot) => dot.classList.remove("active"));

  document
    .querySelector(`.number[data-slide = "${slide}"]`)
    ?.classList.add("active");
};

function nextSlide() {
  currentSlide++;
  slidePicker(currentSlide);
  activateStep(currentSlide);

  // Changes text of the payment summary slide.
  if (summarySlide.classList.contains("active-slide")) {
    summarySlide.querySelector("button").textContent = "Confirm";
  }
}

function prevSlide() {
  currentSlide--;
  slidePicker(currentSlide);
  activateStep(currentSlide);
  form2Data = []; // Clears previous values of Form2Data;
  selectedAddons = {};
  undoRenderAddon();
  totalPriceForm3 = 0;
  undoInsertSummaryTotal();
  adjustControlsPosition();
}

function perMonthOrYear(price) {
  return `$${price}/${paymentDuration === "Monthly" ? "mo" : "yr"}`;
}

function renderAddon(object) {
  for (const [key, value] of Object.entries(object)) {
    document.querySelector(".dark-bg").insertAdjacentHTML(
      "beforeend",
      `
    <div class="addon">
      <div class="addon-name">${key}</div>
      <div class="addon-price">+${perMonthOrYear(value)}</div>
    </div>
    `
    );
  }
}

function undoRenderAddon() {
  document.querySelectorAll(".addon").forEach((addon) => addon.remove());
}

function insertSummaryTotal() {
  document.querySelector(".summary form").insertAdjacentHTML(
    "beforeend",
    `
  <div class="total">
    <div class="total-label">Total (per ${
      paymentDuration === "Monthly" ? "month" : "year"
    })</div>
    <div class="total-price">${perMonthOrYear(summaryTotal)}</div>
  </div>
  `
  );
}

function undoInsertSummaryTotal() {
  document.querySelectorAll(".total").forEach((price) => price.remove());
}

// For Step 1 [Form]
const allInputs = document.querySelectorAll(".form-elements input");
const actualForm = document.querySelector(".form-elements");
const errorMessages = document.querySelectorAll(".form-elements label>span");

// User data input, might use formData API later.
const nameInput = document.querySelector(".form-elements input[type=text]");
const telInput = document.querySelector("input[type=tel]");
const emailInput = document.querySelector("input[type=email]");

const validationPatterns = {
  name: /^[a-z\s\-]{2,}$/i,
  telephone: /^[\d+ ]{10,14}$/,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
};

actualForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  adjustControlsPosition();

  // Form validation
  if (Array.from(allInputs).every((input) => input.value === "")) {
    allInputs.forEach((input) => {
      input.focus();
      input.classList.add("error");
      errorMessages.forEach((message) => (message.style.display = "flex"));
    });
    adjustControlsPosition();
  } else if (!validationPatterns.name.test(nameInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    nameInput.focus();
    nameInput.classList.add("error");
    const [nameError, ,] = [...errorMessages];
    nameError.textContent = "Enter name correctly";
    errorMessages[0].style.display = "flex";
    adjustControlsPosition();
  } else if (!validationPatterns.email.test(emailInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    emailInput.focus();
    emailInput.classList.add("error");
    const [, emailError] = [...errorMessages];
    emailError.textContent = "Enter email correctly";
    errorMessages[1].style.display = "flex";
    adjustControlsPosition();
  } else if (!validationPatterns.telephone.test(telInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    telInput.focus();
    telInput.classList.add("error");
    const [, , telError] = [...errorMessages];
    telError.textContent = "Enter phone number correctly";
    errorMessages[2].style.display = "flex";
    adjustControlsPosition();
  } else {
    errorMessages.forEach((message) => (message.style.display = "none"));
    nextSlide(); // -100%, 0%, 100%, 200% ...
    adjustControlsPosition();
  }
});

//For Step 2 [Select Plan] // MAY REFACTOR LATER
//Switch
const toggleSwitch = document.querySelector(".switch");
const toggleBtn = document.querySelector("#toggle-btn");
const btnOn = document.querySelector(".on-state");
const btnOff = document.querySelector(".off-state");

function displayError() {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-of-selection");
  errorMessage.innerHTML = `
    <img class = "error-icon" src="close-circle.svg">
      select a payment plan!
    `;
  document.querySelector(".modeofpayment").after(errorMessage);
  setTimeout(() => {
    document.querySelector(".error-of-selection").style.display = "none";
  }, 2000);
  adjustControlsPosition();
}

toggleSwitch?.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
  btnOn.classList.toggle("active");
  btnOff.classList.toggle("active");
  const radioLabels = document.querySelectorAll(".radio-tile > label");

  if (toggleBtn.classList.contains("active")) {
    radioLabels.forEach((label) => {
      //Regex syntax is used to obtain the price Number from the string
      const figures = label.firstElementChild.textContent.replace(/\D/g, "");
      label.firstElementChild.textContent = `$${figures * 10}/yr`;
      label.innerHTML += `<span class = "messageClass">2 months free</span>`;
    });
  } else {
    radioLabels.forEach((label) => {
      const figures = label.firstElementChild.textContent.replace(/\D/g, "");
      label.firstElementChild.textContent = `$${figures / 10}/mo`;
      label.lastElementChild.style.display = "none";
    });
  }

  // Change in prices of Step 3 that have to run on click
  const priceText = document.querySelectorAll("label.pricing");
  priceText.forEach((price) => {
    const prices = price.textContent.replace(/\D/g, "");
    price.textContent = toggleBtn.classList.contains("active")
      ? `$${prices * 10}/yr`
      : `$${prices / 10}/mo`;
  });
});

document
  .querySelector(".form2 > form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const isChecked = Array.from(
      document.querySelectorAll('input[type="radio"]')
    ).some((option) => option.checked);
    isChecked ? nextSlide() : displayError();

    //[DATA COLLECTION] for Summary Slide 4.
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (radio.checked) {
        const checkedPlan = radio.nextElementSibling
          .querySelector("label")
          .getAttribute("for");
        const checkedPriceValue = +radio.nextElementSibling
          .querySelector("label")
          .firstElementChild.textContent.replace(/\D/g, "");
        const monthlyOrYearly = toggleBtn.classList.contains("active")
          ? "Yearly"
          : "Monthly";
        form2Data.push(checkedPlan, monthlyOrYearly, checkedPriceValue);
      }
    });

    [paymentPlan, paymentDuration, pricePaid] = form2Data;

    const planHTML = document.querySelector(".pay-plan-selected");
    const pricingHTML = document.querySelector(".selected-plan-pricing");

    planHTML.textContent = `${paymentPlan} (${paymentDuration})`;
    pricingHTML.textContent = `${perMonthOrYear(pricePaid)}`;
    adjustControlsPosition();
  });

// For Step 3 [Pick add-ons]
// Checkbox functionality and data
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const addOns = document.querySelectorAll(".gaming-addon");

checkBoxes.forEach((checkBox) =>
  //// ->[FUNCTIONALITY] Enabling selected state for each gaming addon that is clicked.
  checkBox.addEventListener("click", () => {
    checkBox.closest(".gaming-addon").classList.toggle("selected");
    allSelected = Array.from(
      document.querySelectorAll(".selected > .addon-text > .pricing")
    );
  })
);

document
  .querySelector(".form3 > form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    nextSlide();
    //// -> [DATA COLLECTION]
    priceValuesForm3 = allSelected.map(
      (el) => +el.textContent.replace(/\D/g, "")
    );
    addOnsForm3 = allSelected.map((el) => el.getAttribute("for"));
    selectedAddons =
      priceValuesForm3 === undefined
        ? {}
        : objectify(addOnsForm3, priceValuesForm3);
    renderAddon(selectedAddons);
    totalPriceForm3 =
      priceValuesForm3 === undefined
        ? 0
        : priceValuesForm3.reduce((acc, cur) => acc + cur, 0);
    summaryTotal = pricePaid + totalPriceForm3;
    insertSummaryTotal(); // Rendering the total price to DOM.
    adjustControlsPosition();
  });

// For step 4 [Finishing up]
const changePlan = document.querySelector(".change-plan");
changePlan.addEventListener("click", function () {
  const slide = changePlan.dataset.slide;
  currentSlide = slide;
  slidePicker(slide);
  activateStep(slide);
  form2Data = []; // Clears previous values of Form2Data;
  selectedAddons = {};
  undoRenderAddon();
  totalPriceForm3 = 0;
  undoInsertSummaryTotal();
  adjustControlsPosition();
});

document.querySelector(".summary form").addEventListener("submit", (e) => {
  e.preventDefault();
  nextSlide();
  activateStep(3);
});

//Function that keeps the controls. (Attempting ForEach Usage)
function adjustControlsPosition() {
  controls = document.querySelectorAll(".lower-btns");
  controls.forEach((control) => {
    let controlsRect = control.getBoundingClientRect();
    if (window.innerWidth <= 580) {
      isMobile = true;
      const distanceToBottom = Math.floor(
        window.innerHeight - controlsRect.bottom
      );
      control.style.transform = `translateY(${distanceToBottom}px)`;
    }
  });
}

// For mobile (Checks if the user is on phone hence no browser resize occurs)
adjustControlsPosition();

// For handling cases where the browser is resized to check degree of responsiveness.
window.addEventListener("resize", () => {
  adjustControlsPosition();
  isMobile = window.innerWidth <= 580 ? true : false;
});

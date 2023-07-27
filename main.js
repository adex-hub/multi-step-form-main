"use strict";
// Variables
const summarySlide = document.querySelector(".summary");
let form2Data = [];
let paymentPlan, paymentDuration, pricePaid;

// For the sidebar
const indicatorNumbers = document.querySelectorAll(".number");

for (let i = 0; i <= indicatorNumbers.length; i++) {
  indicatorNumbers.forEach((number) => {
    // number.textContent = i++;
    number.setAttribute("data-slide", `${i++}`);
  });
}

// For slide implementation
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const controlBtns = document.querySelector(".lower-btns");
// slider.style.overflow = 'visible';

let currentSlide = 0; // Ensure to correct this after manipulation.

function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
    s.classList.remove("active-slide");

    if (s.style.transform === `translateX(0%)`) {
      s.classList.add("active-slide");
      if (s.classList.contains("active-slide")) {
        s.querySelector("form").insertAdjacentHTML(
          "beforeend",
          `
      <div class="lower-btns" id="lower-btns">
        <a href="#" onClick = "prevSlide()">Go Back</a>
        <button type="submit">Next Step</button>
      </div>
      `
        );
      } else {
        const ctrlBtns = document.getElementsById("lower-btns");
        ctrlBtns.remove(); // This else block is non-functional for some reason.
      }
    }
  });
}

goToSlide(currentSlide);

const activateStep = function (slide) {
  // How this function works is that we remove the active class of the dots before adding the active class to the specific dot that's actually active.
  document
    .querySelectorAll(".number")
    .forEach((dot) => dot.classList.remove("active"));

  document
    .querySelector(`.number[data-slide = "${slide}"]`)
    .classList.add("active");
};

function nextSlide() {
  currentSlide++;
  goToSlide(currentSlide);
  activateStep(currentSlide);

  // Changes text of the payment summary slide.
  if (summarySlide.classList.contains("active-slide")) {
    summarySlide.querySelector("button").textContent = "Confirm";
  }
}

function prevSlide() {
  currentSlide--;
  goToSlide(currentSlide);
  activateStep(currentSlide);
  form2Data = []; // Clears previous values of Form2Data;
}

// For Step 1 [Form]
const allInputs = document.querySelectorAll(".form-elements input");
const actualForm = document.querySelector(".form-elements");
const errorMessages = document.querySelectorAll(".form-elements label>span");

// User data input, might use formData later.
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

  // Form validation
  if (Array.from(allInputs).every((input) => input.value === "")) {
    allInputs.forEach((input) => {
      input.focus();
      input.classList.add("error");
      errorMessages.forEach((message) => (message.style.display = "flex"));
    });
  } else if (!validationPatterns.name.test(nameInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    nameInput.focus();
    nameInput.classList.add("error");
    const [nameError, ,] = [...errorMessages];
    nameError.textContent = "Enter name correctly";
    errorMessages[0].style.display = "flex";
  } else if (!validationPatterns.email.test(emailInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    emailInput.focus();
    emailInput.classList.add("error");
    const [, emailError] = [...errorMessages];
    emailError.textContent = "Enter email correctly";
    errorMessages[1].style.display = "flex";
  } else if (!validationPatterns.telephone.test(telInput.value)) {
    errorMessages.forEach((message) => (message.style.display = "none"));
    telInput.focus();
    telInput.classList.add("error");
    const [, , telError] = [...errorMessages];
    telError.textContent = "Enter phone number correctly";
    errorMessages[2].style.display = "flex";
  } else {
    errorMessages.forEach((message) => (message.style.display = "none"));
    nextSlide(); // -100%, 0%, 100%, 200% ...
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
      <ion-icon name="close-circle" class="error-icon"></ion-icon>
      select a payment plan!
    `;
  document.querySelector(".modeofpayment").after(errorMessage);
  setTimeout(() => {
    document.querySelector(".error-of-selection").style.display = "none";
  }, 2000);
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
    pricingHTML.textContent = `$${pricePaid}/${
      paymentDuration === "Monthly" ? "mo" : "yr"
    }`;
  });

// For Step 3 [Pick add-ons]
// Checkbox functionality and data
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const addOns = document.querySelectorAll(".gaming-addon");

checkBoxes.forEach((checkBox) =>
  //// ->[FUNCTIONALITY] Enabling selected state for each gaming addon that is clicked.
  checkBox.addEventListener("click", () => {
    checkBox.closest(".gaming-addon").classList.toggle("selected");
    const allSelected = Array.from(
      document.querySelectorAll(".selected > .addon-text > .pricing")
    );

    //// -> [DATA] Getting the price of each selected addon.
    const priceValues = allSelected.map(
      (el) => +el.textContent.replace(/\D/g, "")
    );
    //// -> [DATA] Total price of selected addons
    // const totalPrice = `$${priceValues.reduce((acc, cur) => acc + cur, 0)}`;
    console.log(priceValues);
  })
);

document
  .querySelector(".form3 > form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    nextSlide();
  });

// For step 4 [Finishing up]
const changePlan = document.querySelector(".change-plan");
changePlan.addEventListener("click", function () {
  const slide = changePlan.dataset.slide;
  currentSlide = slide;
  goToSlide(slide);
  activateStep(slide);
  form2Data = []; // Clears previous values of Form2Data;
});

const imgTimer = 5000;
let homeImg = document.getElementById("homeImg");
let imgArray = [
  "https://i.imgur.com/jByJ4ih.jpg",
  "https://i.imgur.com/jVfoZnP.jpg",
  "https://i.imgur.com/xPDwUb3.jpg",
  "https://i.imgur.com/Ex5x3IU.jpg",
];

const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const mess = document.getElementById("message");
const subject = document.getElementById("subject");

function changeImg() {
  const curImg = homeImg.getAttribute("src");
  const curIndex = imgArray.indexOf(curImg);
  if (curIndex !== -1 && curIndex !== imgArray.length - 1) {
    homeImg.setAttribute("src", imgArray[curIndex + 1]);
  } else {
    homeImg.setAttribute("src", imgArray[0]);
  }
  setTimeout(changeImg, imgTimer);
}

if (imgArray.length > 1 && homeImg) {
  setTimeout(changeImg, imgTimer);
}

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (checkInputs()) {
    e.target.submit();
  }
});

function checkInputs() {
  const items = document.querySelectorAll(".item");
  let isValid = true; // Flag to track if the form is valid

  for (const item of items) {
    if (item.value === "") {
      item.classList.add("error");
      item.parentElement.classList.add("error");
      showError(
        item,
        `${
          item.name.charAt(0).toUpperCase() + item.name.slice(1)
        } cannot be blank`
      );
      isValid = false;
    } else {
      item.classList.remove("error");
      item.parentElement.classList.remove("error");
      hideError(item);
    }

    if (item.type === "email") {
      if (!checkEmail()) {
        isValid = false;
      }
      item.addEventListener("keyup", checkEmail);
    } else {
      item.addEventListener("keyup", () => {
        if (item.value !== "") {
          item.classList.remove("error");
          item.parentElement.classList.remove("error");
          hideError(item);
        } else {
          item.classList.add("error");
          item.parentElement.classList.add("error");
          showError(
            item,
            `${
              item.name.charAt(0).toUpperCase() + item.name.slice(1)
            } cannot be blank`
          );
          isValid = false;
        }
      });
    }
  }
  return isValid;
}

function checkEmail() {
  const email = document.getElementById("email");
  const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
  const errorTxtEmail = document.querySelector(".error-txt.email");

  if (!email.value.match(emailRegex)) {
    email.classList.add("error");
    email.parentElement.classList.add("error");

    if (email.value !== "") {
      errorTxtEmail.textContent = "Enter a valid email address";
    } else {
      errorTxtEmail.textContent = "Email Address cannot be blank";
    }
    return false;
  } else {
    email.classList.remove("error");
    email.parentElement.classList.remove("error");
    errorTxtEmail.textContent = "";
    return true;
  }
}

function showError(input, message) {
  const errorText = input.parentElement.querySelector(".error-txt");
  if (errorText) {
    errorText.textContent = message;
  }
}

function hideError(input) {
  const errorText = input.parentElement.querySelector(".error-txt");
  if (errorText) {
    errorText.textContent = "";
  }
}

function truncateText() {
  const descriptions = document.querySelectorAll(".description");
  const titles = document.querySelectorAll(".title");
  const maxLength = 75;
  const titleLength = 25;

  descriptions.forEach((description) => {
    const text = description.textContent;

    if (text.length > maxLength) {
      description.textContent = text.substr(0, maxLength) + "...";
    } else {
      description.textContent = text;
    }
  });
  titles.forEach((title) => {
    const text = title.textContent;

    if (text.length > titleLength) {
      title.textContent = text.substr(0, titleLength) + "...";
    } else {
      title.textContent = text;
    }
  });
}

truncateText();

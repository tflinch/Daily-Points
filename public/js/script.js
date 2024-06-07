console.log("Hello From Scripts");

const imgTimer = 5000;
let homeImg = document.getElementById("homeImg");
let imgArray = [
  "https://i.imgur.com/jByJ4ih.jpg",
  "https://i.imgur.com/jVfoZnP.jpg",
  "https://i.imgur.com/xPDwUb3.jpg",
  "https://i.imgur.com/Ex5x3IU.jpg",
];

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

if (imgArray.length > 1) {
  setTimeout(changeImg, imgTimer);
}

console.log("Email Contact Form");

const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const mess = document.getElementById("message");
const subject = document.getElementById("subject");

function sendEmail() {
  const bodyMessage = `Full Name: ${fullName.value} <br> Email: ${email.value} <br> Phone Number: ${phone.value} <br> Message ${mess.value}`;
  console.log(bodyMessage);
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: process.env.EMAIL_USERNAME,
    Password: process.env.EMAIL_PASSWORD,
    To: process.env.EMAIL_USERNAME,
    From: process.env.EMAIL_USERNAME,
    Subject: subject.value,
    Body: bodyMessage,
  }).then((message) => {
    if (message === "OK") {
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully!",
        icon: "success",
      });
    }
  });
}

function checkInputs() {
  const items = document.querySelectorAll(".item");

  for (const item of items) {
    if (item.value === "") {
      item.classList.add("error");
      item.parentElement.classList.add("error");
    }
    if (items[1].value !== "") {
      checkEmail();
    }

    items[1].addEventListener("keyup", () => {
      checkEmail();
    });

    items;

    item.addEventListener("keyup", () => {
      if (item.value !== "") {
        item.classList.remove("error");
        item.parentElement.classList.remove("error");
      } else {
        item.classList.add("error");
        item.parentElement.classList.add("error");
      }
    });
  }
}

function checkEmail() {
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
  } else {
    email.classList.remove("error");
    email.parentElement.classList.remove("error");
  }
}

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

console.log(homeImg);

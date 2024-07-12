// hamburger menu
var navLinks = document.getElementById("navLinks");
var mobileSize = window.matchMedia("(max-width: 768px)");
function mobileMenu() {
  if (mobileSize.matches) {
    if (navLinks.style.display === "block") {
      navLinks.style.display = "none";
    } else {
      navLinks.style.display = "block";
    }
  }
}

navLinks.addEventListener("click", mobileMenu);

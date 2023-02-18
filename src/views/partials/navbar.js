"use-strict";

let isShown = false;

const hideMobileNav = () => {
  if (isShown) {
    document.getElementById("mobile-nav").style.display = "none";

    isShown = !isShown;
  }
};

const showMobileNav = () => {
  document.getElementById("mobile-nav").style.display = "flex";

  if (!isShown) {
    isShown = !isShown;
  } else {
    hideMobileNav();
  }
};

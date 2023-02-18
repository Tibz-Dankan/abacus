"use-strict";

let isShown = false;

const hideUser = () => {
  if (isShown) {
    document.getElementById("auth-user").style.display = "none";
    isShown = !isShown;
  }
};

// const closeOnOutClick = () => {
//   document.onclick = (event) => {
//     if (event.target.id !== "auth-user") {
//       hideUser();
//     }
//   };
// };

const assignStyles = () => {
  const element = document.getElementById("auth-user");
  if (!element) return;
  element.style.position = "absolute";
  element.style.top = "56px";
  element.style.right = "-32px";
  element.style.display = "flex";
  element.style.flexDirection = "column";
  element.style.alignItems = "start";
  element.style.padding = "16px";
  element.style.minWidth = "200px";
  element.style.maxWidth = "250px";
  element.style.borderRadius = "4px";
  element.style.boxShadow = "1px 1px 4px hsla(0, 0%, 10%, 0.2)";
  element.style.zIndex = "1000";
  element.style.backgroundColor = "#e9ecef";
};

const showUser = () => {
  if (!isShown) {
    assignStyles();
    isShown = !isShown;
  } else {
    // closeOnOutClick();
    hideUser();
  }
};

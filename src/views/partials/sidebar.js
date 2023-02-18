let isOpen = false;

const showIcons = () => {
  const closeIcon = document.getElementById("close-sidebar");
  const menuIcon = document.getElementById("open-sidebar");
  if (isOpen) {
    menuIcon.style.display = "none";
    closeIcon.style.display = "inline";
  } else {
    menuIcon.style.display = "inline";
    closeIcon.style.display = "none";
  }
};

const hideSidebar = () => {
  if (isOpen) {
    document.getElementById("sidebar").style.left = "-256px";
    isOpen = !isOpen;
  }
  showIcons();
};

const showSidebar = () => {
  if (!isOpen) {
    document.getElementById("sidebar").style.left = "0px";
    isOpen = !isOpen;
    showIcons();
  } else {
    hideSidebar();
  }
};

let isOpen = false;

const closeSideBar = () => {
  if (isOpen) {
    document.getElementById("mySidebar").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
    isOpen = !isOpen;
  }
};

const openSideBar = () => {
  if (!isOpen) {
    document.getElementById("mySidebar").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
    isOpen = !isOpen;
  } else {
    closeSideBar();
  }
};

const showEditForm = () => {
  document.getElementById("editMyProfile").style.display = "block";
  document.getElementById("myProfile").style.display = "none";
};

const hideEditForm = () => {
  document.getElementById("myProfile").style.display = "flex";
  document.getElementById("editMyProfile").style.display = "none";
};

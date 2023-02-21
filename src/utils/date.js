const format = (date) => {
  const time = date.toLocaleTimeString("en-Us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const day = date.toLocaleDateString();

  return `${day}  ${time}`;
};

const dateOne = (dateStr) => {
  const date = new Date(dateStr);
  const formattedDate = format(date);

  console.log("date formatted");
  console.log(formattedDate);

  return formattedDate;
};
// dateOne("2023-02-21T07:28:50.664Z");

module.exports = { dateOne };

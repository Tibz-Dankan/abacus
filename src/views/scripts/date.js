const date = new Date(Date.now());
const dateRoman2 = date.toISOString();

console.log("Iso string");
console.log(dateRoman2); //2022-07-03T00:05:14.103Z

const dateRoman8 = date.toJSON();
console.log(dateRoman8); // 2022-07-03T00:16:22.688Z

const date4Roman3 = date.toLocaleDateString();
console.log(date4Roman3); //7/3/2022

const dateRoman10 = date.toLocaleTimeString("en-Us", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
console.log(dateRoman10); //3:47 AM

// call the Dates class onloading
class Dates {
  date;
  constructor(date) {
    this.date = new Date(date);
  }

  format() {
    const day = this.date.toLocaleTimeString("en-Us", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const time = this.date.toLocaleDateString();

    return `${day} ${time}`;
  }

  dateOne() {
    const dateCell = document.getElementById("document-date");
    const date = this.format();

    console.log("date formatted");
    console.log(date);

    dateCell.innerHTML = date;
  }

  dateMany(index) {
    const dateCell = document.getElementById(`document-date-${index}`);

    // compute to get the elapsed time
    // set attribute "time-elapsed" with its value
    // set inner html to select element

    // dateCell.setAttribute("date", date);
    // dateCell.setAttribute("disabled", ""); // setting boolean attributes
  }
}

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
  const dateCell = document.getElementById("document-date");
  const formattedDate = format(date);

  console.log("date formatted");
  console.log(formattedDate);

  dateCell.innerHTML = formattedDate;
};

// dateOne("2023-02-21T07:28:50.664Z");

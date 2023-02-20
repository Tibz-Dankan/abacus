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

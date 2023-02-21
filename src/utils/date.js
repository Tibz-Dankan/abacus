const format = (date) => {
  // const time = date.toLocaleTimeString("en-Us", {
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: true,
  // });
  const day = date.toLocaleDateString();

  return `${day}`;
};

const dateOne = (dateStr) => {
  const date = new Date(dateStr);
  const formattedDate = format(date);

  return formattedDate;
};

const oneSecMillSec = 1000;
const oneMinMillSec = 1000 * 60;
const oneHourMillSec = 1000 * 60 * 60;
const oneDayMillSec = 1000 * 60 * 60 * 24;
const oneWeekMillSec = 1000 * 60 * 60 * 24 * 7;
const oneMonthMillSec = 1000 * 60 * 60 * 24 * 30;
const oneYearMillSec = 1000 * 60 * 60 * 24 * 365;

const seconds = (millSecs) => {
  const secs = millSecs / oneSecMillSec;
  return Math.floor(secs);
};

const minutes = (millSecs) => {
  const mins = millSecs / oneMinMillSec;
  return Math.floor(mins);
};

const hours = (millSecs) => {
  const hrs = millSecs / oneHourMillSec;
  return Math.floor(hrs);
};

const weeks = (millSecs) => {
  const wks = millSecs / oneWeekMillSec;
  return Math.floor(wks);
};

const months = (millSecs) => {
  const mths = millSecs / oneMonthMillSec;
  return Math.floor(mths);
};

const years = (millSecs) => {
  const yrs = millSecs / oneYearMillSec;
  return Math.floor(yrs);
};

const elapsedTime = (dateStr) => {
  const candidateDateMillSec = new Date(dateStr).getTime();
  const currentDateMillSec = new Date(Date.now()).getTime();

  const millSecDiff = currentDateMillSec - candidateDateMillSec;

  if (millSecDiff < oneMinMillSec) {
    if (seconds(millSecDiff) === 1) return "a second ago";
    return `${seconds(millSecDiff)} seconds ago`;
  }

  if (millSecDiff < oneHourMillSec) {
    if (minutes(millSecDiff) === 1) return "a minute ago";
    return `${minutes(millSecDiff)} minutes ago`;
  }

  if (millSecDiff < oneDayMillSec) {
    if (hours(millSecDiff) === 1) return "an hour ago";
    return `${hours(millSecDiff)} hours ago`;
  }

  if (millSecDiff < oneWeekMillSec) {
    if (days(millSecDiff) === 1) return "a day ago";
    return `${days(millSecDiff)} days ago`;
  }

  if (millSecDiff < oneMonthMillSec) {
    if (weeks(millSecDiff) === 1) return "a week ago";
    return `${weeks(millSecDiff)} weeks`;
  }

  if (millSecDiff < oneYearMillSec) {
    if (months(millSecDiff) === 1) return "a month ago";
    return `${months(millSecDiff)} months`;
  }

  if (millSecDiff >= oneYearMillSec) {
    if (years(millSecDiff) === 1) return "a year ago";
    return `${years(millSecDiff)} years`;
  }
};

module.exports = { dateOne, elapsedTime };

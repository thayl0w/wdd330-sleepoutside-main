import { loadHeaderFooter } from "./utils.mjs";

// get form info
const currentUrl = window.location.href;
const everything = currentUrl.split("?");
const formData = everything[1].split("&");
const p = document.querySelector("#thankyou-string");

p.innerHTML = `Thank you for joining our newsletter, ${capitalize(show("fname"))} ${capitalize(show("lname"))}. <br> An email will be sent to ${show("email")}.`;

function show(info) {
  let result = "";
  formData.forEach((item) => {
    if (item.startsWith(info)) {
      result = item.split("=")[1].replace("%40", "@");
    }
  });
  return result;
}

function capitalize(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

loadHeaderFooter();

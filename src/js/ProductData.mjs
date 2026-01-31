// // const baseURL = import.meta.env.VITE_SERVER_URL
// const baseURL = "https://wdd330-backend.onrender.com/"

async function convertToJson(res) {
    const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

// function convertToJson(res) {
//   if (res.ok) {
//     return res.json();
//   } else {
//     throw new Error("Bad Response");
//   }
// }


// export default class ProductData {
//   constructor() {
//   }
//   async getData(category) {
//     const response = await fetch(`${baseURL}products/search/${category}`);
//     const data = await convertToJson(response);
//     return data.Result;
//   }
//   async findProductById(id) {
//     const response = await fetch(`${baseURL}product/${id}`);
//     const data = await convertToJson(response);
//     console.log(data.Result);
//     return data.Result;  }
// }

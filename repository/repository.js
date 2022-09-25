import fetch from "node-fetch";

export const getDistancia = async (address) => {
  const response = await fetch(
    "https://chatbot-location-api.herokuapp.com/location?address=" + address
  );
  const data = await response.json();
  return data;
};


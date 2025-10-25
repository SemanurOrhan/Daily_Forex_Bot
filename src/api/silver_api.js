const axios = require("axios");
const config = require("../config");

async function getSilver() {
  try {
    const res = await axios.get(
      "https://api.collectapi.com/economy/silverPrice",
      {
        headers: {
          authorization: config.COLLECT_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    if (!res.data.success) {
      throw new Error("API başarısız yanıt döndü");
    }

    return res.data.result;
  } catch (error) {
    console.error("Gümüş fiyatı hatası:", error.message);
    if (error.response) {
      console.error("API Yanıtı:", error.response.data);
    }
    throw error;
  }
}

module.exports = { getSilver };

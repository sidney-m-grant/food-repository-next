const cheerio = require("cheerio");
const axios = require("axios");

export default async (req, res) => {
  if (req.method === "POST") {
    const url = req.body.url;
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const metaData = $('script[type="application/ld+json"]').text();
      res.status(200).json(metaData);
    } catch (e) {
      res.statusCode = 404;
      return res.json({
        error: "metaData not found",
      });
    }
  }
};

const express = require('express');

const emojis = require('./emojis');
const faq = require("./faq");
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/faq', faq)
module.exports = router;

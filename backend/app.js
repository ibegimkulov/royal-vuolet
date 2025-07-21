const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Замените на свой токен и chat_id
const TELEGRAM_TOKEN = '7893139984:AAGcgbmlJdyh9s1NWkta3aNwY0srkjPyz2A';
const CHAT_ID = '2019801953';

app.post('/api/order', async (req, res) => {
  const { items, total } = req.body;
  let text = '🛒 Новый заказ:\n';
  items.forEach((item, i) => {
    text += `${i+1}) ${item.name} — ${item.price} x ${item.quantity}\n`;
  });
  text += `\nИтого: ${total}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML'
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(3001, () => console.log('Backend started on port 3001')); 
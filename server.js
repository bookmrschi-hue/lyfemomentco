require('dotenv').config();
const express = require('express');
const { Client, Environment } = require('square');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
});

app.post('/api/create-payment', async (req, res) => {
  const { sourceId, amount, orderDetails } = req.body;

  if (!sourceId || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid payment data.' });
  }

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(Math.round(parseFloat(amount) * 100)),
        currency: 'USD',
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      note: `Lyfe Moment Co. — ${orderDetails.name} — ${(orderDetails.products || []).join(', ')}`,
    });

    res.json({ success: true, paymentId: response.result.payment.id });
  } catch (error) {
    console.error('Square payment error:', error);
    const msg =
      (error.errors && error.errors[0] && error.errors[0].detail) ||
      error.message ||
      'Payment failed.';
    res.status(400).json({ success: false, error: msg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lyfe Moment Co. server running on http://localhost:${PORT}`));

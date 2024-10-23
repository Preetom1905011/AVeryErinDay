const axios = require('axios');
const express = require('express')
const moment = require('moment-timezone');

const router = express.Router()

// Function to send a text message via TextBelt
const sendTextMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post('https://textbelt.com/text', {
      phone: phoneNumber,
      message: message,
      key: 'textbelt' // Free version
    });

    if (response.data.success) {
      console.log('Message sent successfully!');
    } else {
      console.log('Failed to send message:', response.data);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Function to check if today is the scheduled date
const checkAndSendMessage = async (req, res) => {
    
  // Compare dates
  const scheduledDate = moment.tz('2024-10-22', 'America/New_York').startOf('day'); // Schedule date in ET
  const currentDate = moment.tz('America/New_York').startOf('day'); // Current date in ET

  console.log(">>>", scheduledDate);
  console.log(">>//>", currentDate);

  // Compare dates (both are truncated to the start of the day)
  if (currentDate.isSame(scheduledDate)) {
    const phoneNumber = '+14806192328'; // Phone number you want to send to
    const message = 'This is your scheduled message!, Testing for Webapp';

    const result = await sendTextMessage(phoneNumber, message);
    if (result && result.success) {
      res.status(200).json({ message: 'Message sent successfully!' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } else {
    console.log('Today is not the scheduled date.');
    res.status(200).json({ message: 'Today is not the scheduled date.' });
  }
};


router.get('/', checkAndSendMessage)

module.exports = router
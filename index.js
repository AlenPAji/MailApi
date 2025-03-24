const express = require('express');
const cors = require('cors');

const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail', // Change to your email service
    auth: {
      user: process.env.mail, // Your email
      pass: process.env.mail_pas // Your email password or app password
    }
  });

const port = process.env.PORT || 3000;

// Home Route
app.post('/send-alert', async(req, res) => {
    try {
        const { emails, latitude, longitude, username } = req.body;
        
        console.log('Alert initiated by:', username);
        console.log('Recipients:', emails);
        console.log('Location:', latitude, longitude);
        
        // Create Google Maps link
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // Send a single email with all recipients
        const mailOptions = {
          from: '"Safe Ride Alert System" <alerts@saferide.com>',
          to: emails.join(','), // Join all email addresses with commas
          subject: '🚨 ALERT: Accident Reported on Safe Ride',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #d9534f;">⚠️ Accident Alert</h1>
              </div>
              
              <p>Dear Safe Ride User,</p>
              
              <p>An accident has been reported by user <strong>${username}</strong>.</p>
              
              <h3>Location Details:</h3>
              <p>
                <strong>Latitude:</strong> ${latitude}<br>
                <strong>Longitude:</strong> ${longitude}
              </p>
              
              <p>
                <a href="${locationLink}" style="background-color: #5cb85c; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
                  View on Map
                </a>
              </p>
              
              <p>Please take appropriate action immediately.</p>
              
              <p>This is an automated message from the Safe Ride Alert System. Please do not reply to this email.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
                <p>Safe Ride - Keeping our community safe together</p>
              </div>
            </div>
          `
        };
        
        // Send the email
        await transporter.sendMail(mailOptions);
        
        res.json({ 
          success: true, 
          message: `Alert successfully sent to ${emails.length} recipients`
        });
      } catch (error) {
        console.error('Error sending alert email:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send alert email',
          error: error.message
        });
      }

});


app.post('/send-support', async(req, res) => {
  try {
      const { name, email, phoneNumber, problemDescription } = req.body;
      
      console.log('Support request from:', name);
      console.log('Contact:', email, phoneNumber);
      
      const mailOptions = {
        from: '"Safe Ride Support System" <support@saferide.com>',
        to: 'jintujoseph03@gmail.com',
        subject: '📝 New Support Request - Safe Ride',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #007bff;">New Support Request</h1>
            </div>
            
            <h3>User Details:</h3>
            <p>
              <strong>Name:</strong> ${name}<br>
              <strong>Email:</strong> ${email}<br>
              <strong>Phone Number:</strong> ${phoneNumber}
            </p>
            
            <h3>Problem Description:</h3>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
              ${problemDescription}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
              <p>Safe Ride - Support System</p>
            </div>
          </div>
        `
      };
      
      // Send the email
      await transporter.sendMail(mailOptions);
      
      res.json({ 
        success: true, 
        message: 'Support request sent successfully'
      });
    } catch (error) {
      console.error('Error sending support email:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send support email',
        error: error.message
      });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

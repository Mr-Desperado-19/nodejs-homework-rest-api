const User = require('../models/user');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const generateUniqueVerificationToken = () => {
  return uuidv4();
};

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_API_USER,
      pass: process.env.SENDGRID_API_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'mr.arturhlebov@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Please follow the link to verify your email: /users/verify/${verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const verificationToken = generateUniqueVerificationToken();

    const user = new User({ email, password, verificationToken });

    // Миттєва відправка листа з посиланням на верифікацію
    await sendVerificationEmail(email, verificationToken);

    // Збереження користувача в базі даних, включаючи verificationToken
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      return res.status(400).json({ message: 'Error: missing verification token' });
    }

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User with this verification token not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'User has already been verified' });
    }

    // Встановення поля 'verify' в 'true' і 'verificationToken' в 'null'
    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Error: missing required field email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User with this email not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'User has already been verified' });
    }

    // Відправлення листа для верифікації email користувача
    await sendVerificationEmail(email, user.verificationToken);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
};

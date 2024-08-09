const User = require('../models/Users');

const createUser = async (req, res) => {
    const userData = req.body;

    try {
        // Validate input fields
        if (!userData.username || userData.username.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }
        if (!userData.email || userData.email.trim() === '') {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!userData.password || userData.password.trim() === '') {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Check if the email already exists
        const userAvailable = await User.findOne({ email: userData.email });
        if (userAvailable) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Create a new user
        const newUser = new User(userData);

        // Save the new user to the database
        const registeredUser = await newUser.save();
        res.status(200).json({ message: 'User registered successfully!', registeredUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};


module.exports = {
    createUser,
};

import bcrypt from 'bcryptjs'; //Encrypt the users password using #...
import jwt from 'jsonwebtoken'; //stores user in a browser for certain period of time

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const existingUser = await User.findOne({ email }).select("+password");

        if(!existingUser) return res.status(404).json({ message: 'User does not exist' })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); //compares the hash 

        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid Credentials!" });

        //the jwt takes in 3 parameters [ data stored, test and duration of data stored ]
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id}, 'test', {expiresIn: "1h"}); 

        res.status(200).json({ result: existingUser, token});
    }catch(error){
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword} = req.body;

    try{
        const existingUser = await User.findOne({ email })

        if(existingUser) return res.status(400).json({ message: "User already exists"})

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match"})

        const hashedPassword = await bcrypt.hash(password, 12) //second parameter is called {salt}... it reps the level of difficulty we want to hash the password
        
        const result = await User.create({ email, password: hashedPassword, name:`${firstName} ${lastName}`});

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'} );

        res.status(200).json( { result, token });

    }catch(error){
        res.status(500).json({ message: 'Something was wrong '})
    }
}
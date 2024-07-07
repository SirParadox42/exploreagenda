const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    const {username, email, password} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({message: errors.array().map(error => error.msg)});
    }

    try {
        const existingEmail = await User.findOne({email});
        const existingName = await User.findOne({username});

        if (existingEmail || existingName) {
            return res.status(401).json({message: 'User already exists.'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({username, email, password: hashedPassword, lists: []});
        await user.save();
        const token = jwt.sign({userId: user.id}, process.env.JWT_KEY);
        return res.status(201).json({token, userId: user.id});
    } catch(err) {
        return res.status(500).json({message: 'Signup failed.'});
    }
};

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        const isValid = await bcrypt.compare(password, user.password);

        if (!user || !isValid) {
            return res.status(401).json({message: 'Invalid email or password.'});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_KEY);
        return res.status(200).json({token, userId: user.id});
    } catch(err) {
        return res.status(500).json({message: 'Login failed.'});
    }
};

exports.getLists = async(req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const lists = user.lists;
        return res.status(200).json({lists: lists.map(list => list.toObject({getters: true}))});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
};

exports.getListById = async(req, res, next) => {
    const listId = req.params.listId;

    try {
        const user = await User.findById(req.userId);
        const list = user.lists.find(list => list.id.toString() === listId.toString());
        return res.status(200).json({list: list.toObject({getters: true})});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
};

exports.createList = async(req, res, next) => {
    const {location, activities} = req.body;

    try {
        const user = await User.findById(req.userId);
        user.lists = [...user.lists, {location, activities}];
        await user.save();
        return res.status(200).json({message: 'Activity list created.'});
    } catch(err) {
        return res.status(500).json({message: 'Creating activity list failed.'});
    }
};

exports.updateList = async(req, res, next) => {
    const listId = req.params.listId;
    const {activities} = req.body;

    try {
        const user = await User.findById(req.userId);
        user.lists = user.lists.map(list => list.id === listId ? {...list, activities} : list);
        await user.save();
        return res.status(200).json({message: 'Activity list updated.'});
    } catch(err) {
        return res.status(500).json({message: 'Updating activity list failed.'});
    }
};

exports.deleteList = async(req, res, next) => {
    const listId = req.params.listId;

    try {
        const user = await User.findById(req.userId);
        user.lists = user.lists.filter(list => list.id.toString() !== listId.toString());
        await user.save();
        return res.status(200).json({message: 'Activity list deleted.'});
    } catch(err) {
        return res.status(500).json({message: 'Deleting activity list failed.'})
    }
};
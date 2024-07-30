/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import path from 'path';
import {
    generateAccessToken,
    generateRefreshToken,
    handleResponse,
} from '../utils/common.js';
import { User } from '../models/userModel.js';
import logger from '../utils/logger.js';
import { Session } from '../models/sessionModel.js';

const filename = path.basename(import.meta.url);
const loggerInstance = logger(filename);

/**
 * @description login using email and password
 * @method POST
 * @path /user/login
 * @param {*} req
 * @param {*} res
 * @returns
 */
const userLogin = async (req, res) => {
    try {
        const loginData = req.body;
        const existingUser = await User.findOne({ email: loginData.email });

        if (!existingUser) {
            return res.status(401).send(handleResponse('', false, 401, 'Invalid email or password'));
        }

        const validPassword = bcrypt.compareSync(loginData.password, existingUser.password);
        if (validPassword === false) {
            return res.status(401).send(handleResponse('', false, 401, 'Invalid email or password'));
        }
        
        const accessToken = generateAccessToken({ ID: existingUser._id, email: existingUser.email });
        const refreshToken = generateRefreshToken({ ID: existingUser._id });

        const checkSession = await Session.findOne({ ID: existingUser._id });
        if (checkSession == null) {
            // Save refresh token in the database
            await Session.create({ ID: existingUser._id, refreshToken, accessToken });
        } else {
            await Session.updateOne({ ID: existingUser._id }, { refreshToken, accessToken });
        }

        return res.status(200).send(
            handleResponse(
                {
                    accessToken,
                    refreshToken,
                    profileData: {
                        _id: existingUser._id,
                        email: existingUser?.email,
                        firstName: existingUser?.firstName ?? null,
                        lastName: existingUser?.lastName ?? null,
                    }
                },
                true,
                200
            )
        );
    } catch (error) {
        loggerInstance.error(`Error in user login: ${error.message}`);
        return res.status(500).send(handleResponse('', false, 500, 'Internal Server Error'));
    }
};

/**
 * @description sign up using user data
 * @method POST
 * @path /user/sign-up
 * @param {*} req
 * @param {*} res
 * @returns
 */
const userSignUp = async (req, res) => {
    try {
        const signUpData = req.body;
        const existingUser = await User.findOne({ $or: [{email: signUpData.email}, {$and: [{firstName: signUpData.firstName}]}] });

        if (existingUser) {
            return res.status(401).send(handleResponse('', false, 409, 'user already exists'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(signUpData.password, salt);
        signUpData.password = hashedPassword;

        const newUser = await User.create(signUpData);

        if(!newUser){
            return res.status(500).send(handleResponse('', false, 500, 'user not created'));
        }
        
        const accessToken = generateAccessToken({ ID: newUser._id, email: newUser.email });
        const refreshToken = generateRefreshToken({ ID: newUser._id });
        await Session.create({ ID: newUser._id, refreshToken, accessToken });

        return res.status(200).send(
            handleResponse(
                {
                    accessToken,
                    refreshToken,
                    profileData: {
                        _id: newUser._id,
                        email: newUser?.email,
                        firstName: newUser?.firstName ?? null,
                        lastName: newUser?.lastName ?? null,
                    }
                },
                true,
                200
            )
        );
    } catch (error) {
        loggerInstance.error(`Error in user sign up: ${error.message}`);
        return res.status(500).send(handleResponse('', false, 500, 'Internal Server Error'));
    }
};

export {
    userLogin,
    userSignUp
}
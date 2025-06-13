import Otp from '../models/otp.model.js';
import User from '../models/user.model.js';
//import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { Resend } from "resend";
dotenv.config();
/*
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
*/

const resend =new Resend(process.env.RESEND_API_KEY);

export const sendOtp = async (req, res) => {
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
    const { deliveryId, customerId } = req.body;
    const driverId = req.user._id;

    if (!deliveryId || !customerId) {
        return res.status(400).json({ 
            success: false,
            message: 'Delivery ID and Customer ID are required' 
        });
    }

    try {
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ 
                success: false,
                message: 'Customer not found' 
            });
        }

        // Check if customer has an email
        if (!customer.email) {
            return res.status(400).json({
                success: false,
                message: 'Customer email not found'
            });
        }

        const driver = await User.findById(driverId);
        if (!driver) {
            return res.status(404).json({ 
                success: false,
                message: 'Driver not found' 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const otpDoc = new Otp({
            deliveryId,
            customerId,
            otp,
            driverId: driverId.toString()
        });

        await otpDoc.save();

        let data, error;
        try {
            const response = await resend.emails.send({
                from: "onboarding@resend.dev",
                to: customer.email, // Use customer's actual email
                subject: "OTP Code for Delivery",
                html: "<p>Your OTP code for the delivery is <strong>" + otp + "</strong>.</p><p>Please use this code to confirm your delivery.</p>",
            });
            data = response.data || response;
            error = null;

        } catch (sendError) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email',
                error: process.env.NODE_ENV === 'development' ? sendError.message : undefined
            });
        }

        /*

        const msg = {
            to: customer.email, // Use customer's actual email
            from: process.env.SENDGRID_VERIFIED_SENDER, // Should be a verified sender
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: `<strong>Your OTP code is ${otp}</strong>`,
            mailSettings: {
                sandboxMode: {
                    enable: false  // Ensure this is false in production
                }
            }
        };

        const msgSent = await sgMail.send(msg);

        console.log('SendGrid response:', msgSent);
        console.log(msgSent[0].statusCode, msgSent[0].headers);
        console.log('OTP email sent successfully to:', customer.email);

        */

        return res.status(200).json({ 
            success: true,
            message: 'OTP generated and sent successfully',
        });

    } catch (error) {
        console.error('Error in sendOtp:', error);
        
        // More detailed error logging
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }

        return res.status(500).json({ 
            success: false,
            message: 'Failed to send OTP email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const verifyOtp = async (req, res) => {
    const { deliveryId, otp } = req.body;

    // Validate required fields
    if (!deliveryId || !otp) {
        return res.status(400).json({ 
            success: false,
            message: 'Delivery ID and OTP are required' 
        });
    }

    try {
        // Find OTP record
        const otpDoc = await Otp.findOne({ 
            deliveryId, 
            otp 
        });

        if (!otpDoc) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid OTP or delivery ID' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'OTP verified successfully',
        });

    } catch (error) {
        console.error('Error in verifyOtp:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
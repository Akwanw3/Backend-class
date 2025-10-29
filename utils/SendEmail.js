const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 🔑 FIX 1: Ensure port is a Number and secure is a Boolean.
    const isSecure = process.env.MAIL_SECURE === 'true'; 

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        
        // 🔑 FIX 2: Convert the string port to a Number
        port: parseInt(process.env.MAIL_PORT, 10), 
        
        // 🔑 FIX 3: Use the correctly cast boolean value
        secure: isSecure, 
        
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        
        // 🔑 FIX 4: Explicitly enforce modern TLS protocols (resolves the "wrong version number" error)
        tls: {
            minVersion: 'TLSv1.2',
        }
    });

    const message = {
        from: `Test <developer@appname.io>`,
        to: options.to, // FIX: Changed from options.email to options.to
        subject: options.subject,
        html: options.html,
        text: options.text,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        return info; // Return info for potential use
        
    } catch (error) {
        console.error("Error sending email:", error);
        // Throw a specific error or handle it as needed
        throw new Error("Email sending failed: " + error.message);
    }
};

module.exports = sendEmail;
const { authenticator, totp } = require("otplib");
const base32 = require("base32");

totp.options = {
	algorithm: "sha1",
	encoding: "ascii",
	digits: 6,
	epoch: Date.now(),
	step: 300,
	window: 300,
};

const generateSecret = () => authenticator.generateSecret();

const generateOTP = (verificationKey: string) => totp.generate(verificationKey);

const verifyOTP = (otp: string, verificationKey: string) =>
	totp.check(otp, verificationKey);

const generateBase32 = (id: string | number) =>
	base32.encode(id?.toString?.() || id);

module.exports = {
	generateSecret,
	generateBase32,
	generateOTP,
	verifyOTP,
};

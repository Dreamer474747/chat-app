import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";



const hashPassword = async (password) => {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
	const isValid = await compare(password, hashedPassword);
	return isValid;
};

const createAccessToken = (data) => {
  const token = sign({ ...data }, process.env.AccessTokenSecretKey, {
    expiresIn: "100d",
  });
  return token;
};

const verifyAccessToken = (token) => {
	try {
		const tokenPayload = verify(token, process.env.AccessTokenSecretKey);
		return tokenPayload;
		
	} catch(err) {
		return false;
	}
}



const createRefreshToken = (data) => {
  const token = sign({ ...data }, process.env.RefreshTokenSecretKey, {
    expiresIn: "15d",
  });
  return token;
};

const createNonRememberedRT = (data) => {
  const token = sign({ ...data }, process.env.RefreshTokenSecretKey, {
    expiresIn: "20m",
  });
  return token;
};


const verifyRefreshToken = (token) => {
	try {
		const tokenPayload = verify(token, process.env.RefreshTokenSecretKey);
		return tokenPayload;
		
	} catch(err) {
		console.log("verify refresh Token err:", err);
		return false;
	}
}


export {
	hashPassword,
	verifyPassword,
	createAccessToken,
	verifyAccessToken,
	createRefreshToken,
	createNonRememberedRT,
	verifyRefreshToken,
};
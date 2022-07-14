import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
//const { HOST, PORT_PROVIDERS } = dotenv;

const dot = config();

const createToken = (id: number, email: string): string => {
	const token: string = sign({ id, email }, process.env.SECRET!, { expiresIn: '4h' });
	return token;
};

export default createToken;

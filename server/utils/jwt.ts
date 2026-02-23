import jwt from 'jsonwebtoken';

export const getLoginToken = async ({userId}:{userId:any}) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1w' });
  return token;
}
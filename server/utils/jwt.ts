import jwt from 'jsonwebtoken';

export const getLoginToken = async ({userId}:{userId:any}) => {
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1w' });
  return token;
}

export const verifyToken = async (token:string) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    console.error(`VerifyToken ${token} error: `, err);
    return false;
  }
}
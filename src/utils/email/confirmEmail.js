import getUserId from '../getUserId';
import User from '../../models/user';

const clientUrl = process.env.CLIENT_HOST || 'http://localhost:8080';

const confirmEmail = async (req, res) => {
  try {
    const userId = await getUserId(req.query.token, process.env.CONFIRMATION_SECRET);
    const user = await User.findById(userId);

    if (user && user.status === 'PENDING') {
      await User.findOneAndUpdate({
        _id: userId,
      },
      {
        $set: {
          status: 'VERIFIED',
        },
      });
      res.redirect(`${clientUrl}/complete-signup?email=${user.email}`);
      console.log(`Email confirmed for ${user.email}.`);
    } else {
      res.redirect(`${clientUrl}/complete-signup?email=${user.email}`);
      console.log(`Email already confirmed for ${user.email}.`);
    }
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      res.send(`${e.name} - ${e.message} at ${e.expiredAt}`);
    } else {
      res.send(`ERROR!!\n${e}`);
    }
  }
};

export default confirmEmail;

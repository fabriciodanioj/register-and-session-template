import User from '../../models/User';

class ListUsersController {
  async show(req, res) {
    await User.find({}, (err, users) => {
      if (err) {
        res.send('Something went really wrong!!!');
      }
      return res.json(users).status(200);
    });
  }
}

export default new ListUsersController();

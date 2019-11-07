class ExampleController {
  async show(req, res) {
    return res.send({ msg: 'Hello World' });
  }
}

export default new ExampleController();

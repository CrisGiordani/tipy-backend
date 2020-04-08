import User from "../models/User";

class AvatarController {
  async store(req, res) {
    const { filename: path } = req.file;

    const user = await User.findByPk(req.userId);
    user.avatar = path;
    user.save();

    return res
      .status(200)
      .send({ error: "Imagem enviada com sucesso!", avatar: path });
  }
}

export default new AvatarController();

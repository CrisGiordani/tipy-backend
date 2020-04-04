import User from "../models/User";
import { Op } from "sequelize";

class PerformerController {
  async index(req, res) {
    if (req.body.performer) {
      const performer = await User.findOne({
        attributes: ["id", "name", "description", "avatar"],
        where: {
          performer: { [Op.eq]: req.body.performer },
        },
      });
      if (!performer) {
        return res.status(400).json({
          error: "Artista não encontrado!",
        });
      }
      return res.json(performer);
    } else {
      const performers = await User.findAll({
        attributes: ["id", "name", "description", "avatar"],
        where: {
          performer: { [Op.not]: "0" },
        },
      });
      return res.json(performers);
    }
  }
}

export default new PerformerController();

import { Op } from "sequelize";

import User from "../models/User";
import Notification from "../models/Notification";

class NotificationController {
  async store(req, res) {
    await Notification.create(req.body);
    return res.status(200).send();
  }

  async update(req, res) {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (notification) {
      req.body.read = true;
      await notification.update(req.body);
      return res.status(200).send();
    } else {
      return res.status(400).send({ error: "Notificação inexistente" });
    }
  }

  async index(req, res) {
    const notifications = await Notification.findAll({
      attributes: ["id", "message", "read", "created_at"],
      where: {
        id_user: { [Op.eq]: req.params.id },
      },
    });
    if (!notifications) {
      return res.status(400).send({ error: "Nenhuma notificação" });
    }
    return res.json(notifications);
  }
}

export default new NotificationController();

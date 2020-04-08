import * as Yup from "yup";
import crypto from "crypto";

import User from "../models/User";

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).send({ error: "Este e-mail já está cadastrado" });
    }

    const mobile = req.body.mobile.replace(/\D/g, "");
    req.body.mobile = mobile;

    if (req.body.performer) {
      req.body.performer = crypto.randomBytes(4).toString("HEX");
    }
    const { id, name, email } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      mobile,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res
          .status(400)
          .send({ error: "Este e-mail já está cadastrado" });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).send({ error: "Senha incorreta" });
    }

    const { avatar } = user;
    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async index(req, res) {
    if (req.params.id > 0) {
      const user = await User.findByPk(req.params.id, {
        attributes: [
          "id",
          "name",
          "email",
          "mobile",
          "description",
          "performer",
          "avatar",
        ],
      });
      if (!user) {
        return res.status(400).send({ error: "Usuário não encontrado" });
      }
      return res.json(user);
    } else {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "mobile", "performer", "avatar"],
      });
      return res.json(users);
    }
  }
}

export default new UserController();

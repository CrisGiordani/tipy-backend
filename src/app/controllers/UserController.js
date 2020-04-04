import * as Yup from "yup";
import crypto from "crypto";

import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      mobile: Yup.string(),
      performer: Yup.boolean(),
      password: Yup.string().required().min(3),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Verifique os dados digitados" });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }
    if (req.body.performer) {
      req.body.performer = crypto.randomBytes(4).toString("HEX");
    }
    const { id, name, email } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      mobile: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(4)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Verifique os dados digitados" });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res
          .status(400)
          .json({ error: "Este e-mail já está cadastrado." });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha incorreta." });
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
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(400).json({
          error: "Usuário não encontrado!",
        });
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

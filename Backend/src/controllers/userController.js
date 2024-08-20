import express from 'express';

const User = require("../models/user.model");

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  // }
  const session = await mongoose.startSession();
  session.startTransaction();

  const { name, lastName, dni, email, role } = req.body;

  try {
      // Verificar si el usuario ya existe
      let user = await User.findOne({ dni });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }
      // Verificar si el email ya esta registrado
      const isEmailNotDuplicated = await User.findOne({ email }).exec();
      
      if (isEmailNotDuplicated) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .send({ error: "El correo pertenece a un usuario registrado" });
      }
      const newUser = await new User({
        name,
        lastName,
        dni,
        email,
        role,
      }).save({ session });

      // await user.save();
      // res.status(201).json(user);

      await session.commitTransaction();
      session.endSession();

      res.status(201).send({user: newUser, message: "Usuario creado con éxito" });
  } catch (err) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      res.status(400).send({ error: "Error al crear el usuario" });
  }
};
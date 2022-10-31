import { Users } from "../model/user.model.cjs";

export const getAllUsers = async () => {
  const users = await Users.findAll();
  return users.map((user) => user.toJSON());
};

export const getUserByEmail = async (email) => {
  const user = await Users.findAll({
    where: {
      email: email,
    },
  });
  return user.map((user) => user.toJSON());
};

export const createUser = async (user) => {
  const userCreated = await Users.create(user);
  return userCreated._modelOptions.instance.toJSON();
};

export const updateUser = async (user) => {
  const userUpdated = await Users.update(user, {
    where: {
      user_id: user.user_id,
    },
  });
  return userUpdated[0];
};

export const deleteUser = async (id) => {
  const userDeleted = await Users.destroy({
    where: {
      user_id: id,
    },
  });
  return userDeleted;
};

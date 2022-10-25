import { Cliente } from "../services/cliente.model.cjs";

export const getAllClientes = async () => {
  const clientes = await Cliente.findAll();
  return clientes.map((cliente) => cliente.toJSON());
};

export const getClienteByPhoneNumber = async (telefone) => {
  const cliente = await Cliente.findAll({
    where: {
      telefone: telefone,
    },
  });
  return cliente.map((produto) => produto.toJSON());
};

export const getClienteByNome = async (nome) => {
  const cliente = await Cliente.findAll({
    where: {
      nome: nome,
    },
  });
  return cliente.map((produto) => produto.toJSON());
};

export const getClienteById = async (id) => {
  const cliente = await Cliente.findAll({
    where: {
      cliente_id: id,
    },
  });
  return cliente.map((produto) => produto.toJSON());
};

export const getClienteByCpf = async (cpf) => {
  const cliente = await Cliente.findAll({
    where: {
      cpf: cpf,
    },
  });
  return cliente.map((produto) => produto.toJSON());
};

export const createCliente = async (cliente) => {
  const clienteCreated = await Cliente.create(cliente);
  //return clienteCreated._modelOptions.instance.toJSON();
  return;
};

export const updateCliente = async (cliente, cpf) => {
  const clienteUpdated = await Cliente.update(cliente, {
    where: {
      cpf: cpf,
    },
  });
  return clienteUpdated;
};

export const deleteCliente = async (telefone) => {
  const clienteDeleted = await Cliente.destroy({
    where: {
      telefone: telefone,
    },
  });
  return clienteDeleted;
};

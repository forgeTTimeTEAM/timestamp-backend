### Leia-me

# você precisará criar um banco de dados postgres e colocar no arquivo .env a URL, caso tenha dúvida olhe o arquivo deixado na raiz do projeto chamado .env.test, depois rode o comando a baixo.

`yarn prisma migrate dev` este comando irá rodar as migrations do banco de dados, para que você possa utiliza-lô

## Rota de Users

# POST /users

Rota responsável por criar um usuário, deve ser enviado no corpo da requisição os seguintes campos: {
  name,
  email,
  password,
  groupId (propriedade opcional, caso não seja passada, será automaticamente enviada com valor null)
}


### All rights reserved.

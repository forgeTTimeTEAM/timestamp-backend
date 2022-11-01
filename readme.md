### Leia-me

# você precisará criar um banco de dados postgres e colocar no arquivo .env a URL, caso tenha dúvida olhe o arquivo deixado na raiz do projeto chamado .env.test, depois rode o comando a baixo.

`yarn prisma migrate dev` este comando irá rodar as migrations do banco de dados, para que você possa utiliza-lô

## Rota de Users

# POST /users

está rota cria usuário, basta enviar os dados a baixo.
`name: string; email: string; password: string; moduleId: string;`
ela retornará somente nome e email

### All rights reserved.

### Leia-me

## Você precisará criar um banco de dados postgres e colocar no arquivo .env a URL, caso tenha dúvida olhe o arquivo deixado na raiz do projeto chamado .env.test, depois rode o comando a baixo.

`yarn prisma migrate dev` este comando irá rodar as migrations do banco de dados, para que você possa utilizá-lo

# Rota de Users

## POST - Create user
### Endpoint: /users

Campos obrigatórios:
| Campo      | Tipo   | Descrição                                       |
| -----------|--------|-------------------------------------------------|
| name       | string | O nome do usuário.                              |
| email      | string | O e-mail do usuário.                            |
| password   | string | A senha de acesso do usuário                    |
| groupId    | string | Define o grupo do usuário.                      |
| moduleId   | string | Define o módulo do usuário.                     |

Body da requisição:
```shell
{  
	"name": "sara test",
	"email": "sara-teste@mail.com",
	"password": "1234",
	"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca",
	"moduleId": "430ec768-812c-4241-adb5-1c1129bb60d7"
}
```
Body da resposta:
```shell
{
	"id": "22322984-3ebc-460d-8321-4ded36eeafa6",
	"name": "sara test",
	"email": "sara-test2@mail.com",
	"role": "STUDENT",
	"createdAt": "2022-11-08T15:23:59.091Z",
	"updatedAt": "2022-11-08T15:23:59.091Z",
	"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca",
	"modules": [
		{
			"id": "21d5d36e-ee74-4514-a0f8-591fc7f5d37e",
			"createdAt": "2022-11-08T15:23:59.091Z",
			"updatedAt": "2022-11-08T15:23:59.091Z",
			"userId": "22322984-3ebc-460d-8321-4ded36eeafa6",
			"moduleId": "430ec768-812c-4241-adb5-1c1129bb60d7"
		}
	]
}
```

Possíveis erros:
| Error    			| Message                                   					|
| ------------------------------|-----------------------------------------------------------------------------|
| You must provide a name       						| should not be able to create a user without name 			|
| Should not be able to create a user without password      			| You must provide a password |
| should not be able to create a user without email  				| You must provide a email    |
| Should not be able to create a user without group id    			| You must provide a group id |
| should not be able to create a user with invalid group id  			| You must provide a module id|
| should not be able to create a user without module id  			| Group not found             |
| should not be able to create a user with invalid module id  			| Module not found            |
| should not be able to create a user with same email  				| Email is already in use     |


### All rights reserved.

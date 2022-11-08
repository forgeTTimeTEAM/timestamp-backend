### Leia-me

## Você precisará criar um banco de dados postgres e colocar no arquivo .env a URL, caso tenha dúvida olhe o arquivo deixado na raiz do projeto chamado .env.test, depois rode o comando a baixo.

`yarn prisma migrate dev` este comando irá rodar as migrations do banco de dados, para que você possa utilizá-lo

# Rota de Users

## POST - Create user
### Endpoint: /users

Rota para criação de usuário (estudante)

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
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------|---------------|
| should not be able to create a user without name       			| You must provide a name	| 400 |
| Should not be able to create a user without password      			| You must provide a password | 400 |
| should not be able to create a user without email  				| You must provide a email    | 400 |
| Should not be able to create a user without group id    			| You must provide a group id | 400 |
| should not be able to create a user without module id  			| Group not found             | 404 |
| should not be able to create a user with invalid group id  			| You must provide a module id| 400 |
| should not be able to create a user with invalid module id  			| Module not found            | 404 |
| should not be able to create a user with same email  				| Email is already in use     | 409 |

## POST - Login user
### Endpoint: /users/login

Rota para login de estudantes, administradores e instrutores

Campos obrigatórios:
| Campo      | Tipo   | Descrição                                       |
| -----------|--------|-------------------------------------------------|
| email      | string | O e-mail do usuário.                            |
| password   | string | A senha de acesso do usuário                    |

Body da requisição:
```shell
{  
	"email": "sara-test@mail.com",
	"password": "1234"
}
```
Body da resposta:
```shell
{
	{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4Yy04NGUyLTQyZDEtYWVmYi0wOTUzMWM1YmE5MzciLCJpYXQiOjE2Njc5MjEwMTEsImV4cCI6MTY2ODAwNzQxMSwic3ViIjoiYTE3Y2I0ZWUtNzUyYS00ODlmLWI1NmMtNGQ0OWQyOWRkYmRjIn0.gUcDapffJXZrmZbYRrcpmAy5zf0zS1AVwkLpiLeT_MI"
}
}
```

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to login with wrong password       			| Wrong email or password	| 403 |
| should be able to return error when logging in without email and password 	| Wrong email or password 	| 403 |



### All rights reserved.

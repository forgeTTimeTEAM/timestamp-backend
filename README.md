### Leia-me

## Você precisará criar um banco de dados postgres e colocar no arquivo .env a URL, caso tenha dúvida olhe o arquivo deixado na raiz do projeto chamado .env.test, depois rode o comando a baixo.

`yarn prisma migrate dev` este comando irá rodar as migrations do banco de dados, para que você possa utilizá-lo

## 1. Visão Geral

Visão geral do projeto, um pouco das tecnologias usadas.

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/pt-BR/)

A URL base da aplicação:
http://suaapi.com/v1

---

## 2. Diagrama ER
[ Voltar para o topo ](#tabela-de-conteúdos)

Diagrama ER da API definindo bem as relações entre as tabelas do banco de dados.

![DER](DER_SP7_01.drawio.png)

---

## 3. Início Rápido
[ Voltar para o topo ](#tabela-de-conteúdos)


### 3.1. Instalando Dependências

Clone o projeto em sua máquina e instale as dependências com o comando:

```shell
yarn
```

### 3.2. Variáveis de Ambiente

Em seguida, crie um arquivo **.env**, copiando o formato do arquivo **.env.example**:
```
env.example .env
```

Configure suas variáveis de ambiente com suas credenciais do Postgres e uma nova database da sua escolha.

### 3.3. Migrations

Execute as migrations com o comando:

```
yarn prisma migrate dev --name init
```

---


## Indice de Rotas
- [Rota de User](#1)


---

## 1. **Rota de Users**

- [POST - create user](#11-POST)
- [POST - Login user](#12-POST)
- [GET - Profile user](#13-GET)
- [GET - List users](#14-GET)
- [GET - List users by id](#15-GET)
- [DELETE - Login user](#16-DELETE)
- [PATCH - Login user](#17-PATCH)

---

## 1.1 **POST**
### Create user
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
| Status Code |
|--------------|
| 201 |

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

---

## 1.2 **POST**
### Login user
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
| Status Code |
|--------------|
| 200 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to login with wrong password       			| Wrong email or password	| 403 |
| should be able to return error when logging in without email and password 	| Wrong email or password 	| 403 |

---

## 1.3 **GET**
### Profile user
### Endpoint: /users/profile

Rota para busca do próprio perfil para proteção de rotas

Campos obrigatórios:
- Sem body na requisição
- Necessário token de autorização

Body da resposta:
```shell
{
	"id": "0e1ee1fd-28ee-4389-85b9-77967cb089ef",
	"name": "sara adm test",
	"email": "saraAdm-teste@mail.com",
	"role": "ADM",
	"createdAt": "2022-11-05T03:10:02.598Z",
	"updatedAt": "2022-11-05T03:27:16.597Z",
	"groupId": null,
	"modules": [],
	"group": null
}
```
| Status Code |
|--------------|
| 200 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to return all user data without token       			| Missing token	| 401 |
| should not be able to return all user data with invalid token 	| Invalid or expired token	| 401 |

---

## 1.4 **GET**
### List users
### Endpoint: /users

Rota para busca de todos os usuários

Campos obrigatórios:
- Sem body na requisição
- Necessário token de autorização
- Necessário ser administrador

Body da resposta:
```shell
[
	{
		"id": "c6f164f0-c4cd-407f-8aba-32208c62cb75",
		"name": "sara test",
		"email": "sara-teste@mail.com",
		"role": "STUDENT",
		"createdAt": "2022-11-05T03:16:50.170Z",
		"updatedAt": "2022-11-05T03:16:50.170Z",
		"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca"
	},
	{
		"id": "0e1ee1fd-28ee-4389-85b9-77967cb089ef",
		"name": "sara adm test",
		"email": "saraAdm-teste@mail.com",
		"role": "ADM",
		"createdAt": "2022-11-05T03:10:02.598Z",
		"updatedAt": "2022-11-05T03:27:16.597Z",
		"groupId": null
	}
]
```
| Status Code |
|--------------|
| 200 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to list all users without token       			| Missing token	| 401 |
| should not be able to list all users with invalid token 	| Invalid or expired token	| 401 |
| should not be able to list all users without adm token 	| Access denied	| 401 |

---

## 1.5 **GET**
### List users by id
### Endpoint: /users/:id

Rota para busca de usuário por id

Campos obrigatórios:
- Sem body na requisição
- Necessário token de autorização
- Necessário ser administrador

Body da resposta:
```shell
{
	"id": "e7e415ae-ff5d-4c2c-9cb2-7e19a8eb0f9a",
	"name": "sara test",
	"email": "sara-teste3@mail.com",
	"role": "STUDENT",
	"createdAt": "2022-11-08T21:36:35.265Z",
	"updatedAt": "2022-11-08T21:36:35.265Z",
	"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca"
}
```
| Status Code |
|--------------|
| 200 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to find a user without token       			| Missing token	| 401 |
| should not be able to find a user with invalid token 	| Invalid or expired token	| 401 |
| should not be able to find a user without adm permission 	| Access denied	| 403 |
| should not be able to find a user with invalid id 	| User not found	| 404 |

---

## 1.6 **DELETE**
### Delete user
### Endpoint: /users/:id

Rota para deleção de usuário por id

Campos obrigatórios:
- Sem body na requisição
- Necessário token de autorização
- Necessário ser administrador
- Sem body na resposta

| Status Code |
|--------------|
| 204 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------	|--------------|
| should not be able to delete a user without token       			| Missing token	| 401 |
| should not be able to delete a user with invalid token 	| Invalid or expired token	| 401 |
| should not be able to delete a user without adm permission 	| Access denied	| 403 |
| should not be able to delete a user with invalid id 	| User not found	| 404 |

---

## 1.7 **PATCH**
### Update user by id
### Endpoint: /users/:id

Rota para atualização da chave groupId de usuário (estudante)

- Necessário token de autorização
- Necessário ser administrador

Campos obrigatórios:
| Campo      | Tipo   | Descrição                                       |
| -----------|--------|-------------------------------------------------|
| groupId    | string | Define o grupo do usuário                      |

Body da requisição:
```shell
{
	"groupId": "7e44ec8c-84e2-42d1-aefb-09531c5ba937"
}
```
Body da resposta:
```shell
{
	"id": "a17cb4ee-752a-489f-b56c-4d49d29ddbdc",
	"name": "sara9",
	"email": "sara-test@mail.com",
	"role": "STUDENT",
	"createdAt": "2022-11-05T00:15:25.632Z",
	"updatedAt": "2022-11-08T21:42:55.051Z",
	"groupId": "7e44ec8c-84e2-42d1-aefb-09531c5ba937"
}
```
| Status Code |
|--------------|
| 200 |

Possíveis erros:
| Error    			| Message                                   					| Status Code |
| ------------------------------|-----------------------------------------------------------------------------|---------------|
| should not be able to update a user by id without token       			| Missing token	| 401 |
| should not be able to update a user by id with the current groupId      		| Provide a different groupId than the current one  | 404 |
| should not be able to update a user by id with invalid groupId  			| Group not exists    | 404 |
| should not be able to update a user by id with invalid id    			| User not exists | 404 |
| should not be able to update a user by id without data in the request body	| Need to provide the data in the request | 400 |
| should not be able to update a user by id without providing the correct key(groupId) in the request	| It is only possible to update the groupId | 400 |
| should not be able to update user by id with invalid token  			| Invalid or expired token | 401 |
| should not be able to update user by id without adm permission		| Email is already in use  | 403 |

### All rights reserved.

<h1 id="tabela-de-conteúdos"> Timestamp API </h1>

<h2>Olá! Seja bem vindo(a) a documentação da <i>API</i>, esta que tem como objetivo o gerenciamento de uma plataforma em que serão hospedados <b>vídeos</b> e seus respectivos <b>marcadores</b>, a aplicação também conta com sistema de <b>usuários</b>, <b>turmas</b>, <b>módulos</b> e <b>sprints</b>, permissão de <b>aluno</b>, <b>instrutor</b>, e <b>administrador</b>.</h2>

</br>

## 1. Visão Geral

_Visão geral do projeto, abaixo as principais tecnologias utilizadas e a url base da API_.

<img src="https://skillicons.dev/icons?i=nodejs,express,typescript,postgres,prisma,jest,heroku" alt="ícones com as tecnologias utilizadas, sendo elas: node, express, typescript, postgresql, prisma, jest, heroku"/>

</br>

_URL base da API:_ **https://backend-timestamp.herokuapp.com/**

---

## **2. _Para dar início ao projeto, siga as instruções abaixo:_**

[ Voltar para o topo ](#tabela-de-conteúdos)

### **2.1 Instalando as dependências do projeto**

_Clone o projeto em sua máquina e instale as dependências do projeto com o seguinte comando:_

```shell
yarn
```

### **2.2 Criando e configurando arquivo com as variáveis de ambiente**

_Em seguida, crie um arquivo_ **.env**, _copiando o formato do arquivo_ **.env.example**:

```
.env
```

_Configure suas variáveis de ambiente com suas credenciais do Postgres do seu banco de dados criado anteriormente._

### **2.3 Migrations**

_Execute as migrations com o seguinte comando:_

```
yarn prisma migrate dev
```

---

## **Índice com todas as rotas do projeto**

-   [/users](#1---users)
-   [/groups](#2---groups)
-   [/modules](#3---modules)
-   [/videos](#4---videos)
-   [/markers](#5---markers)

---

## **1 - _Users_**

-   [POST - Criar usuário](#11-POST)
-   [POST - Fazer login](#12-POST)
-   [GET - Mostrar todos os dados do usuário](#13-GET)
-   [GET - Listar todos os usuários](#14-GET)
-   [GET - Mostrar um usuário a partir do id](#15-GET)
-   [DELETE - Deletar usuário](#16-DELETE)
-   [PATCH - Atualizar usuário](#17-PATCH)

---

## **1.1 - _POST_**

</br>

### **Criação de usuário**

</br>

### **Endpoint: _/users_**

</br>

_Rota responsável por criar um usuário, por padrão, o usuário criado será um estudante_

</br>

**Campos obrigatórios:**

</br>

| Campo    | Tipo   | Descrição                    |
| -------- | ------ | ---------------------------- |
| name     | string | O nome do usuário.           |
| email    | string | O email do usuário.          |
| password | string | A senha de acesso do usuário |
| groupId  | string | O grupo do usuário.          |
| moduleId | string | O módulo do usuário.         |

</br>

**Exemplo de requisição de criação de usuário válida, corpo da requisição:**

```shell
{
	"name": "Sara Lins",
	"email": "saralins@email.com",
	"password": "sara#321",
	"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca",
	"moduleId": "430ec768-812c-4241-adb5-1c1129bb60d7"
}
```

</br>

**Retorno da requisição:**

```shell
{
	"id": "22322984-3ebc-460d-8321-4ded36eeafa6",
	"name": "Sara Lins",
	"email": "saralins@email.com",
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

| **Status Code** |
| --------------- |
| _201_           |

**Possíveis erros:**

| _Erro_                                                   | _Mensagem_                   | _Status Code_ |
| -------------------------------------------------------- | ---------------------------- | ------------- |
| Tentativa de criar um usuário sem nome                   | You must provide a name      | 400           |
| Tentativa de criar um usuário sem email                  | You must provide a email     | 400           |
| Tentativa de criar um usuário sem senha                  | You must provide a password  | 400           |
| Tentativa de criar um usuário sem groupId                | You must provide a group id  | 400           |
| Tentativa de criar um usuário sem moduleId               | You must provide a module id | 400           |
| Tentativa de criar um usuário com um group id inválido   | Group not found              | 404           |
| Tentativa de criar um usuário com um module id inválido  | Module not found             | 404           |
| Tentativa de criar um usuário com um email já cadastrado | Email is already in use      | 409           |

---

## **1.2 - _POST_**

[ Voltar para o topo ](#indice-de-rotas)

### **Login do usuário**

</br>

### **Endpoint: _/users/login_**

</br>

_Rota responsável pelo login do usuário, seja ele estudante, instrutor ou administrador, rota retorna um token de acesso_

</br>

**Campos obrigatórios:**

</br>

| Campo    | Tipo   | Descrição                    |
| -------- | ------ | ---------------------------- |
| email    | string | O email do usuário.          |
| password | string | A senha de acesso do usuário |

</br>

**Exemplo de requisição de login válida, corpo da requisição:**

```shell
{
	"email": "saralins@email.com",
	"password": "sara#321"
}
```

</br>

**Retorno da requisição:**

```shell
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
}
```

| **Status Code** |
| --------------- |
| _200_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| ------------------------------|----------------------------------------------------------------------------- |--------------|
| Tentativa de login sem envio de email e/ou senha | Wrong email or password | 403 |
| Tentativa de login com email não cadastrado | User not registered | 404 |
| Tentativa de login com senha errada | Wrong email or password | 403 |

---

## **1.3 - _GET_**

[ Voltar para o topo ](#indice-de-rotas)

</br>

### **Obter todos os dados do usuário**

</br>

### **Endpoint: _/users/profile_**

</br>

_Rota responsável por retornar todos os dados do usuário a partir do token_

</br>

**Deve ser enviado:**

</br>

-   Token de autorização do tipo _`Bearer token`_

</br>

**Exemplo de requisição válida:**

```shell
	/users/profile, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
        	}
		}
```

</br>

**Retorno da requisição:**

```shell
{
    "id": "22322984-3ebc-460d-8321-4ded36eeafa6",
    "name": "Sara Lins",
    "email": "saralins@email.com",
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
            "moduleId": "430ec768-812c-4241-adb5-1c1129bb60d7",
            "module": {
                "id": "430ec768-812c-4241-adb5-1c1129bb60d7",
                "name": "M1",
                "createdAt": "2022-11-08T15:23:59.091Z",
                "groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca",
                "sprints": [
                    {
                        "id": "1830d0f7-1e17-4e03-b504-925c20dee960",
                        "name": "S1",
                        "moduleId": "430ec768-812c-4241-adb5-1c1129bb60d7",
                        "videos": []
                    },
					...
                ]
            }
        }
    ],
    "group": {
        "id": "5bd3b8cc-c522-406f-8218-b06fb2af4bca",
        "number": 12
    }
}

```

| **Status Code** |
| --------------- |
| _200_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| ------------------------------|----------------------------------------------------------------------------- |--------------|
| Tentativa sem envio do token | Missing token | 401 |
| Tentativa com envio de token inválido | Invalid or expired token | 401 |

---

## **1.4 - _GET_**

[ Voltar para o topo ](#indice-de-rotas)

### **Listar todos os usuários**

</br>

### **Endpoint: _/users_**

</br>

_Rota responsável por retornar alguns dados de todos os usuários_

</br>

**Deve ser enviado:**

</br>

-   Token de autorização do tipo _`Bearer Token`_ com permissão de **administrador**

</br>

**Exemplo de requisição válida:**

```shell
	/users, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
        	}
		}
```

</br>

**Retorno da requisição:**

```shell
[
	{
		"id": "22322984-3ebc-460d-8321-4ded36eeafa6",
		"name": "Sara Lins",
		"email": "saralins@email.com",
		"role": "STUDENT",
		"createdAt": "2022-11-08T15:23:59.091Z",
		"updatedAt": "2022-11-08T15:23:59.091Z",
		"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca"
	},
	...
]
```

| **Status Code** |
| --------------- |
| _200_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| ------------------------------|----------------------------------------------------------------------------- |--------------|
| Tentativa sem envio do token | Missing token | 401 |
| Tentativa com envio de token inválido | Invalid or expired token | 401 |
| Tentativa com envio de token de estudante ou instrutor | Access denied | 403 |

---

## **1.5 - _GET_**

[ Voltar para o topo ](#indice-de-rotas)

### **Retorna um usuário a partir do id**

</br>

### **Endpoint: _/users/:id_**

</br>

_Rota responsável por retornar alguns dados de apenas um usuário a partir do id_

</br>

**Deve ser enviado:**

</br>

-   Token de autorização do tipo _`Bearer Token`_ com permissão de **administrador**

</br>

**Exemplo de requisição válida:**

```shell
	/users/22322984-3ebc-460d-8321-4ded36eeafa6, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
        	}
		}
```

</br>

**Retorno da requisição:**

```shell
	{
		"id": "22322984-3ebc-460d-8321-4ded36eeafa6",
		"name": "Sara Lins",
		"email": "saralins@email.com",
		"role": "STUDENT",
		"createdAt": "2022-11-08T15:23:59.091Z",
		"updatedAt": "2022-11-08T15:23:59.091Z",
		"groupId": "5bd3b8cc-c522-406f-8218-b06fb2af4bca"
	}
```

| **Status Code** |
| --------------- |
| _200_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| ------------------------------|----------------------------------------------------------------------------- |--------------|
| Tentativa sem envio do token | Missing token | 401 |
| Tentativa com envio de token inválido | Invalid or expired token | 401 |
| Tentativa com envio de token de estudante ou instrutor | Access denied | 403 |
| Tentativa com envio de id inválido | User not found | 404 |

---

## **1.6 - _DELETE_**

[ Voltar para o topo ](#indice-de-rotas)

### **Deleção de usuário**

</br>

### **Endpoint: _/users/:id_**

</br>

_Rota responsável pela deleção de um usuário a partir do id_

</br>

**Deve ser enviado**

</br>

-   Token de autorização do tipo _`Bearer token`_ com permissão de **administrador**

</br>

**Exemplo de requisição válida:**

```shell
	/users/22322984-3ebc-460d-8321-4ded36eeafa6, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
        	}
		}
```

</br>

| **Status Code** |
| --------------- |
| _204_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| ------------------------------|----------------------------------------------------------------------------- |--------------|
| Tentativa sem envio de token | Missing token | 401 |
| Tentativa com envio de token inválido | Invalid or expired token | 401 |
| Tentativa com envio de token de estudante ou instrutor | Access denied | 403 |
| Tentativa com envio de id inválido | User not found | 404 |

---

## **1.7 - _PATCH_**

[ Voltar para o topo ](#indice-de-rotas)

</br>

### **Atualização de usuário**

</br>

### **Endpoint: _/users/:id_**

</br>

_Rota responsável pela atualização do usuário, apenas a turma(groupId) poderá ser alterada_

</br>

**Deve ser enviado**

</br>

-   Token de autorização do tipo _`Bearer Token`_ com permissão de **administrador**

**Campos obrigatórios:**

</br>

| Campo   | Tipo   | Descrição          |
| ------- | ------ | ------------------ |
| groupId | string | O grupo do usuário |

</br>

**Exemplo de requisição válida, corpo da requisição:**

```shell
	/users/22322984-3ebc-460d-8321-4ded36eeafa6, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsImdyb3VwSWQiOiI3ZTQ0ZWM4..."
        	},
		body: {
			"groupId": "7e44ec8c-84e2-42d1-aefb-09531c5ba937"
			  }
		}
```

**Retorno da requisição:**

```shell
{
	"id": "22322984-3ebc-460d-8321-4ded36eeafa6",
	"name": "sara9",
	"email": "sara-test@mail.com",
	"role": "STUDENT",
	"createdAt": "2022-11-05T00:15:25.632Z",
	"updatedAt": "2022-11-08T21:42:55.051Z",
	"groupId": "7e44ec8c-84e2-42d1-aefb-09531c5ba937"
}
```

| **Status Code** |
| --------------- |
| _200_           |

**Possíveis erros:**
| _Erro_ | _Mensagem_ | _Status Code_ |
| --------------------------------------------------------|---------------------------------------------------|---------------|

Provide a different groupId than the current one

| Tentativa sem envio de token | Missing token | 401 |
| Tentativa com envio de token inválido | Invalid or expired token | 401 |
| Tentativa com envio de token de estudante ou instrutor | Access denied | 403 |
| should not be able to update a user by id with invalid id | User not exists | 404 |
| should not be able to update a user by id without data in the request body | Need to provide the data in the request | 400 |
| should not be able to update a user by id without providing the correct key(groupId) in the request | It is only possible to update the groupId | 400 |
| should not be able to update user by id with invalid token | Invalid or expired token | 401 |
| should not be able to update user by id without adm permission | Access denied | 403 |

---

## **2 - _Groups_**

[ Voltar para o topo ](#tabela-de-conteúdos)

-   [POST - create group](#21-POST)
-   [GET - list groups](#22-GET)
-   [GET - find group](#23-GET)

---

## 2.1 **POST**

### Create group

### Endpoint: /groups

Rota para criação de turmas

-   Necessário token de autorização
-   Necessário ser administrador
-   Não possui body na requisição

Body da resposta:

```shell
{
      id: 'e7cdc0d9-d9ab-4fb3-b997-7e12954f83af',
      number: 1,
      modules: [
        {
          id: '68d0c629-448d-4a02-b28f-75b45a703bf9',
          name: 'M1',
          createdAt: '2022-11-10T02:30:26.065Z',
          groupId: 'e7cdc0d9-d9ab-4fb3-b997-7e12954f83af',
          sprints: [
            ...
          ]
        }
      ]
    }
```

| Status Code |
| ----------- |
| 201         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to create a group without token | Missing token | 401 |
| should not be able to create a group with invalid/expired token | Invalid or expired token | 401 |
| should not be able to create a group without adm permission | Access denied | 403 |

---

## 2.2 **GET**

### List groups

### Endpoint: /groups

Rota para listar turmas

-   Necessário token de autorização
-   Necessário ser administrador
-   Não possui body na requisição

Body da resposta:

```shell
[
      {
        id: '43dde98f-5419-42ed-b7a1-603f49eb9852',
        number: 1,
        modules: [
            {
                ...
            }
        ] ,
        users: [
            {
                ...
            }
        ]
      },
      ...
]
```

| Status Code |
| ----------- |
| 200         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to list groups without token | Missing token | 401 |
| should not be able to list groups with invalid/expired token | Invalid or expired token | 401 |
| should not be able to list groups without adm permission | Access denied | 403 |
| should not be able to create a video with an invalid groupId | groupId not found | 404 |

---

## 2.3 **GET**

### Find group

### Endpoint: /groups/:id

Rota para encontrar turma através do ID

-   Necessário token de autorização
-   Necessário ser administrador
-   Não possui body na requisição

Body da resposta:

```shell
[
      {
        id: '43dde98f-5419-42ed-b7a1-603f49eb9852',
        number: 1,
        modules: [
            {
                ...
            }
        ] ,
        users: [
            {
                ...
            }
        ]
      },
      ...
]
```

| Status Code |
| ----------- |
| 200         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to find a group without token | Missing token | 401 |
| should not be able to find a group with invalid/expired token | Invalid or expired token | 401 |
| should not be able to find a group without adm permission | Access denied | 403 |
| should not be able to create a video with an invalid groupId | groupId not found | 404 |

---

## **3 - _Modules_**

[ Voltar para o topo ](#tabela-de-conteúdos)

-   [POST - create video](#51-POST)
-   [DELETE - delete video url](#52-PATCH)

---

## **4 - _Videos_**

[ Voltar para o topo ](#tabela-de-conteúdos)

-   [POST - create video](#51-POST)
-   [PATCH - update video](#51-PATCH)
-   [DELETE - delete video url](#52-DELETE)

---

## 4.1 **POST**

### Create video

### Endpoint: /videos

Rota para criação de video

-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

Campos:
| Campo | Tipo | Descrição |
| ------------|--------|-------------------------------------------------|
| title | string | Define o título do vídeo |
| url | string | Define o link do vídeo (opcional) |
| releaseDate | date | Define o dia em que o vídeo foi transmitido |
| sprintId | string | Define a sprint do vídeo |

Body da requisição:

```shell
{
	"title": "video teste",
	"url": "urldovideo.com",
	"releaseDate": "11/04/2022",
	"sprintId": "38e0f242-4b31-4366-abc8-71004132c8f4"
}
```

Body da resposta:

```shell
{
	"id": "56f9ed40-35c3-4311-92cd-84967fc8679f",
	"title": "video teste",
	"url": "urldovideo.com",
	"releaseDate": "2022-11-04T04:00:00.000Z",
	"createdAt": "2022-11-07T23:07:51.097Z",
	"updatedAt": "2022-11-07T23:07:51.097Z",
	"sprintId": "38e0f242-4b31-4366-abc8-71004132c8f4"
}
```

| Status Code |
| ----------- |
| 201         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to create a video without token | Missing token | 401 |
| should not be able to create a video with invalid/expired token | Invalid or expired token | 401 |
| should not be able to create a video without adm/instructor permission | Access denied | 403 |
| should not be able to create a video when instructor don't have this module | Instructor not allowed | 401 |
| should not be able to create a video without title | Title is required | 400 |
| should not be able to create a video without release date | Release date is required | 400 |
| should not be able to create a video without sprintId | Sprint id is required | 400 |
| should not be able to create a video with an invalid sprintId | Sprint not found | 404 |

---

## 4.2 **UPDATE**

[ Voltar para o topo ](#indice-de-rotas)

### Update video

### Endpoint: /videos/:id

Rota para update de video

-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

Campos:
| Campo | Tipo | Descrição |
| ------------|--------|-------------------------------------------------|
| title | string | título do vídeo (opcional) |
| url | string | link do vídeo (opcional) |
| sprintId | string | sprint id do vídeo |

Body da requisição:

```shell
{
	"title": "video teste",
	"url": "urldovideo.com",
	"sprintId": "38e0f242-4b31-4366-abc8-71004132c8f4"
}
```

Body da resposta:

```shell
{
      id: 'c4f61f22-d127-4b10-a2b6-ef715f2be988',
      title: 'video update',
      url: 'test update',
      releaseDate: '2022-11-04T04:00:00.000Z',
      createdAt: '2022-11-10T02:10:34.761Z',
      updatedAt: '2022-11-10T02:10:34.958Z',
      sprintId: '3c4ee486-f932-4f45-a3ea-f07aa424fe18'
    }
```

| Status Code |
| ----------- |
| 200         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to update a video with invalid/expired token | Invalid or expired token | 401 |
| should not be able to update a video without adm/instructor permission | Access denied | 403 |
| should not be able to update a video when instructor don't have this module | Instructor not allowed | 401 |
| should not be able to update a video with an invalid videoId | Sprint not found | 404 |

---

## 4.3 **DELETE**

[ Voltar para o topo ](#indice-de-rotas)

### Delete video url

### Endpoint: /videos/:id

Rota para deleção de url de video

-   Sem body na requisição
-   Sem body na resposta
-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

| Status Code |
| ----------- |
| 204         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able to delete a video url without token | Missing token | 401 |
| should not be able to delete a video url with invalid/expired token | Invalid or expired token | 401 |
| should not be able to delete a video url without adm/instructor permission | Access denied | 403 |
| should not be able to update a video when instructor don't have this module | Instructor not allowed | 401 |
| should not be able to delete a video with an invalid video id | Access denied | 404 |

---

## 5. **Rota de Marcadores de Video**

[ Voltar para o topo ](#indice-de-rotas)

-   [POST - create marker](#61-POST)
-   [PATCH - update marker](#62-PATCH)
-   [DELETE - delete marker](#63-DELETE)

---

## 5.1 **POST**

### Create Marker

### Endpoint: /markers

Rota para criação de marcador

-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

| Campo   | Tipo    | Descrição                           |
| ------- | ------- | ----------------------------------- |
| marks   | marks[] | Define os marcadores de vídeo       |
| videoId | string  | Define o id do vídeo                |
| groupId | string  | Define o grupo de alunos (opcional) |

Body da requisição:

```shell
{
	"marks": "[
		{
			title: 'git hub',
			time: '00:20:50',
			videoId: video?.id,
		},
		{
			title: 'user controller',
			time: '00:25:50',
			videoId: video?.id,
		},
		{
			title: 'typeorm',
			time: '19:20:50',
			videoId: video?.id,
		},
	]",
	"videoId": "video?.id",
	"groupId": "group.id"
}
```

Body da resposta:

```shell
{
	count: 3
}
```

| Status Code |
| ----------- |
| 201         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should not be able create a marker with h:m:s invalid | time not validate | 400 |
| should not be able to create a video with invalid/expired token | Invalid or expired token | 401 |
| should not be able create a marker with h:m:s equals | this video needed to equal marks video | 400 |
| should not be able create a marker without adm access | Instructor not allowed | 403 |
| should not be able create a marker with invalid ID video | video not found | 400 |

---

## 5.2 **PATCH**

### Update Marker

### Endpoint: /markers/:id

Rota para atualização de marcador

-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

| Campo | Tipo   | Descrição                 |
| ----- | ------ | ------------------------- |
| time  | string | tempo do vídeo (opcional) |
| title | string | titulo do vído (opcional) |

Body da requisição:

```shell
{
	"title": 'git hub',
	"time": '00:20:50'
}
```

Body da resposta:

```shell
{
	"id": '634a0edc-7cde-4b5f-9469-d601759e2fba',
	"time": '02:04:49',
	"title": 'Titulo alterado',
	"createdAt": "2022-11-09T22:03:13.009Z",
	"updatedAt": "2022-11-09T22:03:13.199Z",
	"videoId": 'c0fcb84d-1f76-4f92-b690-a6d1f8e51e19'
}
```

| Status Code |
| ----------- |
| 200         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should be able possible to update a marked | (not) | 200 |
| should be able is not ADM or INSTRUCTOR | Unauthorized | 403 |
| should not be possible to update one marked with invalid id | Marker not found | 404 |
| should not be possible to create a marker with time that already exists | Time already exists | 403 |

---

## 5.3 **DELETE**

### Delete Marker

### Endpoint: /markers/:id

Rota para deletar marcador

-   Necessário token de autorização
-   Necessário ser administrador ou ser instrutor do módulo

| Campo | Tipo   | Descrição                  |
| ----- | ------ | -------------------------- |
| time  | string | tempo do vídeo (opcional)  |
| title | string | titulo do vídeo (opcional) |

| Status Code |
| ----------- |
| 204         |

Possíveis erros:
| Error | Message | Status Code |
| ------------------------------------------------------------------------------|-------------------------------|-------------|
| should be possible to delete a marker | (not) | 204 |
| should be able is not ADM or INSTRUCTOR | Unauthorized | 403 |
| should not be possible to delete a marker with invalid id | Marker not found | 404 |
| should not be possible to delete a marker with a different instructor | Instructor does not own this mark | 401 |

---

### All rights reserved.

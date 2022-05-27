const express = require("express");

/* Gera ID's aleatórios */
const { randomUUID } = require("crypto");

/* Gera arquivos, no caso, criaremos um JSON */
const fs = require('fs')

const app = express();

/* MIDDLEWARE */
app.use(express.json());

let products = [];

fs.readFile('products.json', 'utf-8', (err, data) => {
  if (err) console.log('FS READFILE ERROR: ', err)
  else products = JSON.parse(data)
})

/*
  GET = Busca informação
  POST = Inserir(CRIAR) informação
  PUT = Alterar alguma informação
  PATCH = Alterar uma informação especifica
  DELETE = Remove informação
*/

/*
  Tipos de paramêtros

  Routes Params = http://localhost:5000/produtos/12
    Parametros das rotas
  
  Query Params = http://localhost:5000/produtos?name=teclado&description=tecladobom
    Parametros não obrigatorios da url
  
  Body Params = {
    "name": "teclado",
    "description": "teclado bom"
  }
    Vem inseridos no corpo
    OBS: NÃO UTILIZAMOS BODY PARAMS EM GETS, APENAS EM PUT, PATCH E POST
*/

/*
    Req(Request) = Tudo q entra
    Res(Response) = Tudo oq sai
*/

/*
  Nos não conseguimos acessar as rotas post pq os browser's
  usam por padrão GET'S, então para acessa-lás, usaremos o insomnia
*/

app.get("/test", (_, res) => {
  return res.json({
    message: "test with a json",
  });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  const product = {
    name,
    price,
    id: randomUUID(),
  };

  productFile()

  products.push(product);

  return res.json(product)
});

app.get('/products', (_, res) => {
  return res.json(products)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find(product => product.id === id)
  return res.json(product)
})

app.put('/products/:id', (req, res) => {
  const { id } = req.params
  const { name, price } = req.body

  const productIndex = products.findIndex(product => product.id === id)

  products[productIndex] = {
    ...products[productIndex],
    name,
    price
  }

  productFile()

  return res.json({ message: `Produto ${id} alterado com sucesso!` })
})

app.delete('/products/:id', (req, res) => {
  const { id } = req.params

  const productIndex = products.findIndex(product => product.id === id)

  products.splice(productIndex, 1)

  productFile()

  return res.json({ message: 'item excluido com sucesso' })
})

const productFile = () => {
  fs.writeFile('products.json', JSON.stringify(products), err => {
    if (err) console.log('FS ERROR: ', err)
    else console.log('Produto inserido')
  })
}


/*
  Iniciando projeto na porta 5000
*/
app.listen(5000, () => console.log("server is running with a nodemon..."));

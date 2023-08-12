const express = require("express")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const ProductManager = require("./ProductManager")
let data = new ProductManager("src/products.json")

app.get("/products", async (req, res) => {
    try {
        let products = await data.getProducts()
        let { limit } = req.query
        if (limit && limit < products.length) {
            var limitProducts = products.slice(0, limit)
            res.send(limitProducts)
        } else {
            res.send(products)
        }
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

app.get("/products/:pid", async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        let product = await data.getProductById(id)
        if (!product) res.send({ error: 'Producto no encontrado' })
        else res.send(product)
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

app.listen(8080, () => {
    console.log(`server is running on port 8080`)
})
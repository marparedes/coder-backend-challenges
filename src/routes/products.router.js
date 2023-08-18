const express = require("express")

const { Router } = express
const router = new Router()

const ProductManager = require("../managers/ProductManager")
let data = new ProductManager("src/json/products.json")

router.get("/", async (req, res) => {
    try {
        let products = await data.getProducts()
        let { limit } = req.query
        if (limit && limit < products.length) {
            var limitProducts = products.slice(0, limit)
            res.status(200).send({ response: limitProducts })
        } else {
            res.status(200).send({ response: products })
        }
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.get("/:pid", async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        let product = await data.getProductById(id)
        if (!product) res.status(404).send({ error: 'Producto no encontrado' })
        else res.status(200).send({ response: product })
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.post("/", async (req, res) => {
    try {
        let newProduct = req.body
        res.status(200).send(await data.addProduct(newProduct))
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.put("/:pid", async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        let product = await data.getProductById(id)
        if (!product) res.status(404).send({ error: 'Producto no encontrado' })
        else {
             let newData = req.body
            res.status(200).send(await data.updateProduct(id, newData))
        }
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        res.status(200).send(await data.deleteProduct(id))
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

module.exports = router
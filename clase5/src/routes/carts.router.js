const express = require("express")

const { Router } = express
const router = new Router()

const CartManager = require("../CartManager")
let data = new CartManager("src/carts.json")

router.post("/", async (req, res) => {
    try {
        let newCart = req.body
        res.send(await data.addCart(newCart))
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.get("/:cid", async (req, res) => {
    try {
        let id = parseInt(req.params.cid)
        let product = await data.getCartById(id)
        if (!product) res.status(404).send({ error: 'Carrito no encontrado' })
        else res.status(200).send(product)
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid)
        let idProduct = parseInt(req.params.pid)
        res.send(await data.addCartProduct(idCart, idProduct))

    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

module.exports = router
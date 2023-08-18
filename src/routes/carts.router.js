const express = require("express")

const { Router } = express
const router = new Router()

const CartManager = require("../managers/CartManager")
let data = new CartManager("src/json/carts.json")

router.get("/", async (req, res) => {
    try {
        let carts = await data.getCarts()
        res.status(200).send({ response: carts })
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.get("/:cid", async (req, res) => {
    try {
        let id = parseInt(req.params.cid)
        let cart = await data.getCartById(id)
        if (!cart) res.status(404).send({ error: 'Carrito no encontrado' })
        else res.status(200).send({ response: cart })
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

router.post("/", async (req, res) => {
    try {
        let newCart = req.body
        res.send(await data.addCart(newCart))
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

router.delete("/:cid/product/:pid/:units", async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid)
        let idProduct = parseInt(req.params.pid)
        let units = parseInt(req.params.units)
        res.send(await data.deleteCartProduct(idCart, idProduct, units))
    } catch (error) {
        res.status(404).send({ error: 'Ocurrió un error' })
        console.log(error)
    }
})

module.exports = router
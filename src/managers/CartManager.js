const fs = require('fs')

class CartManager {
    constructor(path) {
        this.firstId = 1,
        this.path = path
    }

    async read() {
        try {
            let data = await fs.promises.readFile(this.path, "utf-8")
            return data

        } catch (error) {
            console.log(error)
            throw Error("Error al leer el archivo")
        }
    }

    async write(datos, msg) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(datos, null, 2))
            console.log(msg)
        } catch (error) {
            throw Error("Error al escribir en el archivo")
        }
    }

    async getCarts() {
        try {
            
            let data = await this.read()
            let carts = JSON.parse(data)

            return carts
        } catch (error) {
            return error
        }
    }

    async addCart(cart) {
        let newId = 0

        let data = await this.read()
        let carts = JSON.parse(data)

        if (!carts || carts.length === 0) {
            newId = this.firstId
        } else {
            newId = carts[carts.length - 1].id + 1
        }

        let prods = cart.products ? cart.products : []
        let newCart = { id: newId, products: prods}

        carts.push(newCart)

        await this.write(carts, "Carrito agregado!")

        return newCart

    }

    async getCartById(id) {
        let data = await this.read()
        let carts = JSON.parse(data)

        let result = carts.filter(cart => cart.id == id)
        if (result.length == 0) return false
        return result[0]
    }

    async addCartProduct(idCart, idProduct) {
        try {

            let updatedCart;
            // busco el idCart
            let carts = await this.getCarts() 
            let index = carts.findIndex(cart => cart.id === idCart)
            if (index === -1) {
                return Error({ error: "Cart not found" })
            }
    
            // verifico si ya existe el producto en el carrito
            let indexProd = carts[index].products.findIndex(p => p.id === idProduct)
            if(indexProd != -1) {
                var prods = {id:carts[index].products[indexProd].id, quantity: carts[index].products[indexProd].quantity+1}
                carts[index].products[indexProd] = prods
                updatedCart = { ...carts[index] }
            } else {
                var newProd = {
                    id: idProduct,
                    quantity: 1
                }
                carts[index].products.push(newProd)
                updatedCart = { ...carts[index] }
            }
    
            carts[index] = updatedCart
    
            await this.write(carts, "Cart updated")
            return updatedCart
    
        } catch (error) {
            console.log(error)
        }
    }

    async deleteCartProduct(idCart, idProduct, units) {
        try {
            let updatedCart;
            // busco el idCart
            let carts = await this.getCarts() 
            let index = carts.findIndex(cart => cart.id === idCart)
            if (index === -1) {
                return Error({ error: "Cart not found" })
            }

            // verifico si ya existe el producto en el carrito
            let indexProd = carts[index].products.findIndex(p => p.id === idProduct)
            if(indexProd === -1) {
                return Error({ error: `Product not found in cart with ID: ${idCart}` })
            }

            var prodQuantity = carts[index].products[indexProd].quantity
            var prodId = carts[index].products[indexProd].id

            if(units > prodQuantity) {
                return Error({ error: `Cannot delete ${units} products` })
            } else if (units === prodQuantity) {
                carts[index].products.splice(indexProd, 1)
            } else {
                var prods = {id: prodId, quantity: prodQuantity-units}
                carts[index].products[indexProd] = prods
            }
        

            updatedCart = { ...carts[index] }
            carts[index] = updatedCart
    
            // Agrego stock al producto
            const ProductManager = require("../managers/ProductManager")
            let data = new ProductManager("src/json/products.json")
            let product = await data.getProductById(idProduct)
            let newData = {
                stock: product.stock + units
            }
            await data.updateProduct(idProduct, newData)

            await this.write(carts, "Cart and product updated")
            return updatedCart

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CartManager
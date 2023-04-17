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

    async addCart(products) {
        let newId = 0

        let data = await this.read()
        let carts = JSON.parse(data)

        if (!carts || carts.length === 0) {
            newId = this.firstId
        } else {
            newId = carts[carts.length - 1].id + 1
        }

        let newCart = { id: newId, ...products}

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
                return Error({ error: "Product not found" })
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
    
            await this.write(carts, "Product updated")
            return updatedCart
    
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CartManager
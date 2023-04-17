const fs = require('fs')

class ProductManager {

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

    async addProduct(product) {
        let { title, description, code, price, status, stock, category, thumbnails } = product
        let newId = 0
        let newProduct = {}

        let data = await this.read()
        let products = JSON.parse(data)

        if (this.validateCode(products, code) && title && description && price && status && stock && category) {

            if (!products || products.length === 0) {
                newId = this.firstId
            } else {
                newId = products[products.length - 1].id + 1
            }

            newProduct.id = newId
            newProduct.title = title
            newProduct.description = description
            newProduct.price = price
            newProduct.code = code
            newProduct.status = status
            newProduct.stock = stock
            newProduct.category = category
            newProduct.thumbnail = thumbnails

            products.push(newProduct)

            await this.write(products, "Producto agregado!")

            return newProduct
        }

        return Error("Error: product already exists.")
    }

    validateCode(products, code) {
        if (!products) return true
        return !products.some(product => product.code === code)
    }

    async getProducts() {
        try {
            
            let data = await this.read()
            let products = JSON.parse(data)

            return products
        } catch (error) {
            return error
        }
    }

    async getProductById(id) {
        let data = await this.read()
        let products = JSON.parse(data)

        let result = products.filter(product => product.id == id)
        if (result.length == 0) return false
        return result[0]
    }

    async updateProduct(id, updateData) {
        try {

            let products = await this.getProducts() 
            let index = products.findIndex(product => product.id === id)
            if (index === -1) {
                return Error({ error: "Product not found" })
            }
    
            let updatedProduct = { ...products[index], ...updateData }
            if (!this.validateCode(products.filter(p => p.id !== updatedProduct.id), updatedProduct.code)) {
                return Error({ error: "Code already exists" })
            }
    
            products[index] = updatedProduct
    
            await this.write(products, "Product updated")
            return updatedProduct
    
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(id) {
        let data = await this.read()
        let products = JSON.parse(data)

        let product = await this.getProductById(id)

        console.log(product.id)
        
        var index = products.map(object => object.id).indexOf(product.id)
        
        if(index != -1) {
            products.splice(index, 1)
            await this.write(products, "")
            return { msg: `Producto con ID: ${id} eliminado`}
        } else {
            return Error(`Producto con ID: ${id} no existe`)
        }
    }
}

module.exports = ProductManager
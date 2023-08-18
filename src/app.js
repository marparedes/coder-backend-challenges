const express = require("express")
const app = express()

const ProductsRoutes = require("./routes/products.router")
const CartsRoutes = require("./routes/carts.router")

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", ProductsRoutes)
app.use("/api/carts", CartsRoutes)


app.listen(8080, () => {
    console.log(`server is running on port 8080`)
})
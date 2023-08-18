# coder-backend-challenges

## Getting started
- Clone the repository
```
git clone  https://github.com/marparedes/coder-backend-challenges.git
```
- Install dependencies
```
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:8080`

### API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /api/products | To retrieve all products |
| GET | /api/products/:pid | To retrieve a single product |
| POST | /api/products | To add a new product |
| PUT | /api/products/:pid | To edit the details of a single product |
| DELETE | /api/products/:pid | To delete a single product |
| GET | /api/carts | To retrieve all carts |
| GET | /api/carts/:cid | To retrieve details of a single cart |
| POST | /api/carts | To add a new cart |
| POST | /api/carts/:cid/product/:pid | To add a product to a single cart, if the product already exists just increases the quantity |
| DELETE | /api/carts/:cid/product/:pid/:units | To remove a certain amount (units) of a product from a single cart |

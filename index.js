const express = require('express');
const mongoose = require('mongoose');
const Product = require('./Models/ProductModel'); // Assuming the product model file is in the same directory

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

// Create a new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const product = new Product({ name, quantity, price });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, quantity, price }, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }
        res.status(200).send(`Product "${deletedProduct.name}" Deleted`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

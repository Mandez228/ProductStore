const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const orderRoutes = require('./routes/orderRoutres');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const createPath= require('./helper/create-path');
const Product = require("./models/product");



app.set('view engine', 'ejs');

const PORT = 3000;
const db =  'mongodb+srv://231695:CG25nBRGc0vxrAwu@productstore.f8oid.mongodb.net/ProductStore?retryWrites=true&w=majority&appName=ProductStore';


mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error));



app.listen(PORT, () => {
    console.log(`listening port ${PORT}`);
});
// middlewares
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 60 * 1000 * 10
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('styles'));
app.use(methodOverride('_method'));
//


app.get('/', async (req, res) => {
    const title = 'Home';
    const username = req.session.username;

    try {
        const products = await Product.find({ author: username }).sort({ createdAt: -1 });

        const productsWithRatings = products.map(product => {
            const totalRatings = product.comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
            const averageRating = product.comments.length
                ? (totalRatings / product.comments.length).toFixed(1)
                : 'No ratings yet';

            return {
                ...product.toObject(),
                averageRating
            };
        });

        res.render(createPath('index'), { products: productsWithRatings, title, username });
    } catch (error) {
        console.error(error);
        res.render(createPath('error'), { title: 'Error', message: 'Failed to load products' });
    }
})

app.use(authRoutes);
app.use(productRoutes);
app.use(contactRoutes);
app.use(orderRoutes);

app.use((req, res) => {
    const title = 'Error Page';
    res
        .status(404)
        .render(createPath('error'), { title });
});
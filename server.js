var express = require('express'); // web application server framework for building web applications
var app = express();
var bodyParser = require('body-parser'); //to extract the body from the incoming requests 
var mongoose = require('mongoose'); //Object Mapping between Node and MongoDB
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product')
var WishList = require('./model/wishlist')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
})); //If extended is false, you can not post "nested object"

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({
                error: "Could not save product"
            });
        } else {
            response.send(savedProduct);
        }
    });
});

app.get('/product', function (request, response) {

    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({
                error: "Could not fetch products"
            });
        } else {
            response.send(products);

        }
    });
});

app.post('/wishlist', function (request, response) {
    var wishList = new WishList();
    wishList.title = request.body.title;
    // product.price = request.body.price;
    wishList.save(function (err, newWishList) {
        if (err) {
            response.status(500).send({
                error: "Could not creat wishlist"
            });
        } else {
            response.send(newWishList);
        }
    });
});



app.get('/wishlist', function (request, response) {

    WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err,wishLists){
        if (err){
            response.status(500).send({error:"could not fetch wishlists"});
        } else {
            response.status(200).send(wishLists);
        }
    });
});

//to add a certain product to wishlist
app.put('/wishlist/product/add', function (request, response){
    Product.findOne({_id:request.body.productId},function(err,product){
        if(err){
            response.status(500).send({error:"could not add item to wishlist"});
        } else {
            WishList.update({_id:request.body.wishListId},{$addToSet:{products:product._id}},function(err,wishList){
                if(err){
            response.status(500).send({error:"could not add item to wishlist"});
                } else {
                    response.send("Successfully added to wishlist");
                }
            });
        }
    });
});



        app.listen(3000, function () {
            console.log("Swag Shop API running on port 3000...");
        });

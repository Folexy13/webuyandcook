require('dotenv').config();
var Smenu = require('../models/sMenu');

var mongoose = require('mongoose');
var connection__url = process.env.MONGO_URI;

mongoose.connect(connection__url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
var smenus = [
    new Smenu({
        imagePath: "https://i.ytimg.com/vi/XeZJlxAsP18/maxresdefault.jpg",
        title: 'Egusi',
        description: "Who doesn\'t like a delicious(ta san san) meal of rich Egusi soup?",
        price: 7000
    }),

    new Smenu({
        imagePath: "https://sisijemimah.com/wp-content/uploads/2015/07/ogbono-2.jpg",
        title: 'Ogbono',
        description: 'Rich ogbonno soup that goes with any morsel. book your soup now',
        price: 7000
    }),

    new Smenu({
        imagePath: "https://allnigerianfoods.com/wp-content/uploads/banga-stew-ofe-akwu.jpg",
        title: 'Banga Soup',
        description: 'Banga Soup and any morsel is a kind of mixture the mouth want and the stomach appreciate',
        price:7000
    }),
    new Smenu({
        imagePath: "https://i2.wp.com/www.thepretendchef.com/wp-content/uploads/2016/03/okrosoup-1.jpg",
        title: 'Okro Soup',
        description: 'Want to do your taste bud a favour? go for this rich and cost-effective okro soup',
        price:7000
    }),
    new Smenu({
        imagePath: "https://sisijemimah.com/wp-content/uploads/2015/06/20190728_121338.jpg",
        title: 'Efo Riro',
        description: ' Try our jaw-dropping Efo riro today',
        price:7000
    }),
    new Smenu({
        imagePath: "https://cdn.shopify.com/s/files/1/0121/2950/1242/articles/edi_700x.jpg",
        title: 'edikaikong',
        description: "Our rich edikaikong soup with assorted meat might just be that menu you are trying to get and haven't tasted",
        price: 9000
    }),
    new Smenu({
        imagePath: "https://niammy.com/img/public/990/201903/1553547369_24159.jpg",
        title: 'Bitter leaf',
        description: "Our healthy bitter leaf soup is jsut what you need for your weekend cruise. book the menu now",
        price: 7000
    }),
]
done = 0 
for (var i = 0; i < smenus.length; i++){
    smenus[i].save(function (err, result) {
        done++;
        if (done === smenus.length) {
                exit()
            }
        })
}

function exit() {
    mongoose.disconnect()
}
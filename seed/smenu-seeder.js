var Smenu = require('../models/sMenu');

var mongoose = require('mongoose');
var connection__url = "mongodb+srv://folajimi:wecookandbuy@dashboard.nnwnr.mongodb.net/webuyncook?retryWrites=true&w=majority";

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
        price: 3500
    }),

    new Smenu({
        imagePath: "https://i.pinimg.com/originals/d7/7e/42/d77e429c899b7d306b1ef784eb621a72.jpg",
        title: 'Pepper Soup',
        description: 'Do you need a basket of fruits wrapped as a gift for your friend, family or employers, then this is your menu',
        price: 3500
    }),

    new Smenu({
        imagePath: "https://allnigerianfoods.com/wp-content/uploads/banga-stew-ofe-akwu.jpg",
        title: 'Banga Soup',
        description: 'Banga Soup and any morsel is a kind of mixture the mouth want and the stomach appreciate',
        price:1500
    }),
    new Smenu({
        imagePath: "https://i2.wp.com/www.thepretendchef.com/wp-content/uploads/2016/03/okrosoup-1.jpg",
        title: 'Okro Soup',
        description: 'Want to do your taste bud a favour? go for this rich and cost-effective okro soup',
        price:3500
    }),
    new Smenu({
        imagePath: "https://sisijemimah.com/wp-content/uploads/2015/06/20190728_121338.jpg",
        title: 'Efo Riro',
        description: ' Try our jaw-dropping Efo riro today',
        price:3500
    }),
    new Smenu({
        imagePath: "https://www.allnigerianrecipes.com/wp-content/uploads/2019/03/beef-and-chicken-stew1.jpg",
        title: 'Nigeria Stew',
        description: 'A pot filled with the indigenous Nigerain stew is enough to keep the body for the weekend',
        price:3500
    })
];
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
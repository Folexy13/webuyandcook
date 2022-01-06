require('dotenv').config()
var Fmenu = require('../models/frMenu');

var mongoose = require('mongoose');

var connection__url = process.env.MONGO_URI

mongoose.connect(connection__url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

var fmenus = [
    new Fmenu({
        imagePath: "https://organicfoods.com.ng/wp-content/uploads/2019/09/6446473_preview-600x635.jpg",
        title: 'Fruit Basket(small size)',
        description: 'Do you need a basket of fruits wrapped as a gift for your friend, family or employers and you need to cut your cost? This is your menu',
        price: 3900
    }),

     new Fmenu({
        imagePath: "https://organicfoods.com.ng/wp-content/uploads/2019/09/6446473_preview-600x635.jpg",
        title: 'Fruit Basket(medium size)',
        description: 'Do you need a basket of fruits wrapped as a gift for your friend, family or employers and you need different health-beneficial fruits? This is your menu',
        price: 7000
    }),
    new Fmenu({
        imagePath: "https://organicfoods.com.ng/wp-content/uploads/2019/09/6446473_preview-600x635.jpg",
        title: 'Fruit Basket(Large size)',
        description: 'Do you need a basket of fruits wrapped as a gift for your friend, family or employers and you need it in a grand style? This is your menu',
        price: 14200
    }),
];
done = 0 
for (var i = 0; i < fmenus.length; i++){
    fmenus[i].save(function (err, result) {
        done++;
        if (done === fmenus.length) {
                exit()
            }
        })
}

function exit() {
    mongoose.disconnect()
}
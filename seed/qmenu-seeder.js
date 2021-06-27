var Qmenu = require('../models/qMenu');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/webuyandcook', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

var qmenus = [
    new Qmenu({
        imagePath: "https://i.ytimg.com/vi/XeZJlxAsP18/maxresdefault.jpg",
        title: 'Egusi',
        description: "Who doesn\'t like a delicious(ta san san) meal of rich Egusi soup?",
        price: 3500
    }),

    new Qmenu({
        imagePath: "https://organicfoods.com.ng/wp-content/uploads/2019/09/6446473_preview-600x635.jpg",
        title: 'Fruit Basket',
        description: 'Do you need a basket of fruits wrapped as a gift for your friend, family or employers, then this is your menu',
        price: 15000
    }),

    new Qmenu({
        imagePath: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
        title: 'Crate of eggs',
        description: 'Do you need newly produced fresh and calcium-rich egg for your consumption, this would do',
        price:1500
    }),
    new Qmenu({
        imagePath: "https://i2.wp.com/www.thepretendchef.com/wp-content/uploads/2016/03/okrosoup-1.jpg",
        title: 'Okro Soup',
        description: 'Want to do your taste bud a favour? go for this rich and cost-effective okro soup',
        price:3500
    }),
    new Qmenu({
        imagePath: "https://njalo.ng/storage/files/ng/1132/thumb-816x460-560b73145fa56d9b0a6982434f401187.jpg",
        title: 'Stock Fish',
        description: ' Dry stock fish that can be married to any soup,good for you',
        price:1500
    }),
    new Qmenu({
        imagePath: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
        title: 'Nigeria Stew',
        description: 'A pot filled with the indigenous Nigerain stew is enough to keep the body for the weekend',
        price:3500
    })
];
done = 0 
for (var i = 0; i < qmenus.length; i++){
    qmenus[i].save(function (err, result) {
        done++;
        if (done === qmenus.length) {
                exit()
            }
        })
}

function exit() {
    mongoose.disconnect()
}
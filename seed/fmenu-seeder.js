require('dotenv').config()
var Fmenu = require('../models/fMenu');

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
        imagePath: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
        title: 'Crate of eggs',
        description: 'Do you need newly produced fresh and calcium-rich egg for your consumption, this would do',
        price: "varies"
    }),
    new Fmenu({
        imagePath: "https://jendolstores.com/wp-content/uploads/2020/08/Afrimillz_Indomie.jpg",
        title: 'Carton of Indomie',
        description: "Do you need carton of indomie and your lectures or schedule won't permit you to have it?, chill we got you Covered.Webuy for you.",
        price: "varies"
    }),
    new Fmenu({
        imagePath: "https://njalo.ng/storage/files/ng/1132/thumb-816x460-560b73145fa56d9b0a6982434f401187.jpg",
        title: 'Stock Fish',
        description: ' Dry stock fish that can be married to any soup,good for you',
        price:"varies"
    }),
    new Fmenu({
        imagePath: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
        title: 'Market tour',
        description: "Do you want to get varieties of good in the market and you don't have the time to spare and you need it delivered at your door?, we are your sure plug. Webuy all of that for you",
        price: "varies"
    })
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
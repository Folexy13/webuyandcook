require('dotenv').config();
var Qmenu = require('../models/qMenu');

var mongoose = require('mongoose');

var connection__url =process.env.MONGO_URI;

mongoose.connect(connection__url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

var qmenus = [
    new Qmenu({
        imagePath: "https://www.preciouscore.com/wp-content/uploads/2018/08/Nigerian-Jollof-Rice.jpg",
        title: 'A plate of Jollof Rice with assorted meat',
        description: "Who doesn\'t a salivating Nigeria Jollof with assorted meat, The menu to choose and enjoy",
        price: 1200
    }),
    new Qmenu({
        imagePath: "https://img-global.cpcdn.com/recipes/a3f5568bcc2d947e/640x640sq70/photo.webp",
        title: 'A plate of Fried Rice with assorted meat',
        description: "Who doesn\'t a salivatingrich fried rice with assorted meat, The menu to choose and enjoy",
        price: 1200
    }),

    new Qmenu({
        imagePath: "https://i1.wp.com/besthomediet.com/wp-content/uploads/2020/09/Bean-and-plantain-Porridge-Recipe.jpg",
        title: 'A plate of porridge Beans with Plantain',
        description: 'A plate of porride beans with plantain, the menu the mouth want and the stomach does not reject. Book your menu today',
        price: 500
    }),

    new Qmenu({
        imagePath: "https://indomie.ng/wp-content/uploads/2019/06/Indomitables-onion.png",
        title: 'A Plate of garnished Indomie',
        description: 'A salivating menu, which goes for the least price but not the least offer. book the menu now and enjoy',
        price:600
    }),
    new Qmenu({
        imagePath: "https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/63/2020/04/Basic-cupcakes-recipe-image-scaled-e1587394625463.jpg",
        title: 'Cup cakes (12 cups)',
        description: 'Want to do your taste bud a favour? and you need just a good appetizer while you wait for your food? This is your menu',
        price:3000
    }),
    new Qmenu({
        imagePath: "https://wildwildwhisk.com/wp-content/uploads/2019/06/Vanilla-Cake-1.jpg",
        title: 'Icing cake (small size)',
        description: ' Your cake for any event you need in various sizes, we are your sure plug for that',
        price:4000
    }),
    new Qmenu({
        imagePath: "https://wildwildwhisk.com/wp-content/uploads/2019/06/Vanilla-Cake-1.jpg",
        title: 'Icing cake (medium size)',
        description: 'Your cake in medium size, we got you covered. book your menu now',
        price:6000
    }),
     new Qmenu({
        imagePath: "https://wildwildwhisk.com/wp-content/uploads/2019/06/Vanilla-Cake-1.jpg",
        title: 'Icing cake (Large size)',
        description: 'Your cake in large size, we got you covered. book your menu now',
        price:10000
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
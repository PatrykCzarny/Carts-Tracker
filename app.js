const express = require('express');
const exphbs = require('express-handlebars');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const {
    readJsonFile,
    writeJsonFile,
    sendUpdateToChime
} = require('./utils');
const {
    paths
} = require('./paths');

const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
})

const app = express();
app.use(express.static('static'));
app.engine('.hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(limiter);
app.use(bodyParser.json());

app.get('/settings', async (req, res) => {
    const cartsOnFloors = await readJsonFile(paths.cartsOnFloors);

    res.render('settings', {
        cssPath: paths.cssSettings,
        scriptsPath: paths.scriptsPathSettings,
        p1: cartsOnFloors.p1,
        p2: cartsOnFloors.p2,
        p3: cartsOnFloors.p3,
        p4: cartsOnFloors.p4,
        helpers: {
            selectCarts: (el) => {
                return (el.name !== 'Login' && el.name !== 'Last Update')
            }
        }
    });
});

app.get('/:floor?', async (req, res) => {
    const cartsOnFloors = await readJsonFile(paths.cartsOnFloors);
    const paramsFloor = req.params.floor;
    const valid = (paramsFloor === "1" || paramsFloor === "2" || paramsFloor === "3" || paramsFloor === "4");

    if (valid) {
        const currentFloor = cartsOnFloors[`p${paramsFloor}`];
        const lastUpdate = currentFloor.pop();
        const login = currentFloor.pop();
        res.render('home', {
            currentFloor,
            lastUpdate,
            login,
            paramsFloor,
            cssPath: paths.cssPath,
            scriptsPath: paths.scriptsPath,
        });
    } else {
        res.render('start', {
            cssPath: paths.cssPath,
            scriptsPath: paths.scriptsPathStart,
        });
    }
});

app.post('/updateCarts', async (req, res) => {
    const userData = req.body;
    if (!userData || (userData.floor !== '1' && userData.floor !== '2' && userData.floor !== '3' && userData.floor !== '4')) {
        return
    }
    const separator = '------------------------------ \n';
    let bodyMsg = `${separator} \n-----P${userData.floor}-----\n`;
    const cartsOnFloors = await readJsonFile(paths.cartsOnFloors);
    const currentFloor = cartsOnFloors[`p${userData.floor}`];

    let totalCarts = 0;
    for (const cart of currentFloor) {
        cart.value = userData[`${cart.name}`] || '';
        bodyMsg += `${cart.name}: ${cart.value} \n`;
        if (cart.name !== 'Login' && cart.name !== 'Last Update') {
            totalCarts += Number(cart.value);
        }
    }

    bodyMsg += `Total: ${totalCarts} \n ${separator}`;
    cartsOnFloors[`p${userData.floor}`] = currentFloor;
    await writeJsonFile(paths.cartsOnFloors, cartsOnFloors);
    replaceFile();
    sendUpdateToChime(bodyMsg);
    res.sendStatus(200);
})

app.listen(3000);
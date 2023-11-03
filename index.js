import express from 'express';
import { middleware, obtainServices } from './utils.js'; 

const app = express();
const router = express.Router();
const { services } =  obtainServices();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.disable('https');

services.forEach(({ nameRoute, url }) => {
    router.use(`/${nameRoute}`, function(req, res, next) {
        middleware(req, next, `${url}`)
      }, function (req, res) {
        res.json(req.data)
      });
});


app.use('/', router);

app.listen(3000, () => {
    console.log("start application")
})

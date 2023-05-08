import cluster from 'cluster';
import Koa from 'koa';

import mongoose from "mongoose";
import CarritosDaoMongoDb from './daos/carritos/CarritosDaoMongoDb.js';
import CarritosDaoMemoria from './daos/carritos/CarritosDaoMemoria.js';
import ProductosDaoMongoDb from './daos/productos/ProductosDaoMongoDb.js';
import ProductosDaoMemoria from './daos/productos/ProductosDaoMemoria.js';
import Producto from './model/productSchema.js'
import Carrito from './model/carritoSchema.js'
import os from 'os';
import log4js from 'log4js'
import {persistencia} from './config/enviroment.js'
import send from 'koa-send';





//Creo una instancia de contenedor de Productos

export const productos = persistencia==="mongoDb"? new ProductosDaoMongoDb({name: "productos", model: Producto}): new ProductosDaoMemoria({name: "productos"});

//Creo una instancia de un contenedor de carritos

export const carrito = persistencia==="mongoDb"? new CarritosDaoMongoDb({name: "carrito", model: Carrito}): new CarritosDaoMemoria({name: "carrito"});

import './helpers/log4js.js'


import connectToDb from './config/mongoDbConfig.js';

import User from './model/userSchema.js';
import path from 'path';
import passport from 'passport';
import './config/passport.js';
import {signin, signinPassport} from './routes/signin.js';
import {loginPassport, login} from './routes/login.js';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import {mongoURL, mongoSecret} from './config/enviroment.js';
import {users} from './routes/signin.js';
import {index} from './routes/index.js';
import {enviarCorreoCompra} from './helpers/nodemailer.js'
import {enviarMensajeWhatsapp} from './helpers/sendMessages.js'

import {getCartById} from './routes/getCartById.js'
import {addCart} from './routes/addCart.js'
import {addProductToCart} from './routes/addProductToCart.js'
import {finalizarCompra} from './routes/finalizarCompra.js'
import {deleteProductById} from './routes/deleteProductById.js'
import {addProduct} from './routes/addProduct.js'


import Router from 'koa-router';
import bodyParser from 'koa-bodyparser'


connectToDb().then(()=>console.log("OK"))



const app = new Koa();

app.use(bodyParser());



// app.set('view engine', 'ejs');



// app.use(expressSession({
//     store: MongoStore.create({ mongoUrl: mongoURL }),
//     secret: mongoSecret,
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 60000
//     }
// }));

const productosRouter = new Router({prefix: '/api/productos'});

app.use(productosRouter.routes());















//Productos Router--------------------------------------------
productosRouter.get('/', async (ctx)=>{
    await send(ctx,'./public/api/productos/index.html')
})



//Agrega un producto al listado de productos
productosRouter.post('/', addProduct)

//Trae un producto determinado por un id enviado por url param.
productosRouter.get('/producto/:id', async ctx => {
    const id = ctx.request.params.id
   
    
    await productos.getById(id).then((data) => {
        
        ctx.body= data
    })
    
   
})

//Trae todos los productos 
productosRouter.get('/all', async (ctx) => {
    await productos.getAll()
    .then((data) => {
        
        ctx.body = data
    })
   
    
})

//Borra un elemento segun su id
productosRouter.delete('/producto/:id', async (ctx) => {
    const id = ctx.request.params.id
    await productos.deleteById(id)
    ctx.body = "Elemento borrado"
        
})

productosRouter.delete('/all', async (ctx) => {
    await productos.deleteAll()
    ctx.body ="coleccion vacia"
})
















const PORT = 8080;

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
   
            app.listen(PORT, ()=> console.log(`Listening in PORT ${PORT}`))

    
  }




export default app



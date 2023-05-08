import {users} from '../routes/signin.js'
import {productos, carrito} from '../index.js'


export const index = async (ctx)=>{
    
    if(ctx.req.session && ctx.req.session.passport){ 
        let products = []
        let user = {}
        let cart = {}
        productos.getAll()
            .then(productos=>{
                products = productos
                return users.getByUserName(req.session.username)
            .then(data=>{
                user=data                
                return carrito.getByName(req.session.username)
            .then(data=>{
                cart=data     
                console.log(cart, user)                         
                ctx.render('index', {array:products , user: user, cart: cart })
                })
            })
        })     
   
    
    } else {
        ctx.redirect('/login')
    }

}



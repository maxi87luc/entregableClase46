import {productos} from '../index.js'

export const addProduct = async (ctx) => {
    //agregar productos
    
    const productToAdd = ctx.request.body 
   
    await productos.save(productToAdd)
    ctx.redirect('/api/productos')
        
    
}
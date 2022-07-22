const  {infoApi} = require('./infoApi.js');
const {Product, Brand} = require('../db.js');

const fillDB = async ()=>{
    try{
        //comprobamos que la db este con datos  
        let checkDb = await Product.findAll()
        // si la db esta vacia vamos a llenarla con los datos de la api
        if(!checkDb.length){
            //nos traemos toda la info de la api
            const shoes = await infoApi()
            // console.log(shoes);


            //para asociar cada producto con la marca
            shoes.forEach(async product => {
                const productCreated = await Product.create(product)           

                const brandFound = await Brand.findOne({ where: { name: product.brand } })
                
                await productCreated.setBrand(brandFound.dataValues.id)

            })
            //inyectamos los datos a la db
        }
    } catch (error){
        throw error 
    }
}

const fillTableBrand = async () => {
    try {
        const brands = (await infoApi()).map(product => ({ name: product.brand }))
        await Brand.bulkCreate(brands)

    } catch (error) {
        throw error
    }
}


module.exports = { fillDB, fillTableBrand };
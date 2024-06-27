/**
 * customer controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::customer.customer', ({ strapi }) =>({
 async specialList(ctx) {
  try {
   const params = [...ctx.request.url.split('?')].slice(1)
   let idCustomer = 0;
   for (let item of params) {
    if (item.startsWith("customer=")) {
        idCustomer = +(item.split("=")[1]);
    }
   }
   if(idCustomer === 0) throw new Error('param customer is required!');
   
   const [productsResults, specialPricesResults, customerResults] = await Promise.all([
    await strapi.db.query("api::product.product").findMany(),
    await strapi.db.query("api::special-price.special-price").findMany({
     populate: {product: true, customer: true},
     where: {customer: idCustomer}
    }),
    await strapi.db.query("api::customer.customer").findOne({
      where: {id: idCustomer}
    })
   ]);
   
   const dataResponse: any[] = productsResults.map((item:any)=>{
    const found = specialPricesResults.find(({product}:{product:any})=>product.id===item.id)
    
    if(found){
     return {...item, specialPrice: found.price}
    }
    return {...item}
   })
   const CUSTOMER_NAME =customerResults?.name + ' '+ customerResults?.lastname
   return {data: dataResponse, customer: CUSTOMER_NAME}
   
   
 } catch (error) {
   ctx.response.status = 500;
   return { error, message: error.message }
 }
}
}));

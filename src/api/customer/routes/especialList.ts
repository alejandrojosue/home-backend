module.exports = {
 routes: [
     {
         method: 'GET',
         path: '/customer/specialList',
         handler: 'customer.specialList',
         config: {
            auth: false
         }
     }
 ]
}
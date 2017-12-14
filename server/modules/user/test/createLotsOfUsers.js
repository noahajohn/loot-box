// const path = require('path');
// const dataPath = path.join(__dirname, '..', 'schema.js');
// const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/loot-box');
// const db = mongoose.connection;
// const {User} = require(dataPath);

// // // async function createUsers() {
// //   let toCreate = [];
// //   for (let i = 0; i < 50000; i+=1) {
// //     const user = {
// //       user_name: 'user'+i,
// //       email: 'user'+i+'@null.net',
// //       mana: 0,
// //       google_id: i
// //     };
// //     toCreate.push(user);
// //   }

// // //   const res = await User.create(toCreate, {multi: true});
// // //   return res;
// // // }
// // // console.log(toCreate);
// // // throw 'done';
// // User.create(toCreate, (err, res) => {
// //   console.log(err, res);
// //   db.close(() => {
// //     console.log('done');
// //   });
// // });
// // // const res = createUsers();






// async function test() {
//   try {
//   const res = await mongoose.model('User').aggregate(pipeline).exec();
//   const ids = res.map((e) => {
//     return e._id;
//   });

//   const query = {
//     _id: {
//       $in: ids
//     }
//   };
//   const update = {
//     $inc: {
//       mana: 1
//     }
//   };
//   const res2 = await mongoose.model('User').update(query, update, {multi: true}).exec();
//   console.log(res2);
//   } catch(e) {
//     console.log(e);
//   }
// }

// test();

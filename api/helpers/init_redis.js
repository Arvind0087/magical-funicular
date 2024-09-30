// const redis = require('redis')

// const client = redis.createClient({
//   port: 6379,
//   host: '127.0.0.1',
// })

// // const client = redis.createClient({
// //     host: 'redis-18486.c264.ap-south-1-1.ec2.cloud.redislabs.com:18486',
// //     port: 6379,
// //     password: 'redis-18486.c264.ap-south-1-1.ec2.cloud.redislabs.com:18486'
// //   });


// client.on('connect', () => {
//   console.log('Client connected to redis')
// })

// // client.on('ready', () => {
// //   console.log('Client connected to redis and ready to use...')
// // })

// client.on('error', (err) => {
//   console.log(err.message)
// })

// client.on('end', () => {
//   console.log('Client disconnected from redis')
// })

// process.on('SIGINT', () => {
//   client.quit()
// })

// module.exports = client

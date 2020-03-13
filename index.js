const hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const mongoose = require('mongoose');
const mongo = require('./config/mongo');
/* eslint-disable no-console */

(async () => {
  const server = new hapi.server({
    port: process.env.PORT || 5000
  })

  const wsserver = new hapi.server({
    port: 9999
  })


  try {
    // Web Socket server
    await wsserver.register({
      plugin: require('@hapi/nes'),
      options: {
        onConnection: socket => {
          console.log(`Got a WS connection ${socket.id}`)
        },
        onDisconnection: socket => {
          console.log(`Client disconnected ${socket.id}`)
        }
      }
    })

    wsserver.subscription('/tag/{tag}', {
      onSubscribe: (socket, path) => {
        console.log(`${socket.id} subscribed to ${path}`)
      }
    })

    await wsserver.start()
    const notiEvents = require('./plugins/events/notiEvents')
    notiEvents.setWsServer(wsserver)

    // Web Server
    await server.register([
      require('./plugins/notifications/index'),
      require('./plugins/users/index')
    ],
    {
      routes: {
        prefix: '/api'
      }
    })

    const swaggerOptions = {
      info: {
        title: 'Notifications API Documentation',
        version: "1.0.0",
      },
      grouping: 'tags'
    }

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);

    // MongoDB Connection
    try {
      await mongoose
        .connect(mongo.configuration.getUri(process.env.NODE_ENV), {useNewUrlParser: true})
      console.log('MongoDB Connected...')
    } catch (err) {
      console.log(err)
    }

    server.start()
  } catch (err) {
    console.log(err)
  }
})()
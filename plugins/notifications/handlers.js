const Notifications = require('./models/notifications.model')
const boom = require('@hapi/boom')
const notiEvents = require('../events/notiEvents')
const schedule = require('node-schedule')

exports.getNotifications = async (req, h) => {
  try {
    const notifications = await Notifications.find()
    return h.response(notifications)
  } catch (err) {
    throw boom.boomify(err, { statusCode: 400 })
  }
}

exports.getNotificationsByTag = async (req, h) => {
  try {
    const tag = req.payload.tag
    const notifications = await Notifications.find(tag)
    return h.response(notifications)
  } catch (err) {
    throw boom.boomify(err, { statusCode: 400 })
  }
}

exports.postNotifications = async (req, h) => {
  try {
    const notifications = new Notifications(req.payload)
    notifications.tag = req.params.tag

    notiEvents.emit('SEND_NOTIFICATION', req.params.tag, {
      title: req.payload.title,
      description: req.payload.description
    })

    const result = await notifications.save()
    return h.response(result).code(201)
  } catch (err) {
    throw boom.boomify(err, { statusCode: 400 })
  }
}

exports.postScheduledNotifications = async (req, h) => {
  try {
    const notifications = new Notifications(req.payload)
    schedule.scheduleJob(req.payload.schedule, () => {
      notiEvents.emit('SEND_NOTIFICATION', req.params.tag, {
        title: req.payload.title,
        description: req.payload.description
      })
    })
    const result = await notifications.save()
    return h.response(result).code(201)
  } catch (err) {
    throw boom.boomify(err, { statusCode: 400 })
  }
}
const mongoose = require('mongoose')
const schema = mongoose.Schema

const design = new schema({
  email: {
      type: 'String',
      required:[true, 'email required'],
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  createdAt: {
      type:Date,
      default : new Date()
  },
  design:{
      type: 'String',
      required:[true, 'design missing']
  },
  category: {
  type: 'String',
  required:[true, 'category missing']
  },
  tags: ['String']
})

module.exports = mongoose.model('Design',design)
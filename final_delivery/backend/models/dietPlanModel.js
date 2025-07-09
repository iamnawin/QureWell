const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dietPlanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  meals: [{
    name: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    foods: [{
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
      calories: {
        type: Number,
        required: true
      }
    }]
  }],
  totalCalories: {
    type: Number,
    required: true
  },
  restrictions: [{
    type: String
  }],
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
dietPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);

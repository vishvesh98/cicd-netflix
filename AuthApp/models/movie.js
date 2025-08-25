const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link:{
        type: String,
    
    },
    genre: String,
    year: Number,
    rating: Number,
    description: String,
    // Add other movie fields as needed
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
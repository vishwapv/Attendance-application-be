const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TestSeriesSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    teacher_id: {
        type: String,
        required: true
    },
    test_series_name: {
        type: String,
        required: true
    },
    test_series_code: {
        type: String
    },
    tests: [
        {
            test_no: Number,
            test_label: Number,
            test_title: String,
            test_subject: String,
            test_chapterno: String,
            test_chaptername: String,
            test_code: String
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
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


module.exports = TestSeries = mongoose.model("test_series", TestSeriesSchema);
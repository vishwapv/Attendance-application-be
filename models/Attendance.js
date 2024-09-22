const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Attendance Schema
const AttendanceSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'createuser',  // Referencing the CreateUser schema
        required: true
    },
    date: {
        type: Date,
        // default: Date.now,
        required: true
    },
    status: {
        type: Boolean, // true for Present, false for Absent
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
AttendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });
module.exports = Attendance = mongoose.model('Attendance', AttendanceSchema);

// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    progress: {
        type: Object,
        default: {
            "Array Introduction": {
                arrayCreate: false
            },
            "Array Sorting": {  // ✅ fixed here
                bubbleSort: false,
                insertionSort: false,
                selectionSort: false,
                mergeSort: false     // ✅ add this too if you are tracking Merge Sort
            },
            "Array Search": {
                linearSearch: false,
                binarySearch: false
            },
            "Array Update": {
                updateInsert: false,
                updateDelete: false,
                updateModify: false
            },
            "Vector Introduction": {
                vectorIntro1: false,
                vectorIntro2: false
            },
            "Vector Basic Operations": {
                pushBack: false,
                popBack: false,
                frontBack: false
            },
            "Vector Sort": {
                vectorBubble: false,
                vectorSTLSort: false
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

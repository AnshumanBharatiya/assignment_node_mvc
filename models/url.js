const mongoose = require('mongoose');
const autoIncrementId = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const urlSchema = new mongoose.Schema(
    {
        user_id : {
            type: Number,
            unique: true
        },
        user_name : {
            type : String,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
        },
        role_name : {
            type : String,
            required : true,
        }
    },
    {timestamps : true}
);

// Apply the auto-increment plugin to user_id field
urlSchema.plugin(autoIncrementId, {inc_field: 'user_id'});

// // Pre-save middleware to hash password before saving
// urlSchema.pre('save', async function (next) {
//     if (this.isModified('password') || this.isNew) {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             this.password = await bcrypt.hash(this.password, salt);
//             next();
//         } catch (err) {
//             next(err);
//         }
//     } else {
//         next();
//     }
// });

// // Pre-save middleware to hash password before saving
urlSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            // Check if the password is already hashed
            const rounds = await bcrypt.getRounds(this.password);
            if (rounds) {
                return next();
            }

            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('Hashed Password:', this.password); // Debugging statement
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});


const URL = mongoose.model("user_master", urlSchema);
module.exports = URL;
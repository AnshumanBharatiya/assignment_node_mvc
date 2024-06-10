const bcrypt = require('bcrypt');
const URL = require('../models/url');

async function handelForm(req, res){
    const reqForm = req.params.formType;
    // const allUrls = await URL.find();
    res.render('form',{
        formType : reqForm,
    });

}



async function handelRegister(req, res){

    try{
        const formData = req.body;

        if(!formData.username || !formData.password || !formData.radio_){
            res.render('form',{
                formType:"register",
                message : "Please fill all the fields"
            });
            return;
        }else{
           
            const username = formData.username.trim();
            const password = formData.password.trim();
            // console.log(password);
            const hashedPassword = await bcrypt.hash(password, 10);
            // console.log(hashedPassword);


            let result = await URL.create({
                user_name:username,
                password:hashedPassword,
                role_name:formData.radio_,
            });
    
            if(result){
                res.render('form',{
                    formType:"register",
                    message : 'Successfully Registered',
                });
                return;
            }else{
                res.render('form',{
                    formType:"register",
                    message : 'Registered Failed',
                });
                return;

            }
           
        }
    }catch(err){
        res.render('form',{
            formType:"register",
            message : err
        });
        return;
    }
   
}


async function handelLogin(req, res){

    try{
        const formData = req.body;

        if(!formData.username || !formData.password){
            res.render('form',{
                formType: "login",
                message : "Please enter the username and password"
            });
            return;
        }else{
            // Find the user by username
            const user = await URL.findOne({ user_name: formData.username });

            if (!user) {
                res.render('form', {
                    formType: "login",
                    message: "Invalid username"
                });
                return;
            }

            let password = user.password;
            // Compare the hashed password with the provided password
            // const isMatch = await bcrypt.compare(formData.password.trim(), user.password);

            const isMatch = await bcrypt.compare(formData.password.trim(), user.password);


            // console.log(isMatch);
            if (!isMatch) {
                res.render('form', {
                    formType: "login",
                    message: "Invalid password"
                });
                return;
            }

            // If the password matches, log the user in
            // res.render('history', {
            //     userType: user.role_name,
            //     message: "Successfully Logged In"
            // });
            // If the password matches, redirect to the history page with parameters
            res.redirect(`/url/display-user/${user.role_name}/Successfully%20Logged%20In`);



        }
    }catch(err){
        res.render('form',{
            formType:"login",
            message : err
        });
        return;
    }
}



async function handelDisplayForm(req, res){

    const userType = req.params.userType;
    const message = req.params.message;
    try{
        const result = await URL.find({role_name:userType});

        // console.log(result);
        res.render('history',{
            result:result,
            userType:userType,
            message : message
        });
        return;

       
    }catch(err){
        res.render('history',{
            userType:userType,
            message : err
        });
        return;
    }
}


module.exports = {
    handelForm,
    handelLogin,
    handelRegister,
    handelDisplayForm,
}
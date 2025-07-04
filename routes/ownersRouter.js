const express = require('express');
const router = express.Router(); // Correctly initializing the router
const ownerModel = require('../models/owners-model'); // Adjust the path according to where your model file is


if(process.env.NODE_ENV === "development"){
    router.post("/create", async function (req, res){
        let owners = await ownerModel.find();
        if(owners.length > 0 ) {
         return res.status(503).send("You don't have permission to create a new owner")
        }
        let {fullname,email,password } = req.body;
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send("createdOwner");
    });
}


router.get("/", function (req, res){
    res.send("hello its working");
});



module.exports = router;
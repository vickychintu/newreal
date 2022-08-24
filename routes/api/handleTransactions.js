/*This file is used to handel transactions through external paymenmt gatways and update the transactiuons DB based on the payment.
    Created By: Subramanian K - 24/1/2022
*/

//Dependencies
const express = require("express");
const router = express.Router();

var transactionDetails; //object to store transaction details fetched from the checkout page.

/*
This function is used to verfy,validate payment 
*/
var transactionSignatureVerification = (paymentRecipt) => {
  /*
            -generate a signature with th orderId
            -verify the signature with paymentgates signature from the checkout page of the payment gateway.
            -if the signature matches return (true,status) else return (false,status).
        */
};

/*
    function to update the transaction DB 
*/
var updateTransactionDB = (transactionDetails) => {
  /*
        -Update the database with the transaction details fetched  from the Gateway checkout page 
        */
};

//Create an API to processing and storing transactions
router.post("/", (req, res) => {});

//Export the API route
module.exports = router;

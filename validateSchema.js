const Joi = require('joi');

module.exports.listingSchema = Joi.object({      // listing schema madhe kaya kay pahije te
     newPlace: Joi.object({     // req.body madhe newPlace object pahijech(required)
          title: Joi.string().required(),  // new place madhe title pahijech(requred) , tyacha type string pahijech
          description : Joi.string().required(), // new place madhe description pahijech(requred) , tyacha type string pahijech
          price : Joi.number().required().min(1),  // new place madhe price pahijech(requred) , tyacha type number pahijech
          country : Joi.string().required(), // new place madhe country pahijech(requred) , tyacha type string pahijech
          location : Joi.string().required(), // new place madhe location pahijech(requred) , tyacha type string pahijech
          image : Joi.string().allow("")
     }).required()  
});

module.exports.reviewSchema = Joi.object({
     review: Joi.object({
            rating: Joi.number().required().min(3).max(5),
            comment: Joi.string().required()
     }).required()
});
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  dat: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string().default("listingimage"),
      url: Joi.string().uri().default("https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
    }).default({
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }),
    date: Joi.date().optional(),
  }).required(),
});

 

  module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    
    }).required(),
  });
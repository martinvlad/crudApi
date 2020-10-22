const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');
const router = express.Router();


const db = monk(process.env.MONGO_URI)

const faqs = db.get('faq');
const schema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    video_url: Joi.string().uri(),
    created_at: Date.now()
})

router.get('/', async (req,res, next)=>{
    try{
        const items = await faqs.find({});
        res.json(items)
    }
    catch(error){
next(error);
    }
})
router.get('/:id', async (req,res, next)=>{
    try{
        const id = req.params.id
        const item = await faqs.findOne({
            _id: id,
        })
        if(!item) return next();
        return res.json(item)
    }
    catch(error){
        next(error)
    }
})

router.post('/', async (req,res, next)=>{
    try{
        
        const value = await schema.validateAsync(req.body)
        const inserted = await faqs.insert(value);
        res.json(inserted)
    }
    catch(error){
        return next(error);
    }
})

router.put('/:id', async (req,res, next)=>{
    try{
        const id = req.params.id;
        const value = await schema.validateAsync(req.body)
        const item = await faqs.findOne({
            _id: id,
        })
        if(!item) return next();
        const updated = await faqs.update({
            _id: id
        },{
            $set: value
        });

        res.json(value)
    }
    catch(error){
        return next(error);
    }
})
router.delete('/:id', async(req,res, next)=>{
    try{
        const id = req.params.id;
        
        const item = await faqs.findOne({
            _id: id,
        })
        if(!item) return next();
        const deleted = await faqs.remove({
            _id: id
        })
        res.json({
            message: 'Success! Message was deleted'
        })
    }
    catch(error){
        next(error)
    }
})

module.exports = router;
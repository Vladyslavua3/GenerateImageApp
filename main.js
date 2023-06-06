import express from 'express'
import {engine} from "express-handlebars";
import config from 'config'
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: config.get('OPENAI_KEY'),
});


const openai = new OpenAIApi(configuration);


const app = express()

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./views')
app.use(express.urlencoded({extended:true}))

app.get('/', (_,res) => {
    res.render('index')
})

app.post('/',async (req,res)=>{
    const prompt = req.body.prompt
    const number = req.body.number ?? 1
    const size = req.body.size ?? "512x512"

    try{
       const response = await openai.createImage({
           prompt,
           size,
           n:Number(number),
       })

        console.log(response.data.data)
        res.render('index',{
            images:response.data.data
        })
    }catch (e) {
            res.render('index',{
                error:e.message,
            })
        console.log(e)
    }

})

app.listen(3000,()=>console.log('Server started...'))
const express = require('express');
const cors = require('cors')
const app = express();

const {getCollections, getUserCards, createCollectionWithCards, getCollectionsFromContract, getUserCardsByCollection, mintCard} = require('./api')

app.use(express.json());
app.use(cors());

app.use((req,res,next) => {
    console.log(req.url);
    next();
});

// api
app.get('/getCollections', getCollections); 
app.post('/mintCard', mintCard);
app.get('/getUserCardsByCollection/:collectionId/:user', getUserCardsByCollection);
app.get('/getCollectionsFromContract', getCollectionsFromContract); 
app.post('/createCollection', createCollectionWithCards); 
app.get('/getUserCards/:user', getUserCards); 

var port = process.env.PORT || 3001 ;

app.listen(port, console.log(`Serveur écoute sur le port ${port}`) )

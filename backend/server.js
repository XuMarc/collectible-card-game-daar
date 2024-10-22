const express = require('express');
const cors = require('cors')
const app = express();

const {getCollections, getCollectionById, createCollectionWithCards, getCollectionsFromContract, getCards, getCardById, getCollectionsWithCards, getUserCardsByCollection, getCardsByCollection, mintCard, initCollections} = require('./api')

app.use(express.json());
app.use(cors());

//debug
app.use((req,res,next) => {
    console.log(req.url);
    next();
});

// Create some collection from TCG pokémkon api
// initCollections();


// api
app.get('/getCollections', getCollections);
app.get('/getCollection/:id', getCollectionById);

app.get('/getCards', getCards);
app.get('/getCard/:id', getCardById); 

app.get('/getCardsByCollection/:id', getCardsByCollection); // Ajoute cette nouvelle route


// Ajoute la route pour le mint dans server.js
app.post('/mintCard', mintCard);

// app.get('/getUsers', getUsers);
// app.get('/getUserCards/:id', getUserCards);


// Ajoute cette nouvelle route dans server.js
app.get('/getUserCardsByCollection/:collectionId/:user', getUserCardsByCollection);
// Route pour obtenir les collections avec cartes
app.get('/getCollectionsWithCards', getCollectionsWithCards);

app.get('/getCollectionsFromContract', getCollectionsFromContract);
app.post('/createCollection', createCollectionWithCards);


var port = process.env.PORT || 3001 ;

app.listen(port, console.log(`Serveur écoute sur le port ${port}`) )
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./db');

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

function query(request, data) {
    return new Promise((resolve, reject) => {
        db.query(request, (data || []), (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/*//MOCK = DONNEE DE TEST
const cars = [
    { id: 1, brand: 'Peugeot', model: 508 },
    { id: 2, brand: 'Audi', model: 'A4' },
    { id: 3, brand: 'Citroen', model: 'Berlingo' },
    { id: 4, brand: 'Opel', model: 'Astra' },
    { id: 5, brand: 'Toyota', model: 'Yaris' }
];
*/
// Récuperer les voitures 
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await query('Select * from car');
        res.json(cars);
    } catch (e) {
        res.status(400).json({ error: 'Impossible to get cars' });
    }
});

//Récuperer une voiture
// :id = paramètre dynamique
// req.params, req.body, req.query
app.get('/api/cars/:id', function (req, res) {
    /*const id = parseInt(req.params.id, 10);
    console.log(id);*/
    const id = req.params.id;

    db.query('Select * from car where id = ?', [id], function (error, result) {
        if (error) {
            return res.status(400).json({ error: 'Impossible to get the current car.' });
        }

        const car = result.shift();

        if (car) {
            return res.json(car);
        }

        res.status(404).json({ error: 'Car not found !' });
    });


    /* // Chercher un élément dans le tableau (find)
     const car = cars.find(function (car) {
         return car.id == id;
     });
     if (car != undefined) {
         res.json(car);
     } else {
         res.status(404).json({ Error: 'Car not found !' });
     }*/
});

// Supprimer une voiture
app.delete('/api/cars/:id', function (req, res) {
    const id = req.params.id;

    // db.query('delete from car where id = ?', [id], function(error, result){
    db.query('delete from car where id = ?', [id], (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Impossible to remove the current car.' });
        }

        if (result.affectedRows > 0) {
            return res.status(204).send();
        }

        return res.status(404).json({ error: 'Car not found ! ' });
    });

    /*const index = cars.findIndex(function (car) {
        return car.id == id;
    });
    if (index === -1) {
        res.status(404).json({ Error: 'Car not found !' });
    } else {
        cars.splice(index, 1);
        res.status(204).send();
    }*/
});

// Créer une voiture
app.post('/api/cars', function (req, res) {
    const data = req.body;  // Recupération des données

    db.query('Insert into car (brand, model) values (?, ?)', [data.brand, data.model], (error, result) => {
        if (error) {
            return res.status(400).json({ error: 'Impossible to save the car.' });
        }

        const id = result.insertId;

        db.query('Select * from car where id = ?', [id], function (error, result) {
            if (error) {
                return res.status(400).json({ error: 'Impossible to get the car.' });
            }

            const car = result.shift();

            if (car) {
                return res.json(car);
            }

            res.status(404).json({ error: 'Car not found !' });
        });
    });

    /*const newId = cars.reduce(function (acc, c) {
        // opérateur ternaire
        // Recherche de l'id le plus haut, +1
        acc = acc < c.id ? c.id : acc;
        return acc;
    }, 0) + 1;
    data.id = newId; // initialisation de l'id
    cars.push(data); // ajout dans la fin du tableau

    res.json(data);
    */
});

//Modification voiture
app.post('/api/cars/:id', function (req, res) {
    const id = req.params.id; // Récuperer l'id
    const { brand, model } = req.body; // Récupérer les infos à mettre à jour

    db.query('Select * from car where id = ?', [id], function (error, result) {
        if (error) {
            return res.status(400).json({ error: 'Impossible to update the current car.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Car can\'t be found.' });
        }

        const car = result[0];
        car.brand = brand;
        car.model = model;

        db.query('Update car set brand = ?, model = ? where id = ?', [car.brand, car.model, car.id], function (error, result) {
            if (error) {
                return res.status(400).json({ error: 'Impossible to update the current car.' });
            }

            res.json(car);
        });
    });



    /*const car = cars.find(function(c){
        return c.id == id;
    }); // Récuperer la voiture dans le tableau
    
        if(car === undefined){
            res.status(404).json({ error : 'car not found !' });
        }
        car.brand = brand; // Venir mettre à jour les infos de la voiture
        car.model = model;
    
        res.status(200).json(car) // Renvoyer un JSON avec les nouvelles infos de la voiture
    });
    */
});

app.listen(port, function () {
    console.log('Server started :' + port);
});
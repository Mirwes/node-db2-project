// DO YOUR MAGIC
const express = require('express');
const knex = require('knex');
const configOptions = require('../knexfile').development;

const db = knex(configOptions);

const router = express.Router();

router.get('/', (req, res) => {
    db('cars').then(cars => {
        res.status(200).json(cars);
    }).catch(err => {
        res.status(500).json({ message: 'Unable to retrieve cars data.' });
    })
});

router.get('/:id', validateCarId, (req, res) => {
    res.status(200).json(req.car);
});

router.post('/', validateCar, (req, res) => {
    db('cars').insert(req.body).then(ids => {
        getByID(ids[0]).then(cars => {
            res.status(201).json(cars[0]);
        }).catch(err => {
            res.status(500).json({ error: 'Unable to retrieve the car that was just added.\nCheck inventory to ensure it was added correctly.' });
        });
    }).catch(err => {
        res.status(500).json({ message: 'Unable to add the vehicle to the database.' });
    });
});

router.put('/:id', validatePut, validateCarId, (req, res) => {
    db('cars').where({ id: req.params.id }).update(req.body).then(numChanged => {
        getByID(req.params.id).then(cars => {
            res.status(200).json(cars[0]);
        }).catch(err => {
            res.status(500).json({ error: 'Unable to retrieve the car that was just updated.\nCheck inventory to ensure it was updated correctly.' });
        });
    }).catch(err => {
        res.status(500).json({ error: 'Unable to update car.' });
    });
});

router.delete('/:id', validateCarId, (req, res) => {
    db('cars').where({ id: req.params.id }).del().then(numDeleted => {
        res.status(200).json(req.car);
    }).catch(err => {
        res.status(500).json({ error: 'Unable to delete car.' });
    });
});

function getByID(id) {
    return db('cars').where({ id: id });
}

function validateCarId(req, res, next) {
    getByID(req.params.id).then(car => {
        if (!car) {
            res.status(400).json({ message: "invalid car id" });
        } else {
        req.car = car;
        next();
        }
    }).catch(err => {
        errorHandler(err, 500, "The car's information could not be retrieved.");
    });
}

function validateCar(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing car data" });
    } else if (!req.body.vin || !req.body.make || !req.body.model || !req.body.mileage) {
        res.status(400).json({ message: "Please include vin, make, model and mileage fields." });
    } else {
        next();
    }
}

function validatePut(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing car data. Nothing to update." });
        //check that at least one of the fields is included in the body.
    } else if (req.body.vin || req.body.make || req.body.model || req.body.mileage || req.body.transmission || req.body.titlestatus) {
        next();
    } else {
        res.status(400).json({ message: "Please include vin, make, model, mileage, transmission or title status fields.\nNothing to update." });
    }
}

module.exports = router;
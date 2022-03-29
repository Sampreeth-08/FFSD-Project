const mongoose = require('mongoose');

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://admin:celestial@celestialcluster.tptmt.mongodb.net/CelestialDB?retryWrites=true&w=majority")
            .then(() => {
                console.log("Database connection successful")
            })
            .catch((err) => {
                console.log("Database connection error" + err)
            })
    }
}

module.exports = new Database();
const mongoose = require('mongoose');

const dbConection = async () => {
    try {

        await mongoose.connect(process.env.BD_CNN, {

        });

        console.log('Base de datos online')

    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    dbConection
}
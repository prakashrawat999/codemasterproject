const mongoose = require('mongoose');
const chalk = require("chalk");


mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(chalk.green.inverse(`Database Connection Successful 👍 ${mongoose.connect}`));
}).catch((err) => console.log(chalk.red.inverse(err)));


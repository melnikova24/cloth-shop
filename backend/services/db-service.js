import mongoose from "mongoose";

const dbService = async () =>  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((e) => {
    console.log('Подключение к базе данных прошло успешно')
}).catch((err) => {
    console.log(err.message)
})

export { dbService }
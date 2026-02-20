const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://arsrauba_db_user:1111@xhfia7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db('BSTU');

        await db.collection('faculty').deleteMany({});
        await db.collection('pulpit').deleteMany({});

        await db.collection('faculty').insertMany([
            { faculty: "ИТ", faculty_name: "Информационных технологий" },
            { faculty: "ИЗ", faculty_name: "Инженерно-экономический" }
        ]);

        await db.collection('pulpit').insertMany([
            { pulpit: "ИСиТ", pulpit_name: "Информационных систем и технологий", faculty: "ИТ" },
            { pulpit: "ПИ", pulpit_name: "Программная инженерия", faculty: "ИТ" }
        ]);

        console.log("MongoDB Atlas: данные успешно добавлены");
    } finally {
        await client.close();
    }
}

run().catch(console.error);
const { MongoClient } = require('mongodb');

const url =
  'mongodb+srv://admin:admin@cluster0.edkcm.mongodb.net/main_db?retryWrites=true&w=majority';
const client = new MongoClient(url, { useUnifiedTopology: true });

const dbName = 'main_db';

async function run() {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Use the collection "users"
    const col = db.collection('users'); //If the collection doesnt match any in the cloud, it will create the collection.
    //console.log('clg col', col)

    // Construct a document
    let personDocument = {
      name: { first: 'Alan', last: 'Turing' },
      birth: new Date(1912, 5, 23), // June 23, 1912
      death: new Date(1954, 5, 7), // June 7, 1954
      contribs: ['Turing machine', 'Turing test', 'Turingery'],
      views: 1250000,
    };

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(personDocument);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

exports.run = run;

run().catch(console.dir);

// function getAllFuncs(toCheck) {
//     var props = [];
//     var obj = toCheck;
//     do {
//       props = props.concat(Object.getOwnPropertyNames(obj));
//     } while ((obj = Object.getPrototypeOf(obj)));

//     return props.sort().filter(function (e, i, arr) {
//       if (e != arr[i + 1] && typeof toCheck[e] == "function") return true;
//     });
// }
// console.log(getAllFuncs(client));

function addUser(email, passwordHash, firstName, lastName, phoneNumber) {
  return `Hello!`;
}
exports.addUser = addUser;

async function getUserByEmail(email) {
  return `Hello!`;
}
exports.getUserByEmail = getUserByEmail;

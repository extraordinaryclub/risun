const { MongoClient, ObjectId } = require('mongodb');  // No need to import ObjectId

const uri = process.env.MONGODB_URI || 'mongodb+srv://daniyashm2022:JM3tLZuAg8pHbXdc@organizations.khdfp.mongodb.net/?retryWrites=true&w=majority&appName=organizations';
let client;

async function dbconnection() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    }
    return client.db('risun');
}

async function fetchData(email) {
    const db = await dbconnection();
    const result = await db.collection('organizations').findOne({ email });
    return result;
}

async function insertData({ organizationName, email, password, location }) {
    const db = await dbconnection();
    const result = await db.collection('organizations').insertOne({
        organization_name: organizationName,
        email,
        password,
        location
    });
    return result;
}

async function fetchDataByEmailAndOrganization(email, organizationName) {
    const db = await dbconnection();
    const result = await db.collection('organizations').findOne({
        email,
        organization_name: organizationName
    }, { projection: { email: 1, organization_name: 1, password: 1 } });
    return result;
}

async function fetchOrganizationIdByEmail(email) {
    const db = await dbconnection();
    const organization = await db.collection('organizations').findOne({ email }, { projection: { _id: 1 } });
    if (!organization) {
        throw new Error('No organization found for the given email.');
    }
    return organization._id; // Return the MongoDB _id field as organization_id
}

async function insertLocation({ organization_id, location_name, latitude, longitude }) {
    const db = await dbconnection();
    const result = await db.collection('locations').insertOne({
        organization_id: new ObjectId(organization_id),  // Use the ObjectId constructor from the MongoClient instance
        location_name,
        latitude,
        longitude
    });
    return result;
}

async function fetchLocationsByOrganizationId(organization_id) {
    const db = await dbconnection();
    const locations = await db.collection('locations').find({
        organization_id: new ObjectId(organization_id)  // Same here
    }, { projection: { id: 1, location_name: 1, latitude: 1, longitude: 1 } }).toArray();
    return locations;
}

async function deleteLocationByName(location_name, organization_id) {
    const db = await dbconnection();
    const result = await db.collection('locations').deleteOne({
        location_name,
        organization_id: new ObjectId(organization_id)  // Same here
    });
    return result;
}

module.exports = {
    fetchData,
    insertData,
    fetchDataByEmailAndOrganization,
    insertLocation,
    fetchOrganizationIdByEmail,
    fetchLocationsByOrganizationId,
    deleteLocationByName
};



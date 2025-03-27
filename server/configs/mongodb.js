import mongoose from "mongoose";

const connectToMongoDB = async () => {
     // Connection successful
     mongoose.connection.on('connected', () => {
        console.log('DB connected successfully');
    });

    // Connection error
    mongoose.connection.on('error', (error) => {
        console.error(`Error in DB connection: ${error.message}`);
    });

    // Disconnected
    mongoose.connection.on('disconnected', () => {
        console.log('DB disconnected');
    });

    try {
        // Connect to the database using the URL stored in your environment variables
        await mongoose.connect(`${process.env.MONGODB_URL}/lms`);
    } catch (error) {
        console.error('Error during DB connection:', error.message);
    }
}
export default connectToMongoDB
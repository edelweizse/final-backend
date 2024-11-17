import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
import mongoose from 'mongoose';

const passwords = [
  'lS0Mf7SBxJrNbLyW',
  'lSOMf7SBxJrNbLyW',
  'iSoMf7SBxJrNbLyW',
  'ISOMf7SBxJrNbLyW'
];

for (const pwd of passwords) {
  const uri = `mongodb+srv://sejal:${pwd}@cluster0.80lbnpr.mongodb.net/bajaj%20sejal?retryWrites=true&w=majority`;
  try {
    console.log(`Connecting with password: ${pwd}`);
    await mongoose.connect(uri);
    console.log(`SUCCESS! Connected successfully!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
  }
}
process.exit(1);

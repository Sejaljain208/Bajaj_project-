import serverless from 'serverless-http';
import app, { connectDB } from '../../backend/server.js';

// Mark environment as Netlify
process.env.NETLIFY = 'true';

const serverlessHandler = serverless(app, {
  basePath: '/.netlify/functions/api'
});

export const handler = async (event, context) => {
  // Prevent Mongoose connection pool from hanging the function execution
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Ensure database is connected before processing the request
    await connectDB();
  } catch (err) {
    console.error('Database connection failed in Netlify Function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database connection failed' })
    };
  }

  // Handle the request through Express
  return await serverlessHandler(event, context);
};

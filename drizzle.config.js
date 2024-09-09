/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:0niIFORTqYX1@ep-withered-bonus-a5nrj78y.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
  };
  
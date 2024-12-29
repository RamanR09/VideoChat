import { Client, Databases } from "appwrite";

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67702e40002cbdb45046"); // Replace with your Appwrite project ID

// Initialize Appwrite database
const databases = new Databases(client);

export { client, databases };

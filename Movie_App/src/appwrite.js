import { Client, Databases, ID } from "appwrite";


// Storing appwrite ids here
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // 1. Use Appwrite API to check if a search term exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal('searchTerm', searchTerm),
        ])
        // 2. If it does exist, update the count
        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count : doc.count + 1,
            })
        // 3. If it doesn't, create a new document with the search term and count as 1
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            } )
        }
    } catch(error) {
        console.error(error)
    }
    
}
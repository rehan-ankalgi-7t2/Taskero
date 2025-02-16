import { DB_ID, TODO_COLLECTION_ID } from '@/constants/dbConstants';
import { Client, Account, ID, Databases } from 'react-native-appwrite';

const appwriteClient = new Client()
    .setProject('67acee94003bc8f1ddcc')
    .setEndpoint('https://cloud.appwrite.io/v1')

const account = new Account(appwriteClient);
const databases = new Databases(appwriteClient);

export { appwriteClient, account, databases };
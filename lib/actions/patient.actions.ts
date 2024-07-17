'use server';

import { ID, Query } from 'node-appwrite';
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from '../appwrite.config';
import { pareseStringify } from '../utils';
import { InputFile } from 'node-appwrite/file';

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log({ newUser });

    return pareseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])]);

      return documents?.users[0];
    }
  }
};

// GET USER BY ID
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return pareseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisteruserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocument: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      }
    )
    return pareseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};

// GET PATIENT BY ID
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    return pareseStringify(patients.documents[0]);

  } catch (error) {
    console.log(error);
  }
};

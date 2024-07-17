'use server';

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { pareseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )
        return pareseStringify(newAppointment);

    } catch (error) {
        console.log(error);
    }
}
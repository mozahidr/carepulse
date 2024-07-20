'use server';

import { ID, Query } from 'node-appwrite';
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';
import { pareseStringify } from '../utils';
import { Appointment } from '@/types/appwrite.types';
import { revalidatePath } from 'next/cache';

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return pareseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

// Get appointment
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return pareseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

// Get appointment list
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (accumulator, appointment) => {
        if (appointment.status === 'scheduled') {
          accumulator.scheduledCount += 1;
        } else if (appointment.status === 'pending') {
          accumulator.pendingCount += 1;
        } else if (appointment.status === 'cancelled') {
          accumulator.cancelledCount += 1;
        }

        return accumulator;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return pareseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

// Update appointment
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment) {
            throw new Error('Appointment not found');
        }

        // TODO SMS notification
        revalidatePath('/admin');
        return pareseStringify(updatedAppointment);
    } catch (error) {
        console.log(error);
    }
};

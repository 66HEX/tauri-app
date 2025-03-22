// Type definitions for the application

// Appointment types
export interface ApiAppointment {
  id: string;
  client_id: string;
  trainer_id: string;
  client_name: string;
  trainer_name: string;
  type_: 'consultation' | 'training' | 'assessment' | 'check-in';
  appointment_date: string;
  start_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  location: string;
  created_at: string;
  updated_at: string;
}

// Appointment type for the UI (matches the current component implementation)
export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: string;
  type: 'consultation' | 'training' | 'assessment' | 'check-in';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  location: string;
  trainerId?: string;
  trainerName?: string;
}

// Function to convert API appointment to UI appointment
export const mapApiAppointmentToAppointment = (apiAppointment: ApiAppointment): Appointment => {
  return {
    id: apiAppointment.id,
    clientName: apiAppointment.client_name,
    date: apiAppointment.appointment_date,
    time: apiAppointment.start_time,
    duration: `${apiAppointment.duration_minutes} min`,
    // Use the type_ field from the API
    type: apiAppointment.type_,
    status: apiAppointment.status,
    // Use the location field from the API
    location: apiAppointment.location,
    trainerId: apiAppointment.trainer_id,
    trainerName: apiAppointment.trainer_name
  };
};
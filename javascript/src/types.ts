export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface DocumentUpload {
    /** Base64-encoded file content. Max 10 MB per file. */
    content: string;
    /** Original file name with extension. Allowed: pdf, jpg, jpeg, png. */
    fileName: string;
}

export interface PlaceOrderRequest {
    orderType: string;
    isVip?: boolean;
    isPostpaid?: boolean;
    referenceId?: string;
    linkOrderId?: number;
    packageIds?: string[];
    testIds?: string[];
    /** Appointment date-time, ISO 8601 format. */
    appointment: string;
    labId?: number;
    notes?: string;
    isPaymentRequired?: boolean;
    isSlotPreconfirmed?: boolean;
    uniqueId?: string;
    name: string;
    email: string;
    dateOfBirth?: string;
    age?: number;
    gender: Gender;
    mobile: string;
    altContact?: string;
    mainUserUniqueId?: string;
    relationship?: string;
    unitFloorBuilding?: string;
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
}

export interface PlaceCampOrderRequest {
    campLsId: string;
    isVip?: boolean;
    referenceId?: string;
    packageIds?: string[];
    testIds?: string[];
    appointment: string;
    notes?: string;
    uniqueId?: string;
    name: string;
    email: string;
    dateOfBirth?: string;
    age?: number;
    gender: Gender;
    mobile: string;
    altContact?: string;
    mainUserUniqueId?: string;
    relationship?: string;
}

export interface BookAppointmentRequest {
    lsProviderId?: string;
    lsGroupId?: string;
    lsProcedureId?: string;
    preferredGender?: Gender;
    appointmentType: string;
    referenceId?: string;
    appointment: string;
    notes?: string;
    uniqueId?: string;
    name: string;
    email: string;
    mobile: string;
    altContact?: string;
    dateOfBirth?: string;
    age?: number;
    gender: Gender;
    mainUserUniqueId?: string;
    relationship?: string;
    unitFloorBuilding?: string;
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    meetingType?: string;
    isPaymentRequired?: boolean;
    paymentAmount?: number;
    isFollowUp?: boolean;
    previousAppointmentId?: number;
}

export interface EscalationRequest {
    complaint: string;
    severity: string;
    description?: string;
    notes?: string;
}

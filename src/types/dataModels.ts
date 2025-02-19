// Generated types from OpenAPI spec
export interface Patient {
    patientId?: number;
    name?: Name;
    socialSecurityNumber: string;
    purposeOfVisit: string;
    healthGoals?: string;
    dateOfBirth: string;
    consent?: boolean;
    gender?: Gender;
    race?: Race;
    ethnicity?: Ethnicity;
    contactDetail?: ContactDetail;
    insuranceDetails?: InsuranceDetail[];
    medicalHistory?: MedicalHistory;
    substanceConsumptions?: SubstanceConsumption[];
    appointments?: Appointment[];
  }
  
  export interface Practitioner {
    practitionerId?: number;
    name?: Name;
    npi: string;
    dateOfBirth: string;
    gender?: Gender;
    race?: Race;
    ethnicity?: Ethnicity;
    active?: boolean;
    effectiveFrom?: string;
    effectiveUntil?: string;
    specialty?: string;
    licenseNumber?: string;
    contactDetail?: ContactDetail;
    appointments?: Appointment[];
  }
  
  export interface Name {
    nameId?: number;
    salutation?: string;
    firstName?: string;
    lastName?: string;
  }
  
  export interface Gender {
    genderId?: number;
    genderName?: string;
  }
  
  export interface Race {
    raceId?: number;
    raceName?: string;
  }
  
  export interface Ethnicity {
    ethnicityId?: number;
    ethnicityName?: string;
  }
  
  export interface ContactDetail {
    contactId?: number;
    phoneNumber?: string;
    alternatePhoneNumber?: string;
    workPhoneNumber?: string;
    email?: string;
    workEmail?: string;
    address?: Address;
  }
  
  export interface Address {
    addressId?: number;
    houseNumber?: string;
    street?: string;
    city?: string;
    district?: string;
    province?: string;
    country?: string;
    postalCode?: string;
  }
  
  export interface InsuranceDetail {
    insuranceId?: number;
    provider?: string;
    policyNumber?: string;
    coverageDetails?: string;
  }
  
  export interface MedicalHistory {
    historyId?: number;
    childhoodIllness?: string;
    surgeries?: string;
    historyBloodTransfusion?: string;
    allergies?: string;
    exerciseRoutine?: string;
    diet?: string;
    mentalHealthQuestions?: string;
    familyHealthHistory?: string;
    changes?: string;
    currentSymptoms?: string;
    healthGoals?: string;
    medications?: Medication[];
    immunizations?: Immunization[];
  }
  
  export interface Medication {
    medicationId?: number;
    name?: string;
    dosage?: string;
    frequency?: string;
  }
  
  export interface Immunization {
    immunizationId?: number;
    vaccineName?: string;
    dateAdministered?: string;
  }
  
  export interface SubstanceConsumption {
    substanceId?: number;
    type?: string;
    amount?: string;
    frequency?: string;
  }

  export interface Appointment {
    appointmentId?: number;
    description?: string;
    actualStartTime?: string;
    actualEndTime?: string;
    requestedStartTime: string;
    requestedEndTime: string;
    patientInstructions?: string;
    additionalComments?: string;
    location?: string;
    appointmentStatus: AppointmentStatus;
    appointmentType: AppointmentType;
    priority: AppointmentPriority;
    patient: Patient;
    practitioner: Practitioner;
    serviceCategory?: ServiceCategory;
    serviceType?: ServiceType;
  }

  export interface AppointmentStatus {
    appointmentStatusId: number;
    appointmentStatusName: string;
  }

  export interface AppointmentType {
    appointmentTypeId: number;
    appointmentTypeName: string;
  }

  export interface AppointmentPriority {
    appointmentPriorityId: number;
    appointmentPriorityName: string;
  }

  export interface ServiceCategory {
    serviceCategoryId: number;
    serviceCategoryName: string;
  }

  export interface ServiceType {
    serviceTypeId: number;
    serviceTypeName: string;
  }

  export interface AppointmentCriteria {
    patientId?: number;
    practitionerId?: number;
    appointmentTypeId?: number;
    appointmentStatusId?: number;
    appointmentPriorityId?: number;
    startDate?: string;
    endDate?: string;
  }

  export interface PagedResponse<T> {
    content: T[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
    first: boolean;
    numberOfElements: number;
  }

  export interface AppointmentsApiResponse extends PagedResponse<Appointment> {}
  export interface PatientsApiResponse extends PagedResponse<Patient> {}
  export interface PractitionersApiResponse extends PagedResponse<Practitioner> {}

  export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
  }

  export interface HalPage {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }

  export interface HalLinks {
    self: { href: string };
    profile?: { href: string };
    [key: string]: { href: string } | undefined;
  }

  export interface AppointmentTypeHalResponse {
    _embedded: {
      appointmentTypes: AppointmentType[];
    };
    _links: HalLinks;
    page: HalPage;
  }

  export interface AppointmentStatusHalResponse {
    _embedded: {
      appointmentStatuses: AppointmentStatus[];
    };
    _links: HalLinks;
    page: HalPage;
  }

  export interface AppointmentPriorityHalResponse {
    _embedded: {
      appointmentPriorities: AppointmentPriority[];
    };
    _links: HalLinks;
    page: HalPage;
  }

  export interface ServiceCategoryHalResponse {
    _embedded: {
      serviceCategories: ServiceCategory[];
    };
    _links: Record<string, any>;
    page: {
      size: number;
      totalElements: number;
      totalPages: number;
      number: number;
    };
  }

  export interface ServiceTypeHalResponse {
    _embedded: {
      serviceTypes: ServiceType[];
    };
    _links: Record<string, any>;
    page: {
      size: number;
      totalElements: number;
      totalPages: number;
      number: number;
    };
  }
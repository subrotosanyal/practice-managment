import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  useToast,
  Box,
  Spinner,
  Textarea,
  SimpleGrid,
} from '@chakra-ui/react';
import { appointmentApi } from '@/services/entities/appointment/appointmentApi';
import { patientApi } from '@/services/entities/patient/patientApi';
import { practitionerApi } from '@/services/entities/practitioner/practitionerApi';
import { 
  Appointment,
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
  PatientsApiResponse,
  PractitionersApiResponse,
  ServiceCategory,
  ServiceType,
} from '@/types/dataModels';
import { format } from 'date-fns';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  appointment?: Appointment | null;
}

interface FormData {
  requestedStartTime: string;
  requestedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  patientId: string;
  practitionerId: string;
  appointmentTypeId: string;
  appointmentStatusId: string;
  appointmentPriorityId: string;
  serviceCategoryId: string;
  serviceTypeId: string;
  description?: string;
  patientInstructions?: string;
  additionalComments?: string;
  location?: string;
}

const AppointmentFormContent: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
}) => {
  const toast = useToast();
  const client = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    requestedStartTime: '',
    requestedEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
    patientId: '',
    practitionerId: '',
    appointmentTypeId: '',
    appointmentStatusId: '',
    appointmentPriorityId: '',
    serviceCategoryId: '',
    serviceTypeId: '',
    description: '',
    patientInstructions: '',
    additionalComments: '',
    location: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        requestedStartTime: format(new Date(appointment.requestedStartTime), "yyyy-MM-dd'T'HH:mm"),
        requestedEndTime: format(new Date(appointment.requestedEndTime), "yyyy-MM-dd'T'HH:mm"),
        actualStartTime: appointment.actualStartTime ? format(new Date(appointment.actualStartTime), "yyyy-MM-dd'T'HH:mm") : '',
        actualEndTime: appointment.actualEndTime ? format(new Date(appointment.actualEndTime), "yyyy-MM-dd'T'HH:mm") : '',
        patientId: appointment.patient.patientId?.toString() || '',
        practitionerId: appointment.practitioner.practitionerId?.toString() || '',
        appointmentTypeId: appointment.appointmentType.appointmentTypeId?.toString() || '',
        appointmentStatusId: appointment.appointmentStatus.appointmentStatusId?.toString() || '',
        appointmentPriorityId: appointment.priority.appointmentPriorityId?.toString() || '',
        serviceCategoryId: appointment.serviceCategory?.serviceCategoryId?.toString() || '',
        serviceTypeId: appointment.serviceType?.serviceTypeId?.toString() || '',
        description: appointment.description || '',
        patientInstructions: appointment.patientInstructions || '',
        additionalComments: appointment.additionalComments || '',
        location: appointment.location || '',
      });
    } else {
      setFormData({
        requestedStartTime: '',
        requestedEndTime: '',
        actualStartTime: '',
        actualEndTime: '',
        patientId: '',
        practitionerId: '',
        appointmentTypeId: '',
        appointmentStatusId: '',
        appointmentPriorityId: '',
        serviceCategoryId: '',
        serviceTypeId: '',
        description: '',
        patientInstructions: '',
        additionalComments: '',
        location: '',
      });
    }
  }, [appointment]);

  const { data: appointmentTypes = [], isLoading: typesLoading } = useQuery<AppointmentType[]>({
    queryKey: ['appointmentTypes'],
    queryFn: () => appointmentApi.fetchAppointmentTypes(),
  });

  const { data: appointmentStatuses = [], isLoading: statusesLoading } = useQuery<AppointmentStatus[]>({
    queryKey: ['appointmentStatuses'],
    queryFn: () => appointmentApi.fetchAppointmentStatuses(),
  });

  const { data: appointmentPriorities = [], isLoading: prioritiesLoading } = useQuery<AppointmentPriority[]>({
    queryKey: ['appointmentPriorities'],
    queryFn: () => appointmentApi.fetchAppointmentPriorities(),
  });

  const { data: serviceCategories = [], isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: () => appointmentApi.fetchServiceCategories(),
  });

  const { data: serviceTypes = [], isLoading: typesServiceLoading } = useQuery<ServiceType[]>({
    queryKey: ['serviceTypes'],
    queryFn: () => appointmentApi.fetchServiceTypes(),
  });

  const { data: patientsResponse, isLoading: patientsLoading } = useQuery<PatientsApiResponse>({
    queryKey: ['patients'],
    queryFn: () => patientApi.getPatients({ page: 0, size: 100 }),
  });

  const { data: practitionersResponse, isLoading: practitionersLoading } = useQuery<PractitionersApiResponse>({
    queryKey: ['practitioners'],
    queryFn: () => practitionerApi.getPractitioners({ page: 0, size: 100 }),
  });

  const patients = patientsResponse?.content || [];
  const practitioners = practitionersResponse?.content || [];

  const isLoading = typesLoading || statusesLoading || prioritiesLoading || patientsLoading || practitionersLoading || categoriesLoading || typesServiceLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const selectedPatient = patients.find(p => p.patientId === Number(formData.patientId));
      const selectedPractitioner = practitioners.find(p => p.practitionerId === Number(formData.practitionerId));
      const selectedType = appointmentTypes.find(t => t.appointmentTypeId === Number(formData.appointmentTypeId));
      const selectedStatus = appointmentStatuses.find(s => s.appointmentStatusId === Number(formData.appointmentStatusId));
      const selectedPriority = appointmentPriorities.find(p => p.appointmentPriorityId === Number(formData.appointmentPriorityId));
      const selectedCategory = serviceCategories.find(c => c.serviceCategoryId === Number(formData.serviceCategoryId));
      const selectedServiceType = serviceTypes.find(t => t.serviceTypeId === Number(formData.serviceTypeId));

      if (!selectedPatient || !selectedPractitioner || !selectedType || !selectedStatus || !selectedPriority) {
        throw new Error('Please select all required fields');
      }

      const appointmentData: Appointment = {
        requestedStartTime: formData.requestedStartTime,
        requestedEndTime: formData.requestedEndTime,
        actualStartTime: formData.actualStartTime || undefined,
        actualEndTime: formData.actualEndTime || undefined,
        description: formData.description,
        patientInstructions: formData.patientInstructions,
        additionalComments: formData.additionalComments,
        location: formData.location,
        patient: selectedPatient,
        practitioner: selectedPractitioner,
        appointmentType: selectedType,
        appointmentStatus: selectedStatus,
        priority: selectedPriority,
        serviceCategory: selectedCategory,
        serviceType: selectedServiceType,
      };

      if (appointment?.appointmentId) {
        await appointmentApi.updateAppointment(appointment.appointmentId, appointmentData);
        toast({
          title: 'Appointment updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await appointmentApi.createAppointment(appointmentData);
        toast({
          title: 'Appointment created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      client.invalidateQueries({ queryKey: ['appointments'] });
      onSubmit();
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving appointment',
        description: error instanceof Error ? error.message : 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loading...</ModalHeader>
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
              <Spinner size="xl" />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "6xl" }}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "100%", md: "1200px" }}>
        <ModalHeader>{appointment ? 'Edit Appointment' : 'New Appointment'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.patientId} value={patient.patientId}>
                        {patient.name?.firstName} {patient.name?.lastName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Practitioner</FormLabel>
                  <Select
                    name="practitionerId"
                    value={formData.practitionerId}
                    onChange={handleChange}
                  >
                    <option value="">Select Practitioner</option>
                    {practitioners.map((practitioner) => (
                      <option key={practitioner.practitionerId} value={practitioner.practitionerId}>
                        {practitioner.name?.firstName} {practitioner.name?.lastName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Requested Start Time</FormLabel>
                  <Input
                    name="requestedStartTime"
                    type="datetime-local"
                    value={formData.requestedStartTime}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Requested End Time</FormLabel>
                  <Input
                    name="requestedEndTime"
                    type="datetime-local"
                    value={formData.requestedEndTime}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Actual Start Time</FormLabel>
                  <Input
                    name="actualStartTime"
                    type="datetime-local"
                    value={formData.actualStartTime}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Actual End Time</FormLabel>
                  <Input
                    name="actualEndTime"
                    type="datetime-local"
                    value={formData.actualEndTime}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select
                    name="appointmentTypeId"
                    value={formData.appointmentTypeId}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    {appointmentTypes.map((type) => (
                      <option key={type.appointmentTypeId} value={type.appointmentTypeId}>
                        {type.appointmentTypeName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="appointmentStatusId"
                    value={formData.appointmentStatusId}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    {appointmentStatuses.map((status) => (
                      <option key={status.appointmentStatusId} value={status.appointmentStatusId}>
                        {status.appointmentStatusName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    name="appointmentPriorityId"
                    value={formData.appointmentPriorityId}
                    onChange={handleChange}
                  >
                    <option value="">Select Priority</option>
                    {appointmentPriorities.map((priority) => (
                      <option key={priority.appointmentPriorityId} value={priority.appointmentPriorityId}>
                        {priority.appointmentPriorityName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Service Category</FormLabel>
                  <Select
                    name="serviceCategoryId"
                    value={formData.serviceCategoryId}
                    onChange={handleChange}
                  >
                    <option value="">Select Service Category</option>
                    {serviceCategories.map((category) => (
                      <option key={category.serviceCategoryId} value={category.serviceCategoryId}>
                        {category.serviceCategoryName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    name="serviceTypeId"
                    value={formData.serviceTypeId}
                    onChange={handleChange}
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map((type) => (
                      <option key={type.serviceTypeId} value={type.serviceTypeId}>
                        {type.serviceTypeName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Appointment location..."
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the appointment..."
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Patient Instructions</FormLabel>
                  <Textarea
                    name="patientInstructions"
                    value={formData.patientInstructions}
                    onChange={handleChange}
                    placeholder="Instructions for the patient..."
                    rows={3}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Additional Comments</FormLabel>
                <Textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  placeholder="Any additional comments..."
                  rows={3}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg">
                {appointment ? 'Update' : 'Create'} Appointment
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const AppointmentForm: React.FC<AppointmentFormProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <AppointmentFormContent {...props} />
  </QueryClientProvider>
);

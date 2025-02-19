import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Container,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure,
  Heading,
  HStack,
  Badge,
  Menu,
  MenuButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, MoreVertical } from 'lucide-react';
import { appointmentApi } from '@/services/entities/appointment/appointmentApi';
import { Appointment } from '@/types/dataModels';
import { AppointmentForm } from './AppointmentForm';

interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

type AppointmentsApiResponse = PaginatedResponse<Appointment | number>;

const queryClient = new QueryClient();

const getAppointmentPriorityColor = (priorityName: string) => {
  switch (priorityName) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'yellow';
    default:
      return 'green';
  }
};

const AppointmentManagementContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { data: appointmentsData, isLoading } = useQuery<AppointmentsApiResponse>({
    queryKey: ['appointments', currentPage],
    queryFn: () => appointmentApi.fetchAppointments(currentPage),
  });

  const appointments = useMemo(() => {
    if (!appointmentsData?.content) return [];
    return appointmentsData.content.filter((item: unknown): item is Appointment => 
      typeof item === 'object' && item !== null && 'appointmentId' in item
    );
  }, [appointmentsData]);

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await appointmentApi.deleteAppointment(id);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Appointment deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting appointment',
        description: error instanceof Error ? error.message : 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={5} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Box mb={5}>
        <Heading size="lg" mb={4}>
          Appointments
        </Heading>
        <Button
          leftIcon={<Plus />}
          colorScheme="blue"
          onClick={() => {
            setSelectedAppointment(null);
            onOpen();
          }}
        >
          New Appointment
        </Button>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Requested Start Time</Th>
              <Th>Requested End Time</Th>
              <Th>Patient</Th>
              <Th>Practitioner</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments.map((appointment: Appointment) => (
              <Tr key={appointment.appointmentId}>
                <Td>
                  {appointment.requestedStartTime ? 
                    format(new Date(appointment.requestedStartTime), 'MMM dd, yyyy HH:mm') : 
                    'Not set'
                  }
                </Td>
                <Td>
                  {appointment.requestedEndTime ? 
                    format(new Date(appointment.requestedEndTime), 'MMM dd, yyyy HH:mm') : 
                    'Not set'
                  }
                </Td>
                <Td>
                  {appointment.patient.name?.firstName} {appointment.patient.name?.lastName}
                </Td>
                <Td>
                  {appointment.practitioner.name?.firstName} {appointment.practitioner.name?.lastName}
                </Td>
                <Td>
                  <Badge colorScheme="blue">
                    {appointment.appointmentType.appointmentTypeName}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme="green">
                    {appointment.appointmentStatus.appointmentStatusName}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getAppointmentPriorityColor(
                      appointment.priority.appointmentPriorityName
                    )}
                  >
                    {appointment.priority.appointmentPriorityName}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit appointment"
                      icon={<Edit />}
                      variant="ghost"
                      onClick={() => handleEdit(appointment)}
                    />
                    <IconButton
                      aria-label="Delete appointment"
                      icon={<Trash2 />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => appointment.appointmentId && handleDelete(appointment.appointmentId)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {appointmentsData && (
        <HStack justify="center" mt={4} spacing={4}>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            isDisabled={currentPage === 0}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage + 1} of {appointmentsData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            isDisabled={currentPage === appointmentsData.totalPages - 1}
          >
            Next
          </Button>
        </HStack>
      )}

      <AppointmentForm
        isOpen={isOpen}
        onClose={onClose}
        appointment={selectedAppointment}
        onSubmit={() => {
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          onClose();
        }}
      />
    </Container>
  );
};

const AppointmentManagement: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppointmentManagementContent />
    </QueryClientProvider>
  );
};

export default AppointmentManagement;

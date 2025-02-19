import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  VStack,
  HStack,
  Heading,
  Spinner,
  Input,
  Text,
  Flex,
} from '@chakra-ui/react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { patientApi } from '@/services/entities/patient/patientApi';
import { Patient, PatientsApiResponse } from '@/types/dataModels';
import { PatientForm } from './PatientForm';

const queryClient = new QueryClient();

export const PatientManagementContent: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: patientsData, isLoading } = useQuery<PatientsApiResponse>({
    queryKey: ['patients', currentPage],
    queryFn: () => patientApi.getPatients({ page: currentPage, size: pageSize }),
  });

  const createMutation = useMutation({
    mutationFn: (patient: Patient) => patientApi.createPatient(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Patient added successfully', status: 'success' });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (patient: Patient) => patientApi.updatePatient(patient.patientId!, patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Patient updated successfully', status: 'success' });
      setIsFormOpen(false);
    },
  });

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await patientApi.deletePatient(id);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: 'Patient deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting patient',
        description: error instanceof Error ? error.message : 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPatient(null);
    setIsFormOpen(false);
  };

  const handleSearch = (term: string) => {
    // Implement search functionality
    console.log('Searching for:', term);
  };

  if (isLoading) {
    return (
      <Box p={5} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Patients</Heading>
          <HStack spacing={4}>
            <HStack>
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                name="patient-search"
                aria-label="Search patients"
              />
              <Button leftIcon={<Search size={20} />} onClick={() => handleSearch(searchTerm)}>
                Search
              </Button>
            </HStack>
            <Button leftIcon={<Plus size={20} />} colorScheme="blue" onClick={handleCreateNew}>
              New Patient
            </Button>
          </HStack>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date of Birth</Th>
                <Th>Contact</Th>
                <Th>Last Visit</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patientsData?.content.map((patient) => (
                <Tr key={patient.patientId}>
                  <Td>
                    {patient.name?.firstName} {patient.name?.lastName}
                  </Td>
                  <Td>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not set'}</Td>
                  <Td>
                    {patient.contactDetail?.email && (
                      <>
                        <Text key={`email-${patient.patientId}`}>{patient.contactDetail.email}</Text>
                        {patient.contactDetail.phoneNumber && (
                          <Text key={`phone-${patient.patientId}`}>{patient.contactDetail.phoneNumber}</Text>
                        )}
                      </>
                    )}
                  </Td>
                  <Td>
                    {patient.appointments && patient.appointments.length > 0 && patient.appointments[0].requestedStartTime
                      ? new Date(patient.appointments[0].requestedStartTime).toLocaleDateString()
                      : 'No visits'}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit patient"
                        icon={<Edit size={16} />}
                        size="sm"
                        onClick={() => handleEdit(patient)}
                      />
                      <IconButton
                        aria-label="Delete patient"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => patient.patientId && handleDelete(patient.patientId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {patientsData && (
          <Flex justify="space-between" align="center">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 0}
            >
              Previous
            </Button>
            <Text>
              Page {currentPage + 1} of {patientsData.totalPages}
            </Text>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === patientsData.totalPages - 1}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>

      <Modal isOpen={isFormOpen} onClose={handleCloseForm} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <PatientForm
              patient={selectedPatient}
              onSubmit={(patient) => {
                if (selectedPatient) {
                  updateMutation.mutate(patient);
                } else {
                  createMutation.mutate(patient);
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const PatientManagement: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientManagementContent />
    </QueryClientProvider>
  );
};

export default PatientManagement;

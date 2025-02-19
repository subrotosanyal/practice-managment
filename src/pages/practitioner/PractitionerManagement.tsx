import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
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
  useDisclosure,
  useToast,
  HStack,
  IconButton,
  Input,
  Badge,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { practitionerApi } from '@/services/entities/practitioner/practitionerApi';
import { Practitioner, PractitionersApiResponse } from '@/types/dataModels';
import { PractitionerForm } from './PractitionerForm';

const queryClient = new QueryClient();

const PractitionerManagement: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <PractitionerManagementContent />
  </QueryClientProvider>
);

const PractitionerManagementContent: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: practitionersData, isLoading } = useQuery<PractitionersApiResponse, Error>({
    queryKey: ['practitioners', currentPage],
    queryFn: async () => {
      const response = await practitionerApi.getPractitioners({ page: currentPage, size: 20 });
      return response as PractitionersApiResponse;
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (newPractitioner: Practitioner) => practitionerApi.createPractitioner(newPractitioner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practitioners'] });
      toast({ title: 'Practitioner added successfully', status: 'success' });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Practitioner> }) =>
      practitionerApi.updatePractitioner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practitioners'] });
      toast({ title: 'Practitioner updated successfully', status: 'success' });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => practitionerApi.deletePractitioner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practitioners'] });
      toast({ title: 'Practitioner deleted successfully', status: 'success' });
    },
  });

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        await practitionerApi.searchPractitioners(
          { name: searchTerm },
          { page: 0, size: 10 }
        );
        // Handle search results by invalidating the practitioners query
        queryClient.invalidateQueries({ queryKey: ['practitioners'] });
      } catch (error) {
        toast({
          title: 'Error searching practitioners',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<Plus size={20} />}
            colorScheme="blue"
            onClick={() => {
              setSelectedPractitioner(null);
              onOpen();
            }}
          >
            Add Practitioner
          </Button>
        </HStack>

        <Tabs>
          <TabList>
            <Tab>All Practitioners</Tab>
            <Tab>Recent</Tab>
            <Tab>With Upcoming Appointments</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Input
                    placeholder="Search practitioners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button leftIcon={<Search size={20} />} onClick={handleSearch}>
                    Search
                  </Button>
                </HStack>

                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Specialty</Th>
                      <Th>NPI</Th>
                      <Th>Contact</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {practitionersData?.content?.map((practitioner: Practitioner) => (
                      <Tr key={practitioner.practitionerId}>
                        <Td>
                          <Text fontWeight="medium">
                            {practitioner.name?.salutation} {practitioner.name?.firstName} {practitioner.name?.lastName}
                          </Text>
                        </Td>
                        <Td>{practitioner.specialty}</Td>
                        <Td>{practitioner.npi}</Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text>{practitioner.contactDetail?.email || 'N/A'}</Text>
                            <Text>{practitioner.contactDetail?.phoneNumber || 'N/A'}</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={practitioner.active ? 'green' : 'gray'}>
                            {practitioner.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit practitioner"
                              icon={<Edit2 size={16} />}
                              size="sm"
                              onClick={() => {
                                setSelectedPractitioner(practitioner);
                                onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Delete practitioner"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => {
                                if (practitioner.practitionerId) {
                                  deleteMutation.mutate(practitioner.practitionerId);
                                }
                              }}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {!practitionersData?.last && (
                  <Button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    isLoading={isLoading}
                    loadingText="Loading..."
                  >
                    Load More
                  </Button>
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <Text>Recent practitioners will be shown here</Text>
            </TabPanel>
            <TabPanel>
              <Text>Practitioners with upcoming appointments will be shown here</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedPractitioner ? 'Edit Practitioner' : 'Add New Practitioner'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <PractitionerForm
                practitioner={selectedPractitioner}
                onSubmit={(data: Practitioner) => {
                  if (selectedPractitioner) {
                    updateMutation.mutate({
                      id: selectedPractitioner.practitionerId!,
                      data,
                    });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default PractitionerManagement;
export { PractitionerManagement };
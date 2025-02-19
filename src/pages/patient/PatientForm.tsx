import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEthnicities, fetchRaces, fetchGenders } from '@/services/entities/commonEntities/commonEntities';
import {
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Textarea,
  Checkbox,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';
import { Ethnicity, Gender, Patient, Race, InsuranceDetail, Medication, Immunization } from '@/types/dataModels';

interface PatientFormProps {
  patient?: Patient | null;
  onSubmit: (data: Patient) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Patient>>(
    patient || {
      name: { salutation: '', firstName: '', lastName: '' },
      dateOfBirth: '',
      socialSecurityNumber: '',
      purposeOfVisit: '',
      healthGoals: '',
      consent: false,
      contactDetail: {
        phoneNumber: '',
        alternatePhoneNumber: '',
        workPhoneNumber: '',
        email: '',
        workEmail: '',
        address: {
          houseNumber: '',
          street: '',
          city: '',
          district: '',
          province: '',
          country: '',
          postalCode: '',
        },
      },
      insuranceDetails: [],
      medicalHistory: {
        childhoodIllness: '',
        surgeries: '',
        historyBloodTransfusion: '',
        allergies: '',
        exerciseRoutine: '',
        diet: '',
        mentalHealthQuestions: '',
        familyHealthHistory: '',
        changes: '',
        currentSymptoms: '',
        healthGoals: '',
        medications: [],
        immunizations: [],
      },
    }
  );

  const { data: ethnicities = [] } = useQuery<Ethnicity[]>({ 
    queryKey: ['ethnicities'], 
    queryFn: fetchEthnicities 
  });
  const { data: races = [] } = useQuery<Race[]>({ 
    queryKey: ['races'], 
    queryFn: fetchRaces 
  });
  const { data: genders = [] } = useQuery<Gender[]>({ 
    queryKey: ['genders'], 
    queryFn: fetchGenders 
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Patient);
  };

  const addInsurance = () => {
    setFormData({
      ...formData,
      insuranceDetails: [
        ...(formData.insuranceDetails || []),
        { provider: '', policyNumber: '', coverageDetails: '' },
      ],
    });
  };

  const removeInsurance = (index: number) => {
    const newInsuranceDetails = [...(formData.insuranceDetails || [])];
    newInsuranceDetails.splice(index, 1);
    setFormData({ ...formData, insuranceDetails: newInsuranceDetails });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medicalHistory: {
        ...formData.medicalHistory,
        medications: [
          ...(formData.medicalHistory?.medications || []),
          { name: '', dosage: '', frequency: '' },
        ],
      },
    });
  };

  const removeMedication = (index: number) => {
    const newMedications = [...(formData.medicalHistory?.medications || [])];
    newMedications.splice(index, 1);
    setFormData({
      ...formData,
      medicalHistory: {
        ...formData.medicalHistory,
        medications: newMedications,
      },
    });
  };

  const addImmunization = () => {
    setFormData({
      ...formData,
      medicalHistory: {
        ...formData.medicalHistory,
        immunizations: [
          ...(formData.medicalHistory?.immunizations || []),
          { vaccineName: '', dateAdministered: '' },
        ],
      },
    });
  };

  const removeImmunization = (index: number) => {
    const newImmunizations = [...(formData.medicalHistory?.immunizations || [])];
    newImmunizations.splice(index, 1);
    setFormData({
      ...formData,
      medicalHistory: {
        ...formData.medicalHistory,
        immunizations: newImmunizations,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        <Accordion defaultIndex={[0]} allowMultiple width="100%">
          {/* Basic Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">Basic Information</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                <FormControl>
                  <FormLabel>Salutation</FormLabel>
                  <Select
                    value={formData.name?.salutation || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, salutation: e.target.value }
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    value={formData.name?.firstName || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, firstName: e.target.value }
                    })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={formData.name?.lastName || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, lastName: e.target.value }
                    })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Social Security Number</FormLabel>
                  <Input
                    value={formData.socialSecurityNumber || ''}
                    onChange={(e) => setFormData({ ...formData, socialSecurityNumber: e.target.value })}
                    placeholder="XXX-XX-XXXX"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={formData.gender?.genderId || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      gender: { genderId: Number(e.target.value), genderName: e.target.options[e.target.selectedIndex].text }
                    })}
                  >
                    <option value="">Select Gender</option>
                    {genders.map((gender) => (
                      <option key={gender.genderId} value={gender.genderId}>
                        {gender.genderName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Race</FormLabel>
                  <Select
                    value={formData.race?.raceId || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      race: { raceId: Number(e.target.value), raceName: e.target.options[e.target.selectedIndex].text }
                    })}
                  >
                    <option value="">Select Race</option>
                    {races.map((race) => (
                      <option key={race.raceId} value={race.raceId}>
                        {race.raceName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Ethnicity</FormLabel>
                  <Select
                    value={formData.ethnicity?.ethnicityId || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      ethnicity: { ethnicityId: Number(e.target.value), ethnicityName: e.target.options[e.target.selectedIndex].text }
                    })}
                  >
                    <option value="">Select Ethnicity</option>
                    {ethnicities.map((ethnicity) => (
                      <option key={ethnicity.ethnicityId} value={ethnicity.ethnicityId}>
                        {ethnicity.ethnicityName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Contact Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">Contact Information</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={formData.contactDetail?.phoneNumber || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactDetail: {
                        ...formData.contactDetail,
                        phoneNumber: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Alternate Phone</FormLabel>
                  <Input
                    value={formData.contactDetail?.alternatePhoneNumber || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactDetail: {
                        ...formData.contactDetail,
                        alternatePhoneNumber: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Work Phone</FormLabel>
                  <Input
                    value={formData.contactDetail?.workPhoneNumber || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactDetail: {
                        ...formData.contactDetail,
                        workPhoneNumber: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.contactDetail?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactDetail: {
                        ...formData.contactDetail,
                        email: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Work Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.contactDetail?.workEmail || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactDetail: {
                        ...formData.contactDetail,
                        workEmail: e.target.value
                      }
                    })}
                  />
                </FormControl>
              </SimpleGrid>

              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>Address</Text>
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  <FormControl>
                    <FormLabel>House Number</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.houseNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            houseNumber: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Street</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.street || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            street: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            city: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>District</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.district || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            district: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Province/State</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.province || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            province: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Country</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.country || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            country: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      value={formData.contactDetail?.address?.postalCode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactDetail: {
                          ...formData.contactDetail,
                          address: {
                            ...formData.contactDetail?.address,
                            postalCode: e.target.value
                          }
                        }
                      })}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Insurance Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">Insurance Information</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={4} align="stretch">
                {formData.insuranceDetails?.map((insurance, index) => (
                  <Box key={index} p={4} borderWidth={1} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">Insurance {index + 1}</Text>
                      <IconButton
                        aria-label="Remove insurance"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeInsurance(index)}
                      />
                    </HStack>
                    <SimpleGrid columns={[1, 3]} spacing={4}>
                      <FormControl>
                        <FormLabel>Provider</FormLabel>
                        <Input
                          value={insurance.provider || ''}
                          onChange={(e) => {
                            const newInsuranceDetails = [...(formData.insuranceDetails || [])];
                            newInsuranceDetails[index] = {
                              ...newInsuranceDetails[index],
                              provider: e.target.value,
                            };
                            setFormData({ ...formData, insuranceDetails: newInsuranceDetails });
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Policy Number</FormLabel>
                        <Input
                          value={insurance.policyNumber || ''}
                          onChange={(e) => {
                            const newInsuranceDetails = [...(formData.insuranceDetails || [])];
                            newInsuranceDetails[index] = {
                              ...newInsuranceDetails[index],
                              policyNumber: e.target.value,
                            };
                            setFormData({ ...formData, insuranceDetails: newInsuranceDetails });
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Coverage Details</FormLabel>
                        <Input
                          value={insurance.coverageDetails || ''}
                          onChange={(e) => {
                            const newInsuranceDetails = [...(formData.insuranceDetails || [])];
                            newInsuranceDetails[index] = {
                              ...newInsuranceDetails[index],
                              coverageDetails: e.target.value,
                            };
                            setFormData({ ...formData, insuranceDetails: newInsuranceDetails });
                          }}
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>
                ))}
                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={addInsurance}
                  colorScheme="blue"
                  variant="outline"
                >
                  Add Insurance
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Medical History */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">Medical History</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FormControl>
                  <FormLabel>Childhood Illness</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.childhoodIllness || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        childhoodIllness: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Surgeries</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.surgeries || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        surgeries: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Blood Transfusion History</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.historyBloodTransfusion || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        historyBloodTransfusion: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Allergies</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.allergies || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        allergies: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Exercise Routine</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.exerciseRoutine || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        exerciseRoutine: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Diet</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.diet || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        diet: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Mental Health</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.mentalHealthQuestions || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        mentalHealthQuestions: e.target.value
                      }
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Family Health History</FormLabel>
                  <Textarea
                    value={formData.medicalHistory?.familyHealthHistory || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalHistory: {
                        ...formData.medicalHistory,
                        familyHealthHistory: e.target.value
                      }
                    })}
                  />
                </FormControl>
              </SimpleGrid>

              {/* Medications */}
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>Medications</Text>
                <VStack spacing={4} align="stretch">
                  {formData.medicalHistory?.medications?.map((medication, index) => (
                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">Medication {index + 1}</Text>
                        <IconButton
                          aria-label="Remove medication"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeMedication(index)}
                        />
                      </HStack>
                      <SimpleGrid columns={[1, 3]} spacing={4}>
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            value={medication.name || ''}
                            onChange={(e) => {
                              const newMedications = [...(formData.medicalHistory?.medications || [])];
                              newMedications[index] = {
                                ...newMedications[index],
                                name: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                medicalHistory: {
                                  ...formData.medicalHistory,
                                  medications: newMedications,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Dosage</FormLabel>
                          <Input
                            value={medication.dosage || ''}
                            onChange={(e) => {
                              const newMedications = [...(formData.medicalHistory?.medications || [])];
                              newMedications[index] = {
                                ...newMedications[index],
                                dosage: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                medicalHistory: {
                                  ...formData.medicalHistory,
                                  medications: newMedications,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Frequency</FormLabel>
                          <Input
                            value={medication.frequency || ''}
                            onChange={(e) => {
                              const newMedications = [...(formData.medicalHistory?.medications || [])];
                              newMedications[index] = {
                                ...newMedications[index],
                                frequency: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                medicalHistory: {
                                  ...formData.medicalHistory,
                                  medications: newMedications,
                                },
                              });
                            }}
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={addMedication}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Add Medication
                  </Button>
                </VStack>
              </Box>

              {/* Immunizations */}
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>Immunizations</Text>
                <VStack spacing={4} align="stretch">
                  {formData.medicalHistory?.immunizations?.map((immunization, index) => (
                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">Immunization {index + 1}</Text>
                        <IconButton
                          aria-label="Remove immunization"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeImmunization(index)}
                        />
                      </HStack>
                      <SimpleGrid columns={[1, 2]} spacing={4}>
                        <FormControl>
                          <FormLabel>Vaccine Name</FormLabel>
                          <Input
                            value={immunization.vaccineName || ''}
                            onChange={(e) => {
                              const newImmunizations = [...(formData.medicalHistory?.immunizations || [])];
                              newImmunizations[index] = {
                                ...newImmunizations[index],
                                vaccineName: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                medicalHistory: {
                                  ...formData.medicalHistory,
                                  immunizations: newImmunizations,
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Date Administered</FormLabel>
                          <Input
                            type="date"
                            value={immunization.dateAdministered || ''}
                            onChange={(e) => {
                              const newImmunizations = [...(formData.medicalHistory?.immunizations || [])];
                              newImmunizations[index] = {
                                ...newImmunizations[index],
                                dateAdministered: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                medicalHistory: {
                                  ...formData.medicalHistory,
                                  immunizations: newImmunizations,
                                },
                              });
                            }}
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={addImmunization}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Add Immunization
                  </Button>
                </VStack>
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Visit Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">Visit Information</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <Textarea
                    value={formData.purposeOfVisit || ''}
                    onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Health Goals</FormLabel>
                  <Textarea
                    value={formData.healthGoals || ''}
                    onChange={(e) => setFormData({ ...formData, healthGoals: e.target.value })}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl mt={4}>
                <Checkbox
                  isChecked={formData.consent || false}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                >
                  I consent to medical treatment
                </Checkbox>
              </FormControl>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button type="submit" colorScheme="blue" size="lg">
          {patient ? 'Update Patient' : 'Create Patient'}
        </Button>
      </VStack>
    </form>
  );
};
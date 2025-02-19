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
  Box,
  Button,
  Checkbox,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { Ethnicity, Gender, Practitioner, Race } from '@/types/dataModels';

interface PractitionerFormProps {
  practitioner?: Practitioner | null;
  onSubmit: (data: Practitioner) => void;
}

export const PractitionerForm: React.FC<PractitionerFormProps> = ({ practitioner, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Practitioner>>(
    practitioner || {
      name: { salutation: '', firstName: '', lastName: '' },
      npi: '',
      dateOfBirth: '',
      active: true,
      specialty: '',
      licenseNumber: '',
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
    if (practitioner) {
      setFormData(practitioner);
    }
  }, [practitioner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Practitioner);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        if (parent === 'gender' && child === 'genderId') {
          const selectedGender = genders.find(g => g.genderId === Number(value));
          return {
            ...prev,
            gender: value ? selectedGender : undefined
          };
        }
        if (parent === 'race' && child === 'raceId') {
          const selectedRace = races.find(r => r.raceId === Number(value));
          return {
            ...prev,
            race: value ? selectedRace : undefined
          };
        }
        if (parent === 'ethnicity' && child === 'ethnicityId') {
          const selectedEthnicity = ethnicities.find(e => e.ethnicityId === Number(value));
          return {
            ...prev,
            ethnicity: value ? selectedEthnicity : undefined
          };
        }
        
        const parentKey = parent as keyof Practitioner;
        const parentValue = prev[parentKey] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Accordion defaultIndex={[0]} allowMultiple>
          {/* Basic Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Basic Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                <FormControl>
                  <FormLabel>Salutation</FormLabel>
                  <Select
                    name="name.salutation"
                    value={formData.name?.salutation || ''}
                    onChange={handleChange}
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
                    name="name.firstName"
                    value={formData.name?.firstName || ''}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="name.lastName"
                    value={formData.name?.lastName || ''}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>NPI Number</FormLabel>
                  <Input
                    name="npi"
                    value={formData.npi || ''}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Specialty</FormLabel>
                  <Input
                    name="specialty"
                    value={formData.specialty || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>License Number</FormLabel>
                  <Input
                    name="licenseNumber"
                    value={formData.licenseNumber || ''}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender.genderId"
                    value={formData.gender?.genderId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    {genders.map(gender => (
                      <option key={gender.genderId} value={gender.genderId}>
                        {gender.genderName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Race</FormLabel>
                  <Select
                    name="race.raceId"
                    value={formData.race?.raceId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Race</option>
                    {races.map(race => (
                      <option key={race.raceId} value={race.raceId}>
                        {race.raceName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Ethnicity</FormLabel>
                  <Select
                    name="ethnicity.ethnicityId"
                    value={formData.ethnicity?.ethnicityId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Ethnicity</option>
                    {ethnicities.map(ethnicity => (
                      <option key={ethnicity.ethnicityId} value={ethnicity.ethnicityId}>
                        {ethnicity.ethnicityName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>&nbsp;</FormLabel>
                  <Checkbox
                    name="active"
                    isChecked={formData.active}
                    onChange={handleCheckboxChange}
                  >
                    Active
                  </Checkbox>
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
              <SimpleGrid columns={[1, 2, 3]} spacing={4} width="100%">
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="contactDetail.phoneNumber"
                    value={formData.contactDetail?.phoneNumber || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Alternate Phone</FormLabel>
                  <Input
                    name="contactDetail.alternatePhoneNumber"
                    value={formData.contactDetail?.alternatePhoneNumber || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Work Phone</FormLabel>
                  <Input
                    name="contactDetail.workPhoneNumber"
                    value={formData.contactDetail?.workPhoneNumber || ''}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="contactDetail.email"
                    value={formData.contactDetail?.email || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Work Email</FormLabel>
                  <Input
                    type="email"
                    name="contactDetail.workEmail"
                    value={formData.contactDetail?.workEmail || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>House/Apt Number</FormLabel>
                  <Input
                    name="contactDetail.address.houseNumber"
                    value={formData.contactDetail?.address?.houseNumber || ''}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Street</FormLabel>
                  <Input
                    name="contactDetail.address.street"
                    value={formData.contactDetail?.address?.street || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="contactDetail.address.city"
                    value={formData.contactDetail?.address?.city || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>District</FormLabel>
                  <Input
                    name="contactDetail.address.district"
                    value={formData.contactDetail?.address?.district || ''}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Province/State</FormLabel>
                  <Input
                    name="contactDetail.address.province"
                    value={formData.contactDetail?.address?.province || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input
                    name="contactDetail.address.country"
                    value={formData.contactDetail?.address?.country || ''}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input
                    name="contactDetail.address.postalCode"
                    value={formData.contactDetail?.address?.postalCode || ''}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Professional Information */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Professional Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <FormControl>
                <HStack>
                  <Checkbox
                    name="active"
                    isChecked={formData.active}
                    onChange={handleCheckboxChange}
                  />
                  <FormLabel mb={0}>Active</FormLabel>
                </HStack>
              </FormControl>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button type="submit" colorScheme="blue">
          {practitioner ? 'Update Practitioner' : 'Add Practitioner'}
        </Button>
      </VStack>
    </Box>
  );
};

export default PractitionerForm;
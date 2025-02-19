import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../services/auth/auth-context';
import { useTranslation } from 'react-i18next';

const StatCard: React.FC<{
  title: string;
  stat: string;
  helpText: string;
}> = ({ title, stat, helpText }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      bg={bg}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Stat>
        <StatLabel fontSize="sm" fontWeight="medium">
          {title}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {stat}
        </StatNumber>
        <StatHelpText>{helpText}</StatHelpText>
      </Stat>
    </Box>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const username = user?.username || '';

  return (
    <Box>
      <Heading size="lg" mb={6}>
        {t('welcome')}, {username}!
      </Heading>

      <Text mb={8} color="gray.600" _dark={{ color: 'gray.400' }}>
        Here's an overview of your practice
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          title="Appointments Today"
          stat="24"
          helpText="4 more than yesterday"
        />
        <StatCard
          title="Active Patients"
          stat="1,284"
          helpText="↑ 12% this month"
        />
        <StatCard
          title="Revenue This Month"
          stat="$48,294"
          helpText="↑ 8% vs last month"
        />
        <StatCard
          title="Pending Reports"
          stat="7"
          helpText="Due this week"
        />
      </SimpleGrid>
    </Box>
  );
};

import React from 'react';
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Link, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SkinManager } from '../../components/admin/SkinManager';
import { FiExternalLink } from 'react-icons/fi';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const userConfigUrl = import.meta.env.VITE_USER_CONFIG;

  return (
    <Box p={4}>
      <Heading mb={6}>{t('admin.title')}</Heading>
      <Tabs>
        <TabList>
          <Tab>{t('admin.tabs.general')}</Tab>
          <Tab>{t('admin.tabs.customization')}</Tab>
          <Tab>
            <Link href={userConfigUrl} isExternal display="flex" alignItems="center">
              {t('admin.tabs.users')} <Icon as={FiExternalLink} ml={2} />
            </Link>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* General settings content */}
          </TabPanel>
          <TabPanel>
            <SkinManager />
          </TabPanel>
          <TabPanel>
            {/* User management content */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

import React from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const { isOpen: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();
  const { isOpen: isExpanded, onToggle: onToggleExpanded } = useDisclosure({ defaultIsOpen: true });

  return (
    <Box minH="100vh">
      <Header onOpen={onMobileOpen} onToggleSidebar={onToggleExpanded} />
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onMobileClose={onMobileClose}
        isExpanded={isExpanded}
      />
      <Box
        ml={{ base: 0, md: isExpanded ? '240px' : '80px' }}
        p="4"
        mt="16"
        transition=".3s ease"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

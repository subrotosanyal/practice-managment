import React from 'react';
import { Box, Drawer, DrawerContent, DrawerOverlay, DrawerCloseButton, DrawerBody, useColorModeValue, VStack, Icon, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { pluginRegistry } from '../plugins/registry';
import { useRBAC } from '../services/rbac/rbac-context';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isExpanded: boolean;
}

const SidebarContent: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const location = useLocation();
  const { hasRole } = useRBAC();
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      h="100vh"
      w={isExpanded ? "240px" : "72px"}
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      py="4"
      transition="width 0.2s"
      data-testid="sidebar"
      data-collapsed={!isExpanded}
    >
      <VStack spacing="4" align="stretch">
        {pluginRegistry.getPlugins().map((plugin) => {
          // Skip if user doesn't have required roles
          if (plugin.requiredRoles && !hasRole(plugin.requiredRoles[0])) {
            return null;
          }

          const isActive = location.pathname.startsWith(plugin.path);
          const activeColor = useColorModeValue('primary.500', 'primary.300');
          const inactiveColor = useColorModeValue('gray.600', 'whiteAlpha.800');
          const activeBg = useColorModeValue('primary.50', 'primary.900');
          const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

          return (
            <RouterLink
              key={plugin.id}
              to={plugin.path}
              className={isActive ? 'active css-1x6xuim' : 'css-1x6xuim'}
            >
              <Box
                px="4"
                py="2"
                display="flex"
                alignItems="center"
                color={isActive ? activeColor : inactiveColor}
                bg={isActive ? activeBg : 'transparent'}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  color: isActive ? activeColor : inactiveColor,
                }}
                transition="all 0.2s"
                borderRadius="md"
              >
                <Icon
                  as={plugin.icon}
                  boxSize="5"
                  mr={isExpanded ? "3" : "0"}
                  color="inherit"
                  data-testid="plugin-icon"
                />
                {isExpanded && <Text>{t(`sidebar.${plugin.id}`)}</Text>}
              </Box>
            </RouterLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose, isExpanded }) => {
  return (
    <Box>
      <Drawer
        isOpen={isMobileOpen}
        onClose={onMobileClose}
        placement="left"
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton aria-label="close" />
          <DrawerBody p={0}>
            <SidebarContent isExpanded={true} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box
        display={{ base: 'none', md: 'block' }}
        w={isExpanded ? '240px' : '72px'}
        transition="width 0.2s"
      >
        <SidebarContent isExpanded={isExpanded} />
      </Box>
    </Box>
  );
};

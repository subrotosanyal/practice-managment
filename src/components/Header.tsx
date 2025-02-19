import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Center,
  Text,
  Spinner,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../services/auth/auth-context';
import { useTranslation } from 'react-i18next';

interface Props {
  onOpen: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<Props> = ({ onOpen, onToggleSidebar }) => {
  const { user, logout, isLoading } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      px={4} 
      borderBottom="1px" 
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={2}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={4}>
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            aria-label={'Toggle Navigation'}
            onClick={onToggleSidebar}
            display={{ base: 'none', md: 'flex' }}
            data-testid="toggle-sidebar"
          />
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            aria-label={'Open Navigation'}
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
            data-testid="toggle-sidebar-mobile"
          />
          <Text 
            fontWeight="bold" 
            fontSize="lg"
            display={{ base: 'none', md: 'block' }}
          >
            {t('Practice Management')}
          </Text>
          {user && (
            <Text
              ml={4}
              data-testid="welcome-text"
              display={{ base: 'none', md: 'block' }}
            >
              {t('welcome')}, {user.firstName}
            </Text>
          )}
        </HStack>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7} alignItems="center">
            <Button
              variant="ghost"
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              data-testid="dark-mode-button"
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            
            {isLoading ? (
              <Spinner size="sm" />
            ) : user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                  data-testid="menu-button"
                >
                  <Avatar
                    size={'sm'}
                    name={user ? getInitials(user.firstName, user.lastName) : undefined}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <Center>
                    <Avatar
                      size={'2xl'}
                      name={user ? getInitials(user.firstName, user.lastName) : undefined}
                    />
                  </Center>
                  <Center>
                    <Box mt={3} mb={3}>
                      <Text 
                        fontWeight="bold" 
                        data-testid="user-full-name"
                      >
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>
                  </Center>
                  <MenuDivider />
                  <MenuItem 
                    data-testid="logout-button" 
                    onClick={handleLogout}
                  >
                    {t('userMenu.logout')}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : null}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

import React from 'react';
import {
  Box,
  Heading,
  Text,
  RadioGroup,
  Radio,
  Card,
  CardBody,
  useToast,
  Alert,
  AlertIcon,
  Stack,
} from '@chakra-ui/react';
import { useSkin } from '../../theme/skin-context';
import { SkinName } from '../../theme/types';
import { useTranslation } from 'react-i18next';

export const SkinManager: React.FC = () => {
  const { currentSkin, setSkin, isEnabled, availableSkins } = useSkin();
  const { t } = useTranslation();
  const toast = useToast();

  if (!isEnabled) {
    return (
      <Alert status="info" data-testid="skin-manager-disabled">
        <AlertIcon />
        <Text>{t('admin.skins.disabled')}</Text>
      </Alert>
    );
  }

  const handleSkinChange = (value: string) => {
    setSkin(value as SkinName);
    toast({
      title: t('admin.skins.changed'),
      description: t('admin.skins.changedDescription'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4} data-testid="skin-manager">
      <Stack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>
            {t('admin.skins.title')}
          </Heading>
          <Text color="gray.600">
            {t('admin.skins.description')}
          </Text>
        </Box>

        <RadioGroup onChange={handleSkinChange} value={currentSkin}>
          <Stack direction="column" spacing={4}>
            {availableSkins.map((skin) => (
              <Card key={skin.name} variant="outline" data-testid={`skin-${skin.name}`}>
                <CardBody>
                  <Radio value={skin.name} aria-label={skin.label}>
                    <Box ml={3}>
                      <Text fontWeight="medium">{t(skin.label)}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {t(skin.description)}
                      </Text>
                    </Box>
                  </Radio>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </RadioGroup>
      </Stack>
    </Box>
  );
};

import { IconType } from 'react-icons';

export interface SidebarPlugin {
  id: string;
  name: string;
  icon: IconType;
  path: string;
  component: React.ComponentType;
  requiredRoles?: string[];
  order?: number;
}

export interface PluginRegistry {
  registerPlugin: (plugin: SidebarPlugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  getPlugins: () => SidebarPlugin[];
}

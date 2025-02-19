import React from 'react';
import { IconType } from 'react-icons';
import {
  FiCalendar,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import PatientManagement from '../pages/patient/PatientManagement';
import { PractitionerManagement } from '@/pages/practitioner/PractitionerManagement';
import AppointmentManagement from '@/pages/appointment/AppointmentManagement';

interface Plugin {
  id: string;
  name: string;
  icon: IconType;
  path: string;
  component: React.ComponentType;
  order?: number;
}

class PluginRegistry {
  private plugins: Plugin[] = [];

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  getPlugins() {
    return [...this.plugins].sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}

export const pluginRegistry = new PluginRegistry();

pluginRegistry.registerPlugin({
  id: 'patient',
  name: 'Patient',
  icon: FiUsers,
  path: '/patient',
  component: PatientManagement,
  order: 1
});

pluginRegistry.registerPlugin({
  id: 'practitioner',
  name: 'Practitioner',
  icon: FiUserPlus,
  path: '/practitioner',
  component: PractitionerManagement,
  order: 1
});

pluginRegistry.registerPlugin({
  id: 'appointment',
  name: 'Appointment',
  icon: FiCalendar,
  path: '/appointment',
  component: AppointmentManagement,
  order: 1
});

pluginRegistry.registerPlugin({
  id: 'accounting',
  name: 'Accounting',
  icon: FiDollarSign,
  path: '/accounting',
  component: AdminDashboard,
  order: 2
});

pluginRegistry.registerPlugin({
  id: 'analytics',
  name: 'Analytics',
  icon: FiPieChart,
  path: '/analytics',
  component: AdminDashboard,
  order: 2
});

pluginRegistry.registerPlugin({
  id: 'settings',
  name: 'Settings',
  icon: FiSettings,
  path: '/settings',
  component: AdminDashboard,
  order: 3
});

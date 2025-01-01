import { HouseFill, BarChartFill, BellFill, GearFill } from 'react-bootstrap-icons';

export const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: HouseFill,
    path: '/app'
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: BarChartFill,
    path: '/stats'
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: BellFill,
    path: '/alerts'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: GearFill,
    path: '/settings'
  }
];

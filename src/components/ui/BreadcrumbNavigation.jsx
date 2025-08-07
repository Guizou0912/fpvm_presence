import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/': { label: 'Home', icon: 'Home' },
    '/member-management-dashboard': { label: 'Member Dashboard', icon: 'Users' },
    '/qr-code-scanner': { label: 'QR Scanner', icon: 'QrCode' },
    '/member-profile': { label: 'Member Profile', icon: 'User' },
    '/attendance-reports': { label: 'Attendance Reports', icon: 'BarChart3' },
    '/qr-badge-generator': { label: 'Badge Generator', icon: 'CreditCard' },
    '/login': { label: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      
      if (route) {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs?.length > 1 ? breadcrumbs : [];
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length === 0) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            )}
            
            {crumb?.isLast ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={crumb?.icon} size={16} className="text-muted-foreground" />
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb?.path)}
                className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150 ease-out"
              >
                <Icon name={crumb?.icon} size={16} />
                <span>{crumb?.label}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
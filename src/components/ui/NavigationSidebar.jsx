import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationSidebar = ({ isCollapsed = false, onToggleCollapse, userRole = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      section: 'Scan',
      items: [
        {
          label: 'QR Scanner',
          path: '/qr-code-scanner',
          icon: 'QrCode',
          roles: ['admin', 'controller', 'user'],
          tooltip: 'Scan QR codes for attendance tracking'
        }
      ]
    },
    {
      section: 'Members',
      items: [
        {
          label: 'Dashboard',
          path: '/member-management-dashboard',
          icon: 'Users',
          roles: ['admin'],
          tooltip: 'Manage church members and view statistics'
        },
        {
          label: 'Member Profile',
          path: '/member-profile',
          icon: 'User',
          roles: ['admin', 'controller'],
          tooltip: 'View and edit member information'
        },
        {
          label: 'Badge Generator',
          path: '/qr-badge-generator',
          icon: 'CreditCard',
          roles: ['admin'],
          tooltip: 'Generate QR badges for members'
        }
      ]
    },
    {
      section: 'Reports',
      items: [
        {
          label: 'Attendance Reports',
          path: '/attendance-reports',
          icon: 'BarChart3',
          roles: ['admin', 'controller'],
          tooltip: 'View attendance analytics and insights'
        }
      ]
    }
  ];

  const filteredNavigation = navigationItems?.map(section => ({
    ...section,
    items: section?.items?.filter(item => item?.roles?.includes(userRole))
  }))?.filter(section => section?.items?.length > 0);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 px-4 py-6">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Church" size={20} color="white" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">FPVM</span>
          <span className="text-xs text-muted-foreground">Presence</span>
        </div>
      )}
    </div>
  );

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <Logo />
      
      <nav className="flex-1 px-4 space-y-6">
        {filteredNavigation?.map((section) => (
          <div key={section?.section}>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {section?.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section?.items?.map((item) => (
                <li key={item?.path}>
                  <button
                    onClick={() => handleNavigation(item?.path)}
                    title={isCollapsed ? item?.tooltip : ''}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                      nav-item-hover transition-all duration-150 ease-out
                      ${isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${isActivePath(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item?.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2025 FPVM Presence
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100
        ${isCollapsed ? 'lg:w-16' : 'lg:w-72'}
        bg-card border-r border-border sidebar-transition
      `}>
        <div className="flex flex-col w-full">
          <NavigationContent />
        </div>
      </aside>
      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-200 p-2 bg-card border border-border rounded-lg elevation-subtle"
      >
        <Icon name="Menu" size={20} />
      </button>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-400">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-6">
                {filteredNavigation?.map((section) => (
                  <div key={section?.section}>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      {section?.section}
                    </h3>
                    <ul className="space-y-1">
                      {section?.items?.map((item) => (
                        <li key={item?.path}>
                          <button
                            onClick={() => handleNavigation(item?.path)}
                            className={`
                              w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                              nav-item-hover transition-all duration-150 ease-out
                              ${isActivePath(item?.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted hover:text-foreground'
                              }
                            `}
                          >
                            <Icon 
                              name={item?.icon} 
                              size={20} 
                              className={`flex-shrink-0 ${isActivePath(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                            />
                            <span className="truncate">{item?.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {filteredNavigation?.slice(0, 4)?.map((section) => 
            section?.items?.slice(0, 1)?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg
                  ${isActivePath(item?.path)
                    ? 'text-primary' :'text-muted-foreground'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-medium">{item?.label}</span>
              </button>
            ))
          )}
        </div>
      </nav>
      {/* Mobile Scanner FAB */}
      {userRole !== 'user' && (
        <button
          onClick={() => handleNavigation('/qr-code-scanner')}
          className="lg:hidden fixed bottom-20 right-6 z-200 w-14 h-14 bg-primary text-primary-foreground rounded-full elevation-moderate flex items-center justify-center"
        >
          <Icon name="QrCode" size={24} />
        </button>
      )}
    </>
  );
};

export default NavigationSidebar;
import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MemberPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const itemsPerPageOptions = [
    { value: 12, label: '12 per page' },
    { value: 24, label: '24 per page' },
    { value: 48, label: '48 per page' },
    { value: 96, label: '96 per page' }
  ];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, '...');
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-card border border-border rounded-lg p-4">
      {/* Items Info */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} members
        </span>
        
        <div className="w-32">
          <Select
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
          />
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          iconName="ChevronLeft"
          iconSize={16}
        />

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages()?.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          iconName="ChevronRight"
          iconSize={16}
        />
      </div>
      {/* Quick Jump */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-muted-foreground">Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          className="w-16 px-2 py-1 text-center border border-border rounded text-sm"
          onKeyPress={(e) => {
            if (e?.key === 'Enter') {
              const page = parseInt(e?.target?.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
                e.target.value = '';
              }
            }
          }}
          placeholder={currentPage?.toString()}
        />
      </div>
    </div>
  );
};

export default MemberPagination;
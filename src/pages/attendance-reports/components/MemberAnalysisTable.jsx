import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MemberAnalysisTable = ({ members = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'attendanceRate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members?.filter(member =>
      member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      member?.surname?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      member?.group?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      member?.synod?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [members, searchTerm, sortConfig]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedMembers?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedMembers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedMembers?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getAttendanceRateBg = (rate) => {
    if (rate >= 80) return 'bg-success/10';
    if (rate >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header with Search */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Analyse des membres ({filteredAndSortedMembers?.length})
          </h3>
          <div className="w-full sm:w-80">
            <Input
              type="search"
              placeholder="Rechercher par nom, groupe, synode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Membre</span>
                  <Icon name={getSortIcon('name')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('group')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Groupe</span>
                  <Icon name={getSortIcon('group')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('synod')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Synode</span>
                  <Icon name={getSortIcon('synod')} size={16} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('totalAttendance')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Présences</span>
                  <Icon name={getSortIcon('totalAttendance')} size={16} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('attendanceRate')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Taux</span>
                  <Icon name={getSortIcon('attendanceRate')} size={16} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('avgDuration')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Durée moy.</span>
                  <Icon name={getSortIcon('avgDuration')} size={16} />
                </button>
              </th>
              <th className="text-center p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('lastAttendance')}
                  className="flex items-center space-x-2 hover:text-foreground transition-colors"
                >
                  <span>Dernière présence</span>
                  <Icon name={getSortIcon('lastAttendance')} size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers?.map((member) => (
              <tr key={member?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={member?.photo}
                        alt={`${member?.name} ${member?.surname}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">
                        {member?.name} {member?.surname}
                      </div>
                      <div className="text-sm text-muted-foreground">{member?.church}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {member?.group}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{member?.synod}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="font-medium text-card-foreground">{member?.totalAttendance}</span>
                </td>
                <td className="p-4 text-center">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceRateBg(member?.attendanceRate)} ${getAttendanceRateColor(member?.attendanceRate)}`}>
                    {member?.attendanceRate}%
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm text-card-foreground">{member?.avgDuration}min</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm text-muted-foreground">
                    {new Date(member.lastAttendance)?.toLocaleDateString('fr-FR')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredAndSortedMembers?.length)} sur {filteredAndSortedMembers?.length} membres
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberAnalysisTable;
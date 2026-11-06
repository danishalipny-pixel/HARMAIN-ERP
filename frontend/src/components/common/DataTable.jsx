import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  filterField = null,
  filterOptions = [],
  onRowClick = null,
  exportFileName = 'harmain_erp_export.csv'
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter dropdown check
      if (filter && filterField && item[filterField] !== filter) {
        return false;
      }
      // Search check across all visible string values
      if (search) {
        const q = search.toLowerCase();
        const matches = Object.values(item).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
          return String(val).toLowerCase().includes(q);
        });
        if (!matches) return false;
      }
      return true;
    });
  }, [data, search, filter, filterField]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (data.length === 0) return;
    const exportCols = columns.filter(c => c.accessor);
    const headers = exportCols.map(c => `"${c.header}"`).join(',');
    const rows = filteredData.map(row => {
      return exportCols.map(c => {
        let val = typeof c.accessor === 'function' ? c.accessor(row) : row[c.accessor];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {filterField && filterOptions.length > 0 && (
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
            >
              <option value="">All Statuses</option>
              {filterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0A4D3C] bg-white border border-[#0A4D3C]/30 hover:bg-[#E8F5F1] rounded-xl transition-all shadow-2xs"
            title="Download CSV / Excel Report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#0A4D3C]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-100/75 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-emerald-50/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, cIdx) => {
                    let cellValue = null;
                    if (col.render) {
                      cellValue = col.render(row);
                    } else if (typeof col.accessor === 'function') {
                      cellValue = col.accessor(row);
                    } else {
                      cellValue = row[col.accessor];
                    }
                    return (
                      <td key={cIdx} className={`px-4 py-3.5 ${col.className || ''}`}>
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
        <div>
          Showing <span className="font-semibold text-gray-700">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-semibold text-gray-700">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
          <span className="font-semibold text-gray-700">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

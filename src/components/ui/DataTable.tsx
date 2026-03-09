import { useState, useEffect, useMemo, useCallback, memo } from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
}

const TableRow = memo<{
  row: any;
  columns: Column<any>[];
  showActions: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  isMobile?: boolean;
}>(({ row, columns, showActions, onEdit, onDelete, isMobile }) => {
  if (isMobile) {
    // Mobile card view
    return (
      <div className="datatable-mobile-card">
        {columns.slice(0, 2).map((column) => (
          <div key={String(column.key)} className="mobile-card-row">
            <span className="mobile-card-label">{column.label}</span>
            <span className="mobile-card-value">
              {column.render
                ? column.render(row[column.key], row)
                : String(row[column.key])}
            </span>
          </div>
        ))}
        {showActions && (onEdit || onDelete) && (
          <div className="mobile-card-actions">
            {onEdit && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit(row)}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(row.Id)}
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <tr key={row.Id}>
      {columns.map((column) => (
        <td key={String(column.key)} className="align-middle">
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key])}
        </td>
      ))}
      {showActions && (onEdit || onDelete) && (
        <td className="align-middle">
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Acciones"
            >
              ⋮
            </button>
            <ul className="dropdown-menu">
              {onEdit && (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => onEdit(row)}
                  >
                    Editar
                  </button>
                </li>
              )}
              {onDelete && (
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => onDelete(row.Id)}
                  >
                    Eliminar
                  </button>
                </li>
              )}
            </ul>
          </div>
        </td>
      )}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

function DataTable<T extends { Id: number }>({
  data,
  columns,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  showActions = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (loading) {
    return <div className="alert alert-info">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="alert alert-info">{emptyMessage}</div>;
  }

  return (
    <div className="card shadow-sm border-0 mt-4">
      {!isMobile ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)} style={{ width: column.width }} className="fw-bold">
                    {column.label}
                  </th>
                ))}
                {showActions && onEdit && <th style={{ width: "80px" }} className="fw-bold">Acciones</th>}
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {paginatedData.map((row) => (
                <TableRow
                  key={row.Id}
                  row={row}
                  columns={columns}
                  showActions={showActions}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isMobile={false}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="datatable-mobile-view">
          {paginatedData.map((row) => (
            <TableRow
              key={row.Id}
              row={row}
              columns={columns}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              isMobile={true}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center border-top pt-2 pt-md-3 pb-2 pb-md-3" aria-label="Page navigation">
          <ul className="pagination mb-0 flex-wrap">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>

            {pageNumbers.map((page, index) => (
              <li
                key={index}
                className={`page-item ${
                  page === currentPage ? "active" : ""
                } ${page === "..." ? "disabled" : ""}`}
              >
                {page === "..." ? (
                  <span className="page-link">...</span>
                ) : (
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(page as number)}
                    disabled={page === "..."}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="card-footer bg-light text-center text-muted">
        <span className="d-none d-md-inline">Página {currentPage} de {totalPages} | Total de registros: {data.length}</span>
        <span className="d-md-none">
          <span className="d-block">{currentPage}/{totalPages}</span>
          <span className="small">Total: {data.length}</span>
        </span>
      </div>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;

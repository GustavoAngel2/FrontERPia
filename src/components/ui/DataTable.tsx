import { useState, useEffect } from "react";

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
  const [paginatedData, setPaginatedData] = useState<T[]>([]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
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
  };

  if (loading) {
    return <div className="alert alert-info">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="alert alert-info">{emptyMessage}</div>;
  }

  return (
    <div className="card shadow-sm border-0 mt-4">
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
              <tr key={row.Id}>
                {columns.map((column) => (
                  <td key={String(column.key)} className="align-middle">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
                {showActions && onEdit && (
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
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onEdit(row)}
                          >
                            ✏️ Editar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center border-top pt-3 pb-3" aria-label="Page navigation">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>

            {getPageNumbers().map((page, index) => (
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

      <div className="card-footer bg-light text-center text-muted small">
        Página {currentPage} de {totalPages} | Total de registros: {data.length}
      </div>
    </div>
  );
}

export default DataTable;

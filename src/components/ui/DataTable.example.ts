/**
 * DataTable Component - Reusable Table with Pagination
 * 
 * This is a generic, reusable table component that handles pagination automatically.
 * 
 * FEATURES:
 * - Automatic pagination with customizable items per page
 * - Smart page number display (shows ellipsis for large page counts)
 * - Previous/Next navigation buttons
 * - Custom column rendering
 * - Edit and Delete action buttons
 * - Loading and empty states
 * - Fully typed with TypeScript generics
 * 
 * USAGE EXAMPLE:
 * 
 * import DataTable, { Column } from "../../ui/DataTable";
 * 
 * // Define columns for your data
 * const columns: Column<Producto>[] = [
 *   { key: "Id", label: "ID", width: "60px" },
 *   { key: "Codigo", label: "Código" },
 *   { key: "Descripcion", label: "Descripción" },
 *   {
 *     key: "PrecioVenta",
 *     label: "Precio",
 *     render: (value) => `$${value.toFixed(2)}`,
 *   },
 *   {
 *     key: "FechaRegistro",
 *     label: "Fecha Registro",
 *     render: (value) => new Date(value).toLocaleDateString(),
 *   },
 * ];
 * 
 * // In your component:
 * <DataTable
 *   data={productos}
 *   columns={columns}
 *   itemsPerPage={10}
 *   loading={loading}
 *   onEdit={(producto) => editarProducto(producto)}
 *   onDelete={(id) => eliminarProducto(id)}
 *   showActions={true}
 *   emptyMessage="No hay productos"
 * />
 * 
 * PROPS:
 * - data: T[] - Array of items to display (REQUIRED)
 * - columns: Column<T>[] - Column configuration (REQUIRED)
 * - itemsPerPage?: number - Items per page (default: 10)
 * - onEdit?: (item: T) => void - Edit callback
 * - onDelete?: (id: number) => void - Delete callback
 * - loading?: boolean - Show loading state (default: false)
 * - emptyMessage?: string - Message when no data (default: "No hay datos disponibles")
 * - showActions?: boolean - Show edit/delete buttons (default: true)
 * 
 * COLUMN INTERFACE:
 * - key: keyof T - Property key from data object (REQUIRED)
 * - label: string - Column header text (REQUIRED)
 * - render?: (value, row) => React.ReactNode - Custom render function
 * - width?: string - CSS width value (e.g., "100px", "20%")
 */

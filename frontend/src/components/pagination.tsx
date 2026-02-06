interface PaginationProps {
  page: number; // página atual
  totalPages: number; // total de páginas
  onPageChange: (newPage: number) => void; // callback para mudar página
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // não mostra se só tiver 1 página

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
      >
        Anterior
      </button>

      <span className="px-3 py-1 text-sm text-gray-700">
        Página {page} de {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;

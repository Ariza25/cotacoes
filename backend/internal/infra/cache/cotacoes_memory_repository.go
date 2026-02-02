package repository

import (
	"cotacoes/internal/domain"
	"cotacoes/internal/provider/brapi"
	"log"
)

type CotacoesBrapiRepo struct {
	Provider *brapi.BrapiProvider
	Snapshot domain.SnapshotRepository
}

func NewCotacoesBrapiRepo(
	provider *brapi.BrapiProvider,
	snapshot domain.SnapshotRepository,
) *CotacoesBrapiRepo {
	return &CotacoesBrapiRepo{
		Provider: provider,
		Snapshot: snapshot,
	}
}

func (r *CotacoesBrapiRepo) ListAllStocks(
	sector *string,
	page, perPage int,
) (*domain.AllStocksResponse, error) {

	sortBy := "volume"
	sortOrder := "desc"

	sectorValue := ""
	if sector != nil {
		sectorValue = *sector
	}

	log.Printf("🔎 Setor recebido: %s | Paginação: page=%d, perPage=%d", sectorValue, page, perPage)

	// Busca todos os dados da BRAPI (ou cache) para aplicar filtros e paginação localmente
	data, err := r.Provider.ListAllStocks(
		sectorValue,
		sortBy,
		sortOrder,
		1,
		2500, // Busca máximo para ter todos os dados disponíveis
	)
	if err == nil {

		log.Println("✅ Dados vindos da BRAPI")

		// 🔥 FILTRO LOCAL por setor (se especificado)
		allStocks := data.Stocks
		if sectorValue != "" {
			filtered := make([]domain.StockListItem, 0)
			for _, s := range data.Stocks {
				if s.Sector == sectorValue {
					filtered = append(filtered, s)
				}
			}
			allStocks = filtered
		}

		// 📄 APLICA PAGINAÇÃO
		totalCount := len(allStocks)
		totalPages := (totalCount + perPage - 1) / perPage // Arredonda para cima
		if totalPages == 0 {
			totalPages = 1
		}

		// Valida e ajusta página
		if page < 1 {
			page = 1
		}
		if page > totalPages {
			page = totalPages
		}

		// Calcula índices para slice
		startIdx := (page - 1) * perPage
		endIdx := startIdx + perPage
		if endIdx > totalCount {
			endIdx = totalCount
		}

		// Aplica paginação
		paginatedStocks := make([]domain.StockListItem, 0)
		if startIdx < totalCount {
			paginatedStocks = allStocks[startIdx:endIdx]
		}

		// Salva snapshot completo (sem paginação) para cache
		fullData := &domain.AllStocksResponse{
			Stocks:              data.Stocks,
			AvailableSectors:    data.AvailableSectors,
			AvailableStockTypes: data.AvailableStockTypes,
			Pagination: domain.Pagination{
				CurrentPage:  1,
				TotalPages:   1,
				ItemsPerPage: totalCount,
				TotalCount:   totalCount,
				HasNextPage:  false,
			},
		}
		_ = r.Snapshot.Save(fullData)

		// Retorna dados paginados
		return &domain.AllStocksResponse{
			Stocks:              paginatedStocks,
			AvailableSectors:    data.AvailableSectors,
			AvailableStockTypes: data.AvailableStockTypes,
			Pagination: domain.Pagination{
				CurrentPage:  page,
				TotalPages:   totalPages,
				ItemsPerPage: perPage,
				TotalCount:   totalCount,
				HasNextPage:  page < totalPages,
			},
		}, nil
	}

	log.Println("📦 BRAPI indisponível — usando snapshot salvo")

	cached, _, cacheErr := r.Snapshot.Load()
	if cacheErr == nil {
		// Aplica filtro e paginação no cache também
		allStocks := cached.Stocks
		if sectorValue != "" {
			filtered := make([]domain.StockListItem, 0)
			for _, s := range cached.Stocks {
				if s.Sector == sectorValue {
					filtered = append(filtered, s)
				}
			}
			allStocks = filtered
		}

		// Aplica paginação no cache
		totalCount := len(allStocks)
		totalPages := (totalCount + perPage - 1) / perPage
		if totalPages == 0 {
			totalPages = 1
		}

		if page < 1 {
			page = 1
		}
		if page > totalPages {
			page = totalPages
		}

		startIdx := (page - 1) * perPage
		endIdx := startIdx + perPage
		if endIdx > totalCount {
			endIdx = totalCount
		}

		paginatedStocks := make([]domain.StockListItem, 0)
		if startIdx < totalCount {
			paginatedStocks = allStocks[startIdx:endIdx]
		}

		return &domain.AllStocksResponse{
			Stocks:              paginatedStocks,
			AvailableSectors:    cached.AvailableSectors,
			AvailableStockTypes: cached.AvailableStockTypes,
			Pagination: domain.Pagination{
				CurrentPage:  page,
				TotalPages:   totalPages,
				ItemsPerPage: perPage,
				TotalCount:   totalCount,
				HasNextPage:  page < totalPages,
			},
		}, nil
	}

	return nil, err
}

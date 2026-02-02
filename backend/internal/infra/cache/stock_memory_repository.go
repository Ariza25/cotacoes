package repository

import (
	"cotacoes/internal/domain"
)

// StockMemoryRepo é um repositório mock em memória
// Ele implementa StockRepository e CotacoesRepository
type StockMemoryRepo struct {
	stocks   []domain.Stock
	cotacoes *domain.AllStocksResponse
}

// GetBySymbol retorna uma ação pelo símbolo
func (r *StockMemoryRepo) GetBySymbol(
	symbol, rangeParam, intervalParam string,
) (*domain.Stock, error) {

	for i := range r.stocks {
		if r.stocks[i].Symbol == symbol {
			return &r.stocks[i], nil
		}
	}

	return nil, domain.ErrStockNotFound
}

// ListAll retorna os dados da rota /cotacoes
func (r *StockMemoryRepo) ListAll() (*domain.AllStocksResponse, error) {
	return r.cotacoes, nil
}

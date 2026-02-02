package usecase

import (
	"errors"
	"strings"

	"cotacoes/internal/domain"
)

// Erros de domínio
var (
	ErrInvalidSymbol = errors.New("invalid stock symbol")
)

type GetStockUseCase struct {
	StockRepo domain.StockRepository
}

func NewGetStockUseCase(stockRepo domain.StockRepository) *GetStockUseCase {
	return &GetStockUseCase{
		StockRepo: stockRepo,
	}
}

// Execute retorna os detalhes de uma ação pelo símbolo
func (uc *GetStockUseCase) Execute(
	symbol, rangeParam, intervalParam string,
) (*domain.Stock, error) {

	symbol = strings.TrimSpace(symbol)
	if symbol == "" {
		return nil, ErrInvalidSymbol
	}

	// Defaults defensivos
	if rangeParam == "" {
		rangeParam = "1d"
	}
	if intervalParam == "" {
		intervalParam = "1d"
	}

	stock, err := uc.StockRepo.GetBySymbol(symbol, rangeParam, intervalParam)
	if err != nil {
		return nil, err
	}

	return stock, nil
}

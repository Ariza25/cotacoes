package usecase

import "cotacoes/internal/domain"

type ListTypesUseCase struct {
	provider domain.StockProvider
}

func NewListTypesUseCase(p domain.StockProvider) *ListTypesUseCase {
	return &ListTypesUseCase{provider: p}
}

func (uc *ListTypesUseCase) Execute() ([]string, error) {
	resp, err := uc.provider.ListAllStocks(
		"",
		"market_cap",
		"desc",
		1,
		2500,
	)
	if err != nil {
		return nil, err
	}

	// Metadata já pronta no domain
	if resp.AvailableStockTypes == nil {
		return []string{}, nil
	}
	return resp.AvailableStockTypes, nil
}

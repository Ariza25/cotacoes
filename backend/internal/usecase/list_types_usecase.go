package usecase

import "cotacoes/internal/domain"

type ListTypesUseCase struct {
	provider domain.StockProvider
}

func NewListTypesUseCase(p domain.StockProvider) *ListTypesUseCase {
	return &ListTypesUseCase{provider: p}
}

func (uc *ListTypesUseCase) Execute(sector string) ([]string, error) {
	resp, err := uc.provider.ListAllStocks(
		sector, // setor
		"",     // tipo
		"market_cap",
		"desc",
		1,
		2500,
	)
	if err != nil {
		return nil, err
	}

	// Se veio filtro de setor, derive tipos a partir dos itens filtrados
	if sector != "" {
		set := make(map[string]struct{})
		for _, s := range resp.Stocks {
			if s.Sector == sector && s.Type != "" {
				set[s.Type] = struct{}{}
			}
		}
		types := make([]string, 0, len(set))
		for t := range set {
			types = append(types, t)
		}
		return types, nil
	}

	// Metadata já pronta no domain
	if resp.AvailableStockTypes == nil {
		return []string{}, nil
	}
	return resp.AvailableStockTypes, nil
}

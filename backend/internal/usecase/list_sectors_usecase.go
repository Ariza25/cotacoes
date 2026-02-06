package usecase

import "cotacoes/internal/domain"

type ListSectorsUseCase struct {
	provider domain.StockProvider
}

func NewListSectorsUseCase(p domain.StockProvider) *ListSectorsUseCase {
	return &ListSectorsUseCase{provider: p}
}

func (uc *ListSectorsUseCase) Execute() ([]string, error) {
	resp, err := uc.provider.ListAllStocks(
		"", // setor
		"", // tipo
		"market_cap", "desc", 1, 200,
	)
	if err != nil {
		return nil, err
	}

	// Se o provider trouxe a lista pronta, use ela.
	if resp.AvailableSectors != nil {
		return resp.AvailableSectors, nil
	}

	set := make(map[string]struct{})

	for _, s := range resp.Stocks {
		if s.Sector != "" {
			set[s.Sector] = struct{}{}
		}
	}

	sectors := make([]string, 0, len(set))
	for sector := range set {
		sectors = append(sectors, sector)
	}

	return sectors, nil
}

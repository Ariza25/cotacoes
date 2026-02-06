package usecase

import "cotacoes/internal/domain"

type ListCotacoesUseCase struct {
	repo domain.CotacoesRepository
}

func NewListCotacoesUseCase(repo domain.CotacoesRepository) *ListCotacoesUseCase {
	return &ListCotacoesUseCase{repo: repo}
}

// Execute retorna os dados da rota /cotacoes
// Recebe filtro de setor + paginação
func (uc *ListCotacoesUseCase) Execute(
	sector, stockType *string,
	page, perPage int,
) (*domain.AllStocksResponse, error) {

	return uc.repo.ListAllStocks(sector, stockType, page, perPage)
}

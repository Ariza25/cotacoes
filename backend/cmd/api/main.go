package main

import (
	"log"

	"cotacoes/config"
	repository "cotacoes/internal/infra/cache"
	"cotacoes/internal/infra/http/handler"
	httpRouter "cotacoes/internal/infra/http/router"
	"cotacoes/internal/provider/brapi"
	"cotacoes/internal/usecase"
)

func main() {
	// Carrega variáveis de ambiente
	config.LoadEnv()

	apiKey := config.GetBrapiToken()
	if apiKey == "" {
		log.Fatal("Token da BRAPI não definido. Configure BRAPI_TOKEN (ou BRAPI_API_KEY).")
	}

	// Provider
	brapiProvider := brapi.NewBrapiProvider(apiKey)

	// Cache
	snapshotRepo := &repository.CotacoesFileCache{}

	// Repositório
	cotacoesRepo := repository.NewCotacoesBrapiRepo(
		brapiProvider,
		snapshotRepo,
	)

	// Use cases
	getStockUC := usecase.NewGetStockUseCase(brapiProvider)
	listCotacoesUC := usecase.NewListCotacoesUseCase(cotacoesRepo)
	listSectorsUC := usecase.NewListSectorsUseCase(brapiProvider)
	listTypesUC := usecase.NewListTypesUseCase(brapiProvider)

	// Handlers
	stockHandler := handler.NewStockHandler(
		getStockUC,
		listCotacoesUC,
	)

	metadataHandler := handler.NewMetadataHandler(
		listSectorsUC,
		listTypesUC,
	)

	// Router
	r := httpRouter.SetupRouter(httpRouter.Handlers{
		StockHandler:    stockHandler,
		MetadataHandler: metadataHandler,
	})

	// Server
	r.Run(":8080")
}

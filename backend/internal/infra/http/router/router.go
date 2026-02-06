package router

import (
	"cotacoes/internal/infra/http/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Handlers struct {
	StockHandler    *handler.StockHandler
	MetadataHandler *handler.MetadataHandler
}

func SetupRouter(h Handlers) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://frontend-cotacoes.onrender.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/stocks/:symbol", h.StockHandler.GetStockBySymbol)
	r.GET("/cotacoes", h.StockHandler.ListStocks)
	r.GET("/sectors", h.MetadataHandler.ListSectors)
	r.GET("/types", h.MetadataHandler.ListTypes)

	return r
}

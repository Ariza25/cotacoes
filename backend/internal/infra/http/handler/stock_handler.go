package handler

import (
	"net/http"
	"strconv"

	"cotacoes/internal/domain"
	"cotacoes/internal/usecase"

	"github.com/gin-gonic/gin"
)

type StockHandler struct {
	GetStockUC     *usecase.GetStockUseCase
	ListCotacoesUC *usecase.ListCotacoesUseCase
}

func NewStockHandler(
	getStockUC *usecase.GetStockUseCase,
	listCotacoesUC *usecase.ListCotacoesUseCase,
) *StockHandler {
	return &StockHandler{
		GetStockUC:     getStockUC,
		ListCotacoesUC: listCotacoesUC,
	}
}

// =======================
// GET /stocks/:symbol
// Ex: /stocks/PETR4?range=1y&interval=1d
// =======================
func (h *StockHandler) GetStockBySymbol(c *gin.Context) {
	symbol := c.Param("symbol")

	rangeParam := c.DefaultQuery("range", "1d")
	intervalParam := c.DefaultQuery("interval", "1d")

	stock, err := h.GetStockUC.Execute(symbol, rangeParam, intervalParam)
	if err != nil {
		status := http.StatusInternalServerError
		if err == domain.ErrStockNotFound {
			status = http.StatusNotFound
		}

		c.JSON(status, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, stock)
}

// =======================
// GET /cotacoes
// Ex: /cotacoes?page=1&perPage=10&sector=Finance
// =======================
func (h *StockHandler) ListStocks(c *gin.Context) {

	// Paginação
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	perPage, err := strconv.Atoi(c.DefaultQuery("perPage", "20"))
	if err != nil || perPage < 1 {
		perPage = 20
	}

	// Filtro de setor (opcional)
	sectorQuery := c.Query("sector")
	var sector *string
	if sectorQuery != "" {
		sector = &sectorQuery
	}

	// Filtro de tipo (opcional)
	typeQuery := c.Query("type")
	var stockType *string
	if typeQuery != "" {
		stockType = &typeQuery
	}

	result, err := h.ListCotacoesUC.Execute(sector, stockType, page, perPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

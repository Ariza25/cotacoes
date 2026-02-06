package handler

import (
	"net/http"

	"cotacoes/internal/usecase"

	"github.com/gin-gonic/gin"
)

type MetadataHandler struct {
	ListSectorsUC *usecase.ListSectorsUseCase
	ListTypesUC   *usecase.ListTypesUseCase
}

func NewMetadataHandler(
	listSectorsUC *usecase.ListSectorsUseCase,
	listTypesUC *usecase.ListTypesUseCase,
) *MetadataHandler {
	return &MetadataHandler{
		ListSectorsUC: listSectorsUC,
		ListTypesUC:   listTypesUC,
	}
}

// GET /sectors
func (h *MetadataHandler) ListSectors(c *gin.Context) {
	sectors, err := h.ListSectorsUC.Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sectors": sectors,
	})
}

// GET /types
func (h *MetadataHandler) ListTypes(c *gin.Context) {
	sector := c.Query("sector")
	types, err := h.ListTypesUC.Execute(sector)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"types": types,
	})
}

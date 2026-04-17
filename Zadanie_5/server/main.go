package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type Payment struct {
	Amount float64 `json:"amount"`
	Method string  `json:"method"`
}

var products = []Product{
	{ID: 1, Name: "Klawiatura Mechaniczna", Price: 350.00},
	{ID: 2, Name: "Myszka Bezprzewodowa", Price: 150.00},
	{ID: 3, Name: "Monitor 27 cali", Price: 1200.00},
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, 
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/api/products", func(c *gin.Context) {
		c.JSON(http.StatusOK, products)
	})

	r.POST("/api/payments", func(c *gin.Context) {
		var payment Payment
		if err := c.ShouldBindJSON(&payment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		log.Printf("Otrzymano płatność: %.2f PLN metodą: %s\n", payment.Amount, payment.Method)
		c.JSON(http.StatusOK, gin.H{"status": "sukces", "message": "Płatność zaakceptowana"})
	})

	r.Run(":8080")
}
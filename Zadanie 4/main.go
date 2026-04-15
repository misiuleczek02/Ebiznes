package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type Category struct {
	gorm.Model
	Name     string    `json:"name"`
	Products []Product `json:"products"` 
}

type Product struct {
	gorm.Model
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	CategoryID uint    `json:"category_id"`
}

type Cart struct {
	gorm.Model
	Status string `json:"status"`
}

func ExpensiveProducts(db *gorm.DB) *gorm.DB {
	return db.Where("price > ?", 100)
}

func main() {
	var err error
	db, err = gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
	if err != nil {
		panic("Nie udało się połączyć z bazą danych!")
	}

	db.AutoMigrate(&Category{}, &Product{}, &Cart{})

	e := echo.New()

	e.POST("/categories", createCategory)
	e.GET("/categories/:id/products", getProductsByCategory)

	e.GET("/products/expensive", getExpensiveProducts)

	e.POST("/products", createProduct)
	e.GET("/products", getProducts)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)

	e.POST("/carts", createCart)

	e.Logger.Fatal(e.Start(":8080"))
}

func createCategory(c echo.Context) error {
	category := new(Category)
	if err := c.Bind(category); err != nil {
		return err
	}
	db.Create(&category)
	return c.JSON(http.StatusCreated, category)
}

func getProductsByCategory(c echo.Context) error {
	id := c.Param("id")
	var category Category
	if err := db.Preload("Products").First(&category, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Nie znaleziono kategorii")
	}
	return c.JSON(http.StatusOK, category)
}

func createProduct(c echo.Context) error {
	product := new(Product)
	if err := c.Bind(product); err != nil {
		return err
	}
	db.Create(&product)
	return c.JSON(http.StatusCreated, product)
}

func getProducts(c echo.Context) error {
	var products []Product
	db.Find(&products)
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	id := c.Param("id")
	var product Product
	if err := db.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Nie znaleziono produktu")
	}
	return c.JSON(http.StatusOK, product)
}

func updateProduct(c echo.Context) error {
	id := c.Param("id")
	var product Product
	if err := db.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Nie znaleziono produktu")
	}
	
	if err := c.Bind(&product); err != nil {
		return err
	}
	db.Save(&product)
	return c.JSON(http.StatusOK, product)
}

func deleteProduct(c echo.Context) error {
	id := c.Param("id")
	db.Delete(&Product{}, id)
	return c.NoContent(http.StatusNoContent)
}

func getExpensiveProducts(c echo.Context) error {
	var products []Product
	db.Scopes(ExpensiveProducts).Find(&products)
	return c.JSON(http.StatusOK, products)
}

func createCart(c echo.Context) error {
	cart := Cart{Status: "aktywny"}
	db.Create(&cart)
	return c.JSON(http.StatusCreated, cart)
}
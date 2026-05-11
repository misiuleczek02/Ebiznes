package main

import (
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	_ = godotenv.Load()

	var err error
	db, err = gorm.Open(sqlite.Open("auth.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("nie udalo sie polaczyc z baza: ", err)
	}
	if err := db.AutoMigrate(&User{}); err != nil {
		log.Fatal("blad migracji: ", err)
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{clientURL()},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}))

	// 3.0 / 3.5 - logowanie/rejestracja przez serwer (bez OAuth2)
	e.POST("/auth/register", registerHandler)
	e.POST("/auth/login", loginHandler)

	// 4.0 - Google OAuth2
	e.GET("/auth/google", googleLogin)
	e.GET("/auth/google/callback", googleCallback)

	// 4.5 - GitHub OAuth2
	e.GET("/auth/github", githubLogin)
	e.GET("/auth/github/callback", githubCallback)

	// chroniony endpoint - wymaga WLASNEGO JWT serwera
	api := e.Group("/api")
	api.Use(authMiddleware)
	api.GET("/me", meHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("serwer startuje na :" + port)
	e.Logger.Fatal(e.Start(":" + port))
}

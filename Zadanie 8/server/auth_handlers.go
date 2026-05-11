package main

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type registerReq struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// 3.5 - rejestracja przez aplikację serwerową (bez OAuth2)
func registerHandler(c echo.Context) error {
	req := new(registerReq)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "zle dane")
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "email i haslo wymagane")
	}
	if len(req.Password) < 6 {
		return echo.NewHTTPError(http.StatusBadRequest, "haslo musi miec min. 6 znakow")
	}

	var existing User
	if err := db.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		return echo.NewHTTPError(http.StatusConflict, "uzytkownik juz istnieje")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "blad hasla")
	}

	user := User{
		Email:        req.Email,
		Username:     req.Username,
		PasswordHash: string(hash),
		Provider:     "local",
	}
	if err := db.Create(&user).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "nie udalo sie utworzyc uzytkownika")
	}

	token, err := generateToken(&user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "blad tokenu")
	}
	return c.JSON(http.StatusCreated, echo.Map{
		"token": token,
		"user":  user,
	})
}

// 3.0 - logowanie przez aplikację serwerową (bez OAuth2)
func loginHandler(c echo.Context) error {
	req := new(loginReq)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "zle dane")
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))

	var user User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return echo.NewHTTPError(http.StatusUnauthorized, "nieprawidlowy email lub haslo")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "blad bazy")
	}
	if user.PasswordHash == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "to konto loguje sie przez "+user.Provider)
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "nieprawidlowy email lub haslo")
	}

	token, err := generateToken(&user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "blad tokenu")
	}
	return c.JSON(http.StatusOK, echo.Map{
		"token": token,
		"user":  user,
	})
}

func meHandler(c echo.Context) error {
	uid := c.Get("userID").(uint)
	var user User
	if err := db.First(&user, uid).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "nie znaleziono uzytkownika")
	}
	return c.JSON(http.StatusOK, user)
}

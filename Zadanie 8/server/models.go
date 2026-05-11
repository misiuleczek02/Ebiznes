package main

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null" json:"email"`
	Username     string `json:"username"`
	PasswordHash string `json:"-"`

	Provider          string    `json:"provider"`
	ProviderUserID    string    `json:"provider_user_id,omitempty"`
	ProviderToken     string    `json:"-"`
	ProviderRefresh   string    `json:"-"`
	ProviderExpiresAt time.Time `json:"-"`
	AvatarURL         string    `json:"avatar_url"`
}

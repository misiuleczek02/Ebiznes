package models

import play.api.libs.json._

case class Product(id: Long, name: String, price: Double)

object Product {
  implicit val format: OFormat[Product] = Json.format[Product]
}
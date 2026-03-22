package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product
import scala.collection.mutable.ListBuffer

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val products = ListBuffer(
    Product(1, "Laptop", 3500.00),
    Product(2, "Klawiatura", 150.00)
  )

  def add(): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Product]) match {
      case Some(product) =>
        products += product
        Created(Json.toJson(product))
      case None =>
        BadRequest("Nieprawidłowy format danych")
    }
  }

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def getById(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound("Produkt nie znaleziony")
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Product]) match {
      case Some(updatedProduct) =>
        val index = products.indexWhere(_.id == id)
        if (index != -1) {
          products.update(index, updatedProduct)
          Ok(Json.toJson(updatedProduct))
        } else {
          NotFound("Produkt nie znaleziony")
        }
      case None => BadRequest("Nieprawidłowy format danych")
    }
  }

  def delete(id: Long): Action[AnyContent] = Action {
    val index = products.indexWhere(_.id == id)
    if (index != -1) {
      products.remove(index)
      NoContent
    } else {
      NotFound("Produkt nie znaleziony")
    }
  }
}
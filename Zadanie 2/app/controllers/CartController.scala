package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Cart
import scala.collection.mutable.ListBuffer

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  // Nasza "baza danych" elementów w koszyku
  private val cartItems = ListBuffer(
    Cart(1, 1, 2), // id wpisu: 1, id produktu: 1, ilość: 2
    Cart(2, 2, 1)  // id wpisu: 2, id produktu: 2, ilość: 1
  )

  // CREATE (POST)
  def add(): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Cart]) match {
      case Some(item) =>
        cartItems += item
        Created(Json.toJson(item))
      case None =>
        BadRequest("Nieprawidłowy format danych")
    }
  }

  // READ ALL (GET)
  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(cartItems))
  }

  // READ BY ID (GET)
  def getById(id: Long): Action[AnyContent] = Action {
    cartItems.find(_.id == id) match {
      case Some(item) => Ok(Json.toJson(item))
      case None => NotFound("Element koszyka nie znaleziony")
    }
  }

  // UPDATE (PUT)
  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Cart]) match {
      case Some(updatedItem) =>
        val index = cartItems.indexWhere(_.id == id)
        if (index != -1) {
          cartItems.update(index, updatedItem)
          Ok(Json.toJson(updatedItem))
        } else {
          NotFound("Element koszyka nie znaleziony")
        }
      case None => BadRequest("Nieprawidłowy format danych")
    }
  }

  // DELETE (DELETE)
  def delete(id: Long): Action[AnyContent] = Action {
    val index = cartItems.indexWhere(_.id == id)
    if (index != -1) {
      cartItems.remove(index)
      NoContent
    } else {
      NotFound("Element koszyka nie znaleziony")
    }
  }
}
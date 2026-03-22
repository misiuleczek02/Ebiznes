package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Category
import scala.collection.mutable.ListBuffer

@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  // Nasza "baza danych" kategorii
  private val categories = ListBuffer(
    Category(1, "Elektronika"),
    Category(2, "Książki")
  )

  // CREATE (POST)
  def add(): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Category]) match {
      case Some(category) =>
        categories += category
        Created(Json.toJson(category))
      case None =>
        BadRequest("Nieprawidłowy format danych")
    }
  }

  // READ ALL (GET)
  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(categories))
  }

  // READ BY ID (GET)
  def getById(id: Long): Action[AnyContent] = Action {
    categories.find(_.id == id) match {
      case Some(category) => Ok(Json.toJson(category))
      case None => NotFound("Kategoria nie znaleziona")
    }
  }

  // UPDATE (PUT)
  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    request.body.asJson.flatMap(_.asOpt[Category]) match {
      case Some(updatedCategory) =>
        val index = categories.indexWhere(_.id == id)
        if (index != -1) {
          categories.update(index, updatedCategory)
          Ok(Json.toJson(updatedCategory))
        } else {
          NotFound("Kategoria nie znaleziona")
        }
      case None => BadRequest("Nieprawidłowy format danych")
    }
  }

  // DELETE (DELETE)
  def delete(id: Long): Action[AnyContent] = Action {
    val index = categories.indexWhere(_.id == id)
    if (index != -1) {
      categories.remove(index)
      NoContent
    } else {
      NotFound("Kategoria nie znaleziona")
    }
  }
}
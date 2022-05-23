import { AccessRecipe } from './recipesAccess'
import { RecipeItem } from '../models/RecipeItem'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest'
import * as uuid from 'uuid'
import { createUploadPresignedUrl } from './attachmentUtils'

// [DONE]: Implement businessLogic
const recipesAccess = new AccessRecipe()

// This GETS ALL the Recipe items for the user
export async function getUserRecipes(userId: string): Promise<any> {
  return await recipesAccess.getAllRecipes(userId)
}

// This GETS A SPECIFIC Recipe item for the user
export async function getRecipe(
  userId: string,
  recipeId: string
): Promise<RecipeItem[]> {
  return await recipesAccess.getUserRecipe(userId, recipeId)
}

// This CREATES a Recipe item for the user
export async function createRecipe(
  createRecipeRequest: CreateRecipeRequest,
  userId: string
): Promise<RecipeItem> {
  const createdAt = new Date().toISOString()
  var done = false
  const recipeId = uuid.v4()

  if (new Date().getTime() > new Date(createRecipeRequest.dueDate).getTime()) {
    done = true
  }
  return await recipesAccess.createRecipe({
    userId,
    recipeId,
    createdAt,
    attachmentUrl: '',
    name: createRecipeRequest.name,
    dueDate: createRecipeRequest.dueDate,
    done: done
  })
}

// This UPDATES a Recipe item for the user
export async function updateRecipe(
  updateRecipeRequest: UpdateRecipeRequest,
  userId: string,
  recipeId: string
): Promise<RecipeItem> {
  return await recipesAccess.updateRecipe({
    userId,
    recipeId,
    name: updateRecipeRequest.name,
    dueDate: updateRecipeRequest.dueDate,
    done: updateRecipeRequest.done
  })
}

// This DELETES a Recipe item for the user
export async function deleteRecipe(userId: string, recipeId: string) {
  return await recipesAccess.deleteRecipe(userId, recipeId)
}

// This UPDATES the Attachment's URL of a Recipe item for the user
export async function createAttachmentPresignedUrl(
  userId: string,
  recipeId: string
): Promise<string> {
  const uploadUrl: string = await createUploadPresignedUrl(recipeId)
  await recipesAccess.updateAttachmentUrl(userId, recipeId, uploadUrl)
  return uploadUrl
}

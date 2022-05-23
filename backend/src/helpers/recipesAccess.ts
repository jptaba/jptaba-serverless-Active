import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { RecipeItem } from '../models/RecipeItem'
import { createLogger } from '../utils/logger'

// [DONE]: Implement the dataLayer logic
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AccessRecipe')

export class AccessRecipe {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly recipeTable = process.env.RECIPES_TABLE
  ) {}

  // This will access and read all Recipe items for the user
  async getAllRecipes(userId: string): Promise<RecipeItem[]> {
    logger.info(`Getting all recipes for user: ${userId}`)
    const result = await this.docClient
      .query({
        TableName: this.recipeTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as RecipeItem[]
  }

  // This will access and read a specific Recipe item for the user
  async getUserRecipe(userId: string, recipeId: string): Promise<RecipeItem[]> {
    logger.info(`Getting recipe: ${recipeId} for user: ${userId}`)
    const result = await this.docClient
      .query({
        TableName: this.recipeTable,
        KeyConditionExpression: 'userId = :userId AND recipeId = :recipeId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':recipeId': recipeId
        }
      })
      .promise()

    const items = result.Items

    return items as RecipeItem[]
  }

  // This will access and create a new Recipe item for the user
  async createRecipe(recipeEntry: RecipeItem): Promise<RecipeItem> {
    logger.info(`Creating recipe: ${recipeEntry}`)
    await this.docClient
      .put({
        TableName: this.recipeTable,
        Item: recipeEntry
      })
      .promise()

    return Promise.resolve(recipeEntry)
  }

  // This will access and update a Recipe item for the user
  async updateRecipe(updatedRecipe: any): Promise<RecipeItem> {
    logger.info(`Updating recipe: ${updatedRecipe}`)
    await this.docClient
      .update({
        TableName: this.recipeTable,
        Key: {
          recipeId: updatedRecipe.recipeId,
          userId: updatedRecipe.userId
        },
        ExpressionAttributeNames: { '#N': 'name' },
        UpdateExpression: 'set #N = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': updatedRecipe.name,
          ':dueDate': updatedRecipe.dueDate,
          ':done': updatedRecipe.done
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return updatedRecipe
  }

  // This will access and delete a Recipe item for the user
  async deleteRecipe(userId: string, recipeId: string) {
    logger.info(`Deleting recipe: ${recipeId}, from user: ${userId}`)
    await this.docClient.delete({
      TableName: this.recipeTable,
      Key: {
        recipeId,
        userId
      }
    })
  }

  // This will access and update attachment URL of a Recipe item for the user
  async updateAttachmentUrl(
    userId: string,
    recipeId: string,
    uploadUrl: string
  ) {
    logger.info(`Updating the image URL: ${uploadUrl} of recipe ${recipeId}`)
    console.log('updateAttachmentUrl' + uploadUrl.split('?')[0])
    await this.docClient
      .update({
        TableName: this.recipeTable,
        Key: { userId, recipeId },
        UpdateExpression: 'set attachmentUrl=:URL',
        ExpressionAttributeValues: {
          ':URL': uploadUrl.split('?')[0]
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  }
}

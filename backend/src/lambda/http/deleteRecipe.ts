import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteRecipe, getRecipe } from '../../helpers/recipes'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteRecipe')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId

    // [DONE]: Remove a RECIPE item by id
    logger.info('Delete a Recipe event: ', event.pathParameters.recipeId)
    const userId = getUserId(event)
    const item = await getRecipe(userId, recipeId)

    if (item.length === 0) {
      logger.info('Invalid recipeId: ', recipeId)
      return {
        statusCode: 404,
        body: 'recipeId not found'
      }
    }

    await deleteRecipe(userId, recipeId)

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getRecipe, updateRecipe } from '../../helpers/recipes'
import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateRecipe')

// [DONE]: Update a RECIPE item with the provided id using values in the "updatedRecipe" object

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Update a Recipe event: ', event.pathParameters.recipeId)
    const recipeId = event.pathParameters.recipeId
    const userId = await getUserId(event)
    const item = await getRecipe(userId, recipeId)

    if (item.length == 0) {
      return {
        statusCode: 404,
        body: 'recipeId not found'
      }
    }

    const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
    const items = await updateRecipe(updatedRecipe, userId, recipeId)
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

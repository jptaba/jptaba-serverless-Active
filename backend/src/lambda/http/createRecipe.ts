import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'
import { getUserId } from '../utils'
import { createRecipe } from '../../helpers/recipes'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createRecipe')

// [DONE]: Implement creating a new RECIPE item

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Create a Recipe event: ', event.body)
    const newRecipe: CreateRecipeRequest = JSON.parse(event.body)
    const newItem = await createRecipe(newRecipe, getUserId(event))
    if (newRecipe.name == null) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Empty recipe name, please try again!'
        })
      }
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

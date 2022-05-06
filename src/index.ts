import mongoose, { Schema } from 'mongoose';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'

const { stringify } = JSON

mongoose.connect('mongodb+srv://mn198:mn198@cluster0.s5xbw.mongodb.net/test_serverless?retryWrites=true&w=majority')

const Post = new Schema({
  title: String,
  body: String,
});

const PostModel = mongoose.model('posts', Post);

export const createPost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async function serverlessWebpack(event, context, callback) {
  const data = JSON.parse(event.body || '');
  const newPost = await PostModel.create(data);
  return {
    body: stringify(newPost),
    statusCode: 200,
  }
}

export const hello: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async function serverlessWebpack(event, context, callback) {
  const data = { hello: 'test' }
  return {
    body: stringify(data),
    statusCode: 200,
  }
}

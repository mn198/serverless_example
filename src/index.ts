import mongoose, { Schema, Types } from 'mongoose';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'
import * as qs from 'query-string'
const { stringify } = JSON

mongoose.connect('mongodb+srv://mn198:mn198@cluster0.s5xbw.mongodb.net/test_serverless?retryWrites=true&w=majority')

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

const Post = new Schema({
  title: String,
  body: String,
}, {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
});

const PostModel = mongoose.model('posts', Post);

export const createPost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context, callback) => {
  const data = qs.parse(event.body || '');
  const newPost = await PostModel.create(data);
  return {
    body: stringify(newPost),
    statusCode: 200,
  }
}

export const getPost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context, callback) => {
  const id = event.pathParameters?.id || '';

  if (Types.ObjectId.isValid(id)) {
    const post = await PostModel.findOne({ _id: id });
    if (post) {
      return {
        body: stringify(post),
        statusCode: 200,
      }
    }
  }
  return {
    body: 'id not found',
    statusCode: 404,
  }
}

export const getAllPost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context, callback) => {
  const post = await PostModel.find({});
  if (post) {
    return {
      body: stringify(post),
      statusCode: 200,
    }
  }

  return {
    body: 'id not found',
    statusCode: 404,
  }
}

export const updatePost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context, callback) => {
  const id = event.pathParameters?.id || '';
  const { title, body } = qs.parse(event.body || '');

  if (Types.ObjectId.isValid(id)) {
    const post = await PostModel.findOneAndUpdate(
      { _id: id },
      { $set: { title, body } },
      { new: true },
    );
    if (post) {
      return {
        body: stringify(post),
        statusCode: 200,
      }
    }
  }

  return {
    body: 'id not found',
    statusCode: 404,
  }
}

export const deletePost: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context, callback) => {
  const id = event.pathParameters?.id || '';

  if (Types.ObjectId.isValid(id)) {
    const post = await PostModel.findOneAndRemove({ _id: id });
    if (post) {
      return {
        body: stringify(post),
        statusCode: 200,
      }
    }
  }

  return {
    body: 'id not found',
    statusCode: 404,
  }
}

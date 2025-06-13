/**
 * Comment schema – supports threaded replies
 */

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    recipe : { type : mongoose.Schema.Types.ObjectId, ref : 'Recipe', required : true },
    author : { type : mongoose.Schema.Types.ObjectId, ref : 'User',   required : true },
    content: { type : String,                        required : true },
    parent : { type : mongoose.Schema.Types.ObjectId, ref : 'Comment', default : null } 
  },
  { timestamps : true }
);

export default mongoose.model('Comment', commentSchema);

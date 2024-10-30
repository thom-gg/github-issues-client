import { CommentObject } from "../../services/fetchComments";
import { IssueObject } from "../../services/fetchIssues";
import { ResultItem } from "../ResultItem/ResultItem";
import { SingleComment } from "../SingleComment/SingleComment";

import './Comments.css'

interface Props {
    commentsList: CommentObject[]
}


export const Comments: React.FC<Props> = ({ commentsList }) => {



    return (
        <div className="commentsList">
            <h1>Comments</h1>
            {commentsList.map((c, index) =>
                <SingleComment key={"singleComment" + index} comment={c} />)}
        </div>
    );
}
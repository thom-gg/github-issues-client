import { GithubUser } from "./fetchIssues";

export interface CommentObject {
    user: GithubUser,
    created_at: Date,
    updated_at: Date,
    body: string,

    reactions_plus1: number,
    reactions_minus1: number,
    reactions_confused: number,
    reactions_eyes: number,
    reactions_heart: number,
    reactions_hooray: number,
    reactions_laugh: number,
    reactions_rocket: number
}


export async function fetchComments(url: string): Promise<CommentObject[]> {
    const request = await fetch(url);
    const data = await request.json();

    let output = [];

    for (let i = 0; i < data.length; i++) {
        let user: GithubUser = {
            login: data[i].user.login,
            avatar_url: data[i].user.avatar_url
        };

        output.push({
            user: user,
            created_at: new Date(data[i].created_at),
            updated_at: new Date(data[i].updated_at),
            body: data[i].body,

            reactions_plus1: data[i].reactions["+1"],
            reactions_minus1: data[i].reactions["-1"],
            reactions_confused: data[i].reactions.confused,
            reactions_eyes: data[i].reactions.eyes,
            reactions_heart: data[i].reactions.heart,
            reactions_hooray: data[i].reactions.hooray,
            reactions_laugh: data[i].reactions.laugh,
            reactions_rocket: data[i].reactions.rocket,
        });
    }
    return output;
}
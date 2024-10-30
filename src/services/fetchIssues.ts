import { Octokit } from "octokit";


export interface ApiResult {
    issueList: IssueObject[];
    totalPages: number
}

export interface IssueObject {
    id: string,
    state: string,
    comments: number,
    comments_url: string,
    user: GithubUser,
    title: string,
    body: string,
    created_at: Date,
    updated_at: Date,
    number: number,

    reactions_plus1: number,
    reactions_minus1: number,
    reactions_confused: number,
    reactions_eyes: number,
    reactions_heart: number,
    reactions_hooray: number,
    reactions_laugh: number,
    reactions_rocket: number


}

export interface GithubUser {
    avatar_url: string,
    login: string,
}

function parseLinkHeader(linkHeader: string): number {
    // Get the numero of last page
    let links = linkHeader.split(",");
    for (let i = 0; i < links.length; i++) {
        if (links[i].includes(`rel=\"last\"`)) {
            let splitted = links[i].split("/");
            let args = splitted[splitted.length - 1];
            let argsSplitted = args.split("&");
            for (let j = 0; j < argsSplitted.length; j++) {
                if (argsSplitted[j].startsWith("page=")) {
                    return parseInt(argsSplitted[j].split("=")[1]);
                }
            }
        }
    }
    return -1;
}


export async function fetchIssues(inputUrl: string, inputPage: number): Promise<ApiResult> {
    // Checking validity of url
    let elems = inputUrl.split("/");
    // We should have ['https:', '', 'github.com', owner, repo];
    if (elems.length < 5) {
        throw new Error('Invalid repository link');
    }
    if (elems[2] != "github.com") {
        throw new Error(("Invalid link: is not from github.com"));
    }
    let owner = elems[3];
    let repo = elems[4];

    // Octokit is GitHub library to interact with it's API
    const octokit = new Octokit();
    const request = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
        owner: owner,
        repo: repo,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        page: inputPage,
        per_page: 10
    })
    const data = request.data;

    // Getting the index of the last page (for page navigation)
    let hasLink = request.headers.link != undefined;
    let nbPages = inputPage;
    if (hasLink) {
        nbPages = parseLinkHeader(request.headers.link);
        if (nbPages == -1) { nbPages = inputPage; }
    }


    let output: IssueObject[] = [];
    for (let i = 0; i < data.length; i++) {
        let current = data[i];
        let isPullRequest = current.pull_request != undefined;
        // Leaving the pull requests for now, because removing them would cause inconsistent page length, unless I handle
        // all the pagination myself, but GitHub API already has a pagination system

        // if (isPullRequest) {
        //     continue;
        // }

        let user: GithubUser = {
            avatar_url: current.user.avatar_url,
            login: current.user.login
        };

        let issue: IssueObject = {
            id: current.id,
            state: current.state,
            comments: current.comments,
            comments_url: current.comments_url,
            user: user,
            title: current.title,
            body: current.body,
            created_at: new Date(current.created_at),
            updated_at: new Date(current.updated_at),
            number: current.number,

            reactions_plus1: current.reactions["+1"],
            reactions_minus1: current.reactions["-1"],
            reactions_confused: current.reactions.confused,
            reactions_eyes: current.reactions.eyes,
            reactions_heart: current.reactions.heart,
            reactions_hooray: current.reactions.hooray,
            reactions_laugh: current.reactions.laugh,
            reactions_rocket: current.reactions.rocket,
        };
        output.push(issue);

    }
    let result: ApiResult = {
        issueList: output,
        totalPages: nbPages
    };
    return result;

}
// helper func return json
const getJson = async (url, errorMsg = "Hmm something went wrong") => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`${errorMsg} (${response.status})`);
	}
	return response.json();
};

const returnListing = (children) => {
	const listing = [];
	children.forEach((child) => {
		const short = child.data;
		listing.push({
			id: short.id,
			url: short.url,
			author: short.author,
			title: short.title,
			subreddit: short.subreddit,
			thumbnail: short.thumbnail,
			selftext: short.selftext,
			created: short.created_utc,
		});
	});
	return listing;
};

const filterByMedia = (response) => {
	const result = [...response.data.children].filter((child) => {
		return !child.data.is_video && child.data.is_reddit_media_domain;
	});
	return result;
};

// Reddit componenent
const Reddit = {
	async fetchHomePage(conditions = {}) {
		// Defining the url for the fetch
		let endpoint;
		const { searchTerm , subreddit, after } = conditions
		console.log("Here")
		console.log(`After: ${after}`)
		if(subreddit != "None" && !searchTerm){
			endpoint = `https://www.reddit.com/r/${subreddit}/new.json`;	
		}else if(subreddit != "None" && searchTerm){
			endpoint = `https://www.reddit.com/r/${subreddit}/search.json?q=${searchTerm}&restrict_sr=1&sr_nsfw=&is_multi=1&sort=new`;
		}else if(searchTerm){
			endpoint = `https://www.reddit.com/user/outside-research4792/m/cats/search.json?q=${searchTerm}&restrict_sr=1&sr_nsfw=&is_multi=1&sort=new`;
		} else{
			endpoint = `https://www.reddit.com/user/outside-research4792/m/cats.json`;
		}

		if(after && after !== "initial"){
			const lastLetter = endpoint.slice(-1)
			if(lastLetter === "n"){
				endpoint += "?"
			}else{
				endpoint += "&"
			}
			endpoint += `count=25&after=${after}`
		}

		console.log(endpoint)

		try {		
			const response = await getJson(endpoint);
			// if we want to get the first frontpage. this fetches it the first time as we are not passing an after parameter
			const children = filterByMedia(response);
			// Make the listing array of objects
			const listing = returnListing(children);
			// Returning and object with two keys
			return {
				after: response.data.after,
				listing: listing,
				subreddit: subreddit,
				searchTerm: searchTerm
			};
		} catch (err) {
			return err.message;
		}
	},

	async fetchPostPage(subreddit, id) {
		const endpoint = `https://www.reddit.com/r/${subreddit}/comments/${id}.json`;

		try {
			const response = await getJson(endpoint);

			// Creating Post Object
			let short = response[0].data.children[0].data;

			const post = {
				id: short.id,
				url: short.permalink,
				author: short.author,
				title: short.title,
				thumbnail: short.thumbnail,
				created: short.created,
			};

			// Creating Comments Array
			const comments = response[1].data.children;
			const newComments = [];

			comments.forEach((comment) => {
				short = comment.data;
				newComments.push({
					id: short.id,
					author: short.author,
					body: short.body,
					ups: short.ups,
					created: short.created,
				});
			});

			// Returning and object with two keys
			return {
				post: post,
				comments: newComments,
			};
		} catch (err) {
			return err.message;
		}
	}
};

export default Reddit;

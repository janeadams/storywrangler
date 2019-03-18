# Fetch Helpers

> Response handlers and helpers to parse JSON and deal with HTTP errors when using the [browser fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Usage

Install with [yarn](https://yarnpkg.com/en/):

```
yarn add fetch-helpers
```

or if that's not your thing:

```
npm install fetch-helpers --save
```

### In the Browser

[See here for a browser polyfill](https://github.com/github/fetch) if you are using the fetch API in a browser that doesn't support it yet. This module ships ES2015 code. This means that you will need to compile it before you can use it in the browser since no browser supports all of ES2015 yet. If you are using webpack/babel, in your `webpack.config`:

```js
{
	module: {
		rules: [{
			test: /\.jsx?$/,
			use: {
				loader: "babel-loader"
			},
			include: [
				path.resolve("./src"), // assuming your source code lives in src
				path.resolve("./node_modules/fetch-helpers") // compile this library, too
			]
		}]
	}
}
```

It is recommended to use [babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env) to only compile what you need to target the specific environment you want. Your `.babelrc` might look something like this:

```json
{
	"presets": [["env", {
		"targets": {
			"browsers": "last 2 versions"
		},
		"modules": false
	}]]
}
```

### On the Server

If using this library in node, make use of the [`node-fetch` library](https://github.com/bitinn/node-fetch) to polyfill `fetch`:

```js
global.fetch = require("node-fetch");
```

Do that at the beginning of the entry point for your app and then you can use `fetch-helpers` as normal. The `main` target is precompiled for node v8 so as long as you are using that version or greater, you shouldn't have to worry about compilation of this library.

### API Reference

1. [`connect`](#connectfn)
2. [`fetchOnUpdate`](#fetchonupdatefn-keys)
3. [`checkStatus`](#checkstatusresponse)
4. [`parseJSON`](#parsejsonresponse)
5. [`batchFetch`](#batchfetchkeyname-performfetch--maxbatchsize-timeout-)

### `connect(fn)`

This is a [HOC (higher order component)](https://facebook.github.io/react/docs/higher-order-components.html) heavily inspired by [react-refetch](https://github.com/heroku/react-refetch) tweaked to work more efficiently with how we work with data [@ CivicSource](https://github.com/civicsource/). Here is an example:

```js
const UserProfile = ({ user }) => (
	<span title={user.username}>{user.email}</span>;
);

export default UserProfile;
```

This is a simple component that will display user information given a user object. We can use this in places where we already have the user object loaded and not have to worry about any unwanted network requests. However, there are a lot of places where we don't have the user object loaded (we just have a username or user ID) deep in the component tree and we also want to show user information. We can solve this by also including a "containerized" version of this component which wraps the component and takes a username to fetch the `User` and pass it down to the original component.

That might end up looking something like this:

```js
// add some more props to show loading statuses
const UserProfile = ({ user, isFetching, isFetched, error }) => {
	if (error) {
		return <span>Error loading user: {error}</span>;
	}

	if (isFetching && !isFetched) {
		return <span>Loading...</span>;
	}

	if (!isFetched) {
		return null;
	}

	// we may still need to show a loading indicator if the user is loaded
	// but we are loading more data for the user, e.g. "refreshing the user"
	const loadingIndicator = isFetching ? <span>Loading...</span> : null;
	return <span title={user.username}>{user.email} {loadingIndicator}</span>;
};

export default class UserContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFetching: false,
			isFetched: false,
			error: null
		};
	}

	componentDidMount() {
		this.fetchUser();
	}

	fetchUser = async () => {
		this.setState({
			isFetching: true,
			error: null
		});

		try {
			let response = await fetch(`http://example.com/api/${this.props.username}`, {
				method: "GET"
			});

			response = await checkStatus(response);
			response = await parseJSON(response);

			this.setState({
				isFetched: true,
				isFetching: false,
				user: response
			});
		} catch (ex) {
			this.setState({
				isFetching: false,
				error: ex.message
			});
		}
	};

	render() {
		return (
			<UserProfile {...this.props} {...this.state} />
		);
	}
};

```

That is a lot of boilerplate to load the data once the component mounts and doesn't even handle the case where the `username` prop changes after the component is mounted. `fetchOnUpdate` can reduce all of that to this equivalent code:

```js
import { connect } from "fetch-helpers";

const UserProfileFetcher = connect(({ username }) => ({
	user: {
		url: `http://example.com/api/${username}`, // the URL to make a fetch request to
		method: "GET" // any other standard fetch options
	}
}))(UserProfile);

export default UserProfileFetcher;
```

The first argument is a function that takes the current props and should return a keyed object describing how to fetch the requested data. `connect` will generate the `isFetching`, `isFetched`, & `error` statuses and pass that down to the wrapped component under the `user` prop.

By default, it will only run the fetch when the component is initially mounted. Optionally, if your component takes more `props` and you want to fetch on certain prop updates (which is usually the case), you can pass a list of keys to `connect`:

```js
const FetchingComponent = connect(({ username }) => ({
	user: {
		url: `http://example.com/api/${username}`,
		keys: ["username", "someOtherProp"]
	}
}))(UserProfile);

export default UserProfileFetcher;
```

The `keys` are the props `connect` should monitor for changes and if any of those props change (via a shallow compare), it will run the fetch again. You can pass an arbitrary number of props to monitor for changes. Each prop can use object paths of arbitrary length: e.g. `user.username`; in which case the fetch will only run if the `username` field on `user` changes. If no `keys` are specified, the fetch will only be run once when the component is first mounted.

#### Fetching Multiple Resources

You can fetch multiple resources at once by passing more than one key to the `connect` HOC:

```js
import { connect } from "fetch-helpers";

const FetchingComponent = connect(({ fruitType }) => ({
	users: `http://example.com/api/users`,
	fruits: {
		url: `http://example.com/api/fruits/${fruitType}`,
		keys: ["fruitType"]
	}
}))(MyComponent);
```

This will fetch `users` & `fruits` from the server as soon as the component is first mounted. After that, any time the `fruitType` prop changes, it will fetch the `fruits` again.

#### `onData`

You can pass a data manipulation function, `onData`, to alter the data returned from the server before passing it to the component:

```js
const UserProfileFetcher = connect(({ username }) => ({
	user:{
		url: `http://example.com/api/${username}`,
		bearerToken: "poop",
		keys: ["username"]
	}
}))(UserProfile);
```

#### Lazy Functions

You can pass a function to `connect` in order to bind that function as a `prop` to the component to be invoked later. You can use this for lazy loading data and/or responding with user input to `POST` data to the server for example:

```js
connect(({ username }) => ({
	user:{
		url: `http://example.com/api/${username}`,
		bearerToken: "poop",
		keys: ["username"]
	},
	saveUser: (birthday) => ({
		userSaveResult: {
			url: `http://example.com/api/${username}`,
			method: "POST",
			body: JSON.stringify({ birthday })
		}
	})
}))(UserProfile);
```

This will pass a `saveUser` function to the `UserProfile` component which can be invoked in response to a user action. The `userSaveResult` prop will also be passed down with the standard `isFetching`, `isFetched`, & `error` fields.

#### Reset Fetch Status

You can add a timer to reset the fetch status of an item. This is useful for clearing an item-saved indicator for example:

```js
connect(({ username }) => ({
	saveUser: (birthday) => ({
		userSaveResult: {
			url: `http://example.com/api/${username}`,
			method: "POST",
			body: JSON.stringify({ birthday }),
			reset: 2000
		}
	})
}))(UserProfile);
```

After `saveUser` has been invoked with a successful response, the `userSaveResult` prop will be cleared after 2 seconds.

#### `bearerToken`

As a convenience, you can pass a `bearerToken` to add an `Authorization` header to the outgoing request:

```js
const UserProfileFetcher = connect(({ username }) =>  ({
	users: {
		url: `http://example.com/api/users`,
		bearerToken: "mytoken"
	}
}))(UserProfile);
```

#### Arbitrary `fetch` Options

You can pass arbitrary [`fetch` options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) that will be passed to `fetch` unaltered:

```js
const UserProfileFetcher = connect(({ username }) =>  ({
	users: {
		url: `http://example.com/api/users`,
		headers: { Accept: "text/plain" }
	}
}))(UserProfile);
```

### `fetchOnUpdate(fn, [...keys])`

This HOC performs a very similar to function as that of `connect` but instead of calculating statuses itself, it will run a specified function any time any of the given props change (via a shallow compare). This is useful, for example, if you just want to trigger a redux action and retrieve loading statuses & such from the store when props change:

```js
const UserProfileFetcher = fetchOnUpdate(({ username, fetchUser }) => {
	//this function will run on mount & whenever "username" changes
	fetchUser(username);
}, "username")(UserProfile);

// connect is from redux
const UserProfileContainer = connect((state, props) =>({
	user: state.users[props.username]
}), dispatch => ({
	fetchUser: username => dispatch(fetchUser(username))
}))(UserProfileFetcher);

export default UserProfileContainer;
```

The second argument to `fetchOnUpdate` is the prop to monitor for changes and if that prop changes, it will run the fetch again. You can pass an arbitrary number of props to monitor for changes. Each prop can use object paths of arbitrary length: e.g. `user.username`; in which case the fetch will only run if the username field on user changes.

### `checkStatus(response)`

[Read here](https://github.com/github/fetch#handling-http-error-statuses) for the inspiration for this function. It will reject fetch requests on any non-2xx response. It differs from the example in that it will try to parse a JSON body from the non-200 response and will set any `message` field (if it exists) from the JSON body as the error message.

```js
import { checkStatus } from "fetch-helpers";

//given a 400 Bad Request response with a JSON body of:
//{ "message": "Invalid arguments. Try again.", "someOtherThing": 42 }

fetch("/data", {
	method: "GET",
	headers: {
		Accept: "application/json"
	}
})
.then(checkStatus)
.catch(err => {
	console.log(err.message); //Invalid Arguments. Try again.
	console.log(err.response.statusText); //Bad Request
	console.log(err.response.jsonBody); //{ "message": "Invalid arguments. Try again.", "someOtherThing": 42 }
});
```

It will try to look for a `message` field first, and then an `exceptionMessage` falling back to the `statusText` if neither one exist or if the response body is not JSON.

### `parseJSON(response)`

A simple response handler that will simply parse the response body as JSON.

```js
import { parseJSON } from "fetch-helpers";

//given a 400 Bad Request response with a JSON body of:
//{ "message": "Invalid arguments. Try again.", "someOtherThing": 42 }

fetch("/data", {
	method: "GET",
	headers: {
		Accept: "application/json"
	}
})
.then(parseJSON)
.then(json => console.log(json));
```

### `batchFetch(keyName, performFetch, { maxBatchSize, timeout })`

A utility to allow easily batching `fetch` requests. Calling code calls the function as if it will make a single request while, internally, it will wait a predetermined amount of time before actually making the request.

```js
import { batchFetch } from "fetch-helpers";

const getItem = batchFetch("itemId", chunk => fetch(`http://example.com/api/items/${chunk.join(",")}/`, {
	method: "GET"
}));

for (let i = 1; i <= 10; i++) {
	getItem(i).then(item => console.log(`item with id ${item.itemId} retrieved from the server`));
}
```

The above example will make one request to the URL `http://example.com/api/items/1,2,3,4,5,6,7,8,9,10/` but resolve all promises separately so that calling code is none-the-wiser that its requests have been batched into one. The `keyName` (in this case `itemId`) must be returned from the server in the results as that is how `batchFetch` matches what promises to resolve/reject.

The default batch size is 10 and the default timeout is 100ms. Both can be overridden:

```js
const getItem = batchFetch("itemId", chunk => fetch(`http://example.com/api/items/${chunk.join(",")}/`, {
	method: "GET"
}), {
	maxBatchSize: 30,
	timeout = 300
});
```

Any extra parameters passed to the resulting function will be passed to the `performFetch` function:

```js
const getItem = batchFetch("itemId", (chunk, method) => fetch(`http://example.com/api/items/${chunk.join(",")}/`, {
	method: method
}));

getItem(42, "GET");
getItem(13, "GET");
getItem(69, "GET");
getItem(420, "GET"); // the last one wins (as far as the extra params passed to performFetch)
```

## Build Locally

After cloning this repo, run:

```
npm install
npm run compile
```

This will build the `src` into `lib` using babel.

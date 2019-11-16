# SDC Engineering Journal and Notes - Zack K. Miller

> System Design Capstone project for Hack Reactor RPT15.
> This is the “Reviews” microservice for a clone of a single product page on [Steam](https://store.steampowered.com/games/)

## Related Projects


  - [Proxy Server](https://github.com/rpt15-dr-floyd/zack-proxy)
  - [Josh_Overview](https://github.com/rpt15-dr-floyd/Josh_Overview)
  - [Justin_Features](https://github.com/rpt15-dr-floyd/Justin_Features)

## Table of Contents
<!-- TOC -->

- [1. DATABASE 1 - PostgreSQL]
  - [1.1 PostgreSQL installation]
  - [1.2 Run PostgreSQL]
  - [1.3 PostgreSQL Schema]
  - [1.4 Populating PostgreSQL DB]
- [2. DATABASE 2 - Cassandra]
  - [2.1 Cassandra installation]
  - [2.2 Run Cassandra]
  - [2.3 Cassandra Schema]
  - [2.4 Populating Cassandra DB]
- [3. DBMS Benchmarking & Performance]
  - [3.1. Querying PostgreSQL]
  - [3.2. Querying Cassandra]
- [4. DEPLOYMENT]
  - [4.1. Deploying PostgreSQL]
  - [4.2. Deploying Microservice & Proxy Server]
  - [4.3. Detach Screen]
- [5. OPTIMIZATION 1: Redis (cache)]
  - [5.1. Configuring Redis]
  - [5.2. Load Testing - Redis]
- [6. OPTIMIZATION 2: Server-Side Rendering (SSR)]
  - [6.1. Options & Challenges]
  - [6.2. Load Testing SSR HTML]

### 1. DATABASE 1 - PostgreSQL
###### 1.1 PostgreSQL installation
[Postgres.app](https://postgresapp.com/)

To more easily access Postgres commands from the terminal, we must add this line to `~/.bash_profile` or `~/.zshrc` (in in the case of having `Z Shell` installed) to tell the terminal where the bin folder of the Postgres.app lives.
```sh
# terminal
$~ open .zshrc

# add the following line to .zshrc if your app lives in the Applications folder
export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/11/bin

# terminal
$~ source .zshrc
```

###### 1.2 Run PostgreSQL
```sh
$~ **psql**
```

###### 1.3 PostgreSQL Schema
I created a schema file ending with `.sql`, which allows VSCode to recognize the syntax as SQL. In the schema: 
```sql
CREATE databaseName;

\c databaseName;
# which switches into that DB

CREATE TABLE tableName (
id SERIAL PRIMARY KEY,
game VARCHAR(50),
gameId INT,
# etc,
# etc
);
```
I used:
`id SERIAL` because it is the functional equivalent to the MySQL command: 
`id INT NOT NULL AUTO_INCREMENT`

Then load into PostgreSQL with this command:
```sh
$~ **psql** -f schemaFile.sql
```

###### 1.4 Populating PostgreSQL DB
```sh
$~ npm i -s pg 
# (i === install, -s === -save)
```
![npm-pg](https://i.imgur.com/k1RlmKB.png)

With the `const pgClient` setup, we can now query to the database via:
```js
pgClient.connect()
  .then(() => {
    return **pgClient.query()**
  })
  .catch(err => console.log(err))
  .finally(() => pgClient.end())
```

_**Challenge: How do I get 10 Million records into PostgreSQL efficiently?**_
At first, I tried just running the `.query()` on a loop, but that didn’t work because I needed to `return` it which stops the script. To run the `.query()` only once with many records presented new challenges.

There is a special statement that solves this puzzle.
`unnest(ARRAY[])` will iterate through the enclosed array and create that many (array.length) new records in Postgres.

Example of how to insert 3 new records with 2 columns each:
```sql
‘INSERT INTO tableName (col1, col2) VALUES (unnest(ARRAY[“val1a”, “val1b”, “val1c”]), unnest(ARRAY[“val2a”, “val2b”, “val2c”]))’
# the first ARRAY maps to col1 and the second to col2
```
Each nested array needed to contain 10M values. To make this more complex, I had 14 columns for each row, which meant I was *unnesting* 14 arrays in a single query. 
I was using the second argument of `.query()` to define the queryArgs. `queryArgs` needed to be an array that contained 14 x 10 Million arguments i.e. Array.length === 140 MILLION!!!
After writing a function that could generate these arrays and properly place them in the `query()`, let the system errors guide me.

The first errors were about the `DATA TYPE` not being correct. This was *not* erroring out when I tested it with a single record, but began only when I implemented the `unnest(ARRAY[])` feature.  After several tests, I realized that if the data type needed was `INT`, I could put it directly in the `queryString`, but not in the `queryArgs` (which is where I wanted it). And the opposite was true of data type `VARCHAR`, it only worked in the `queryArgs`. The solution, I found again through googling:
```js
unnest(ARRAY[]::int[])
# adding ::int[] to the end of each unnest function tells Postgres that these are INTEGERS
```

Once the data type errors were resolved, the most records I was allowed (by this method) to do at once was 4000 before it would error again. Nevertheless, I was happy that I could get 4000 in one shot, consistently. 

_**ASYNC Recursion**_
I didn’t want to string together 2500 `.then()` statements. I tried two methods of recursion (calling the original function with .then(), and creating an inner function), but got these errors with each attempt:
![recurse-postgres1](https://i.imgur.com/5IKjrCd.png)
![recurse-postgres2](https://i.imgur.com/yX5OraA.png)
![recurse-postgres3](https://i.imgur.com/Q18O9FL.png)

There had to be a way to recursively call a function has already ended its promise cycle ( .finally() had completed ) before being called again…

For this, I decided to use a separate `.js` file that would trigger the original file containing the `.query()` from the terminal, **asynchronously** with a `callback` after each execution, until we reached 10M.

```sh
$~ npm i -s shelljs
```

Then, in Javascript
```js
shelljs.exec(‘node queryFile.js’, () => {
  // *recursively call this function 2500x*
})
```
2500 calls of 4000 === 10 Million
This seed script completed 10M records in about 44 minutes.

### 2. DATABASE 2 - Cassandra
###### 2.1 Cassandra installation
Java version 13 didn’t play nice with Cassandra 3.11.4, so I installed the known-compatible Java version 8.0_221.

Then, we must add this line to `~/.bash_profile` or `~/.zshrc` (in in the case of having `Z Shell` installed) to change default java to 8.
```sh
# terminal
$~ open .zshrc

# add the following 2 lines to .zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_221.jdk/Contents/Home
export PATH=$PATH:/usr/local/cassandra/bin

# terminal
$~ source .zshrc
```

###### 2.2 Run Cassandra 
```sh
# terminal
$~ cassandra
```
If Cassandra and Java are installed and compatible together a long message will ensue, ending with several lines of “INFO …”
```sh
# new terminal window - the following command gets us into the Cassandra shell
$~ **cqlsh**
```

###### 2.3 Cassandra Schema
Because Cassandra’s syntax is so similar to SQL, I created a schema file ending with `.sql`, (just like before) which allows VSCode to recognize most of the necessary syntax as SQL. This schema went through a few iterations before landing here (see [3.2. Querying Cassandra] below). Within this file, we can set the initial parameters for setup including the KEYSPACE (Cassandra’s equivalent to an SQL database), TABLE definitions with COLUMN names DATA TYPES and PRIMARY KEY(s). 

```sql
CREATE KEYSPACE databaseName WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE databaseName;

CREATE TABLE tableName (
id int,
game text,
gameId int,
posted timestamp,
# etc,
# etc,
PRIMARY KEY (gameId, posted)
# __gameId__ is now the ‘partition key’ and __posted__ is now the ‘clustering column’
);
```

Then load into Cassandra with this command:
```sh
$~ **cqlsh** -f schemaFile.sql
```

###### 2.4 Populating Cassandra DB
```sh
$~ npm i -s cassandra-driver
```
![cassandra-driver](https://i.imgur.com/1KnvqpJ.png)
With the `var client` setup, we can now access client.execute(); to make a query to the database. This returns a promise accessible through `.then()`. 

_**Challenge: How do I get 10 Million records into Cassandra efficiently?**_
At first, I tried writing a query and having the `.then()` statement run a recursive callback 10M times. It was working, but slowly - according to my math, it would have taken many hours to complete this way. `$~ ^c` Cancel.

Then I found the syntax to group many queries into one: `BEGIN UNLOGGED BATCH`, followed by a query statement that I repeated 50x, followed by `APPLY BATCH;` I was able to group 50 queries as one (I tried 100 but got an error). Running this 50-query group, 200K times produced a DB of 10M in about 22 minutes.



### 3. DBMS Benchmarking & Performance
###### 3.1. Querying PostgreSQL

Goal: optimizing the DB until a query to the most recent 10% of the database finishes in under 50ms:
Turn on “timing” within psql —> `\timing`
This allows us to view the query times in milliseconds after execution completes. 

After testing some basic queries within `psql` the results are taking anywhere from 10-30 seconds (sifting thru 10M records), so I must optimize.

*Indexing to the rescue*
An index is a key:value store, that will cut query times down significantly. This is possible because instead of querying the entire DB (like in the first example) we get to each id by nature of key:value sequential sorting in a binary tree structure, which is very fast!

Not only can we index individual columns, but even by groups of relevant columns. e.g. I want to search for a specific gameId, within a certain range of id values, ordered by posted (date) descending. So my 3 values to consider for indexing are gameId, id, & posted, but because id is the `PRIMARY KEY` it is already indexed:

```sql
CREATE INDEX ON reviewsTable (gameId);
CREATE INDEX ON reviewsTable (posted);
CREATE INDEX ON reviewsTable (gameId, posted);
```

###### Results
The following are the two queries that I will be testing, because they are the queries in my API that will need to return the most records:
```sql
# Querying the Top 10% of DB only
SELECT * FROM reviewsTable WHERE gameId = 1 AND id > 9000000 ORDER BY posted DESC LIMIT 45;
# id > 9000000 === most recent 10% of database
```

```sql
# Querying the Whole DB
SELECT * FROM reviewsTable WHERE gameId = 1 ORDER BY posted DESC LIMIT 45;
```

####### Results: Pre-Indexing
- Top 10% of DB: completed in about 285 ms
- Whole DB: completed in about 15 seconds!

####### Results: Indexing __gameId__
- Top 10% of DB: completed in about 0.8 ms**
- Whole DB: completed in about 0.8 ms**

####### Results: Indexing __gameId__ & __posted__
- Top 10% of DB: completed in about 0.7 ms
- Whole DB: completed in about 0.7 ms

```sql
# wanted to test what the query time would be without having the gameId individually indexed…
DROP INDEX reviewstable_gameid_idx;
```
####### Results: Indexing __gameId__ & __posted__ (after dropping __gameId__)
- Top 10% of DB: completed in about 0.68 ms
- Whole DB: completed in about 0.68 ms

###### 3.2. Querying Cassandra
Goal: optimizing the DB until a query to the most recent 10% of the database finishes in under 50ms:
Turn on “tracing” within cqlsh —> `$ TRACING ON`
This allows us to view the query times in *micro*seconds after execution completes. The total execution time is viewed in the bottom row under the `source_elapsed` column of the `Tracing session`.

Cassandra has many more restrictions than Postgres in terms of the allowable queries. The tables have to be configured to accept the specific queries needed for the API.
Without specifying PARTITION KEYs and CLUSTERING COLUMNs in Cassandra, it is not possible to query a DB of 10Million with efficacy.
So, I rewrote the schema to be different from that of PostgreSQL. See [2.3 Cassandra Schema] above.

PARTITION KEY: allows us to efficiently filter by an =.
  e.g. `WHERE gameId = 1`

CLUSTERING COLUMN: allows us to efficiently sort via `ORDER BY` (ascending or descending).
  e.g. `ORDER BY posted DESC`

In order to allow filtering by most recent id we must end each query with  —> `$ ALLOW FILTERING`

The following are the two queries that I will be testing, because they are the queries in my API that will need to return the most records:
```sql
# Querying the Top 10% of DB only
SELECT * FROM reviewsTable WHERE gameId = 1 AND id > 9000000 ORDER BY posted DESC LIMIT 45 ALLOW FILTERING;
# id > 9000000 === most recent 10% of database
```

```sql
# Querying the Whole DB
SELECT * FROM reviewsTable WHERE gameId = 1 ORDER BY posted DESC LIMIT 45;
```

####### Results
- Top 10% of DB: completed in about 1.7 ms
- Whole DB - first query: completed in about 18.2 ms
- Whole DB - subsequent queries: completed in about 1.3 ms

####### Results: Indexing __Id__
- Top 10% of DB: completed in about 1.4 ms
- Whole DB: completed in about 1.4 ms


### 4. DEPLOYMENT
###### 4.1 Deploying PostgreSQL
When deploying, we have to ensure that each EC2 instance has the correct Security Group settings for `Inbound Rules` that will allow for incoming connections from the correct IP’s and Port numbers.
Finding each step necessary to install dependencies, configure, and deploy to EC2 was an interesting challenge. Here are the steps I took to get everything working:

From a terminal window, `cd` into the directory with the AWS `.pem` file, then…
```sh
$~ ssh -i <.pem filename> <ec2user@ url to amazon ec2 instance>
$~ yes
$~ sudo yum update -y
$~ sudo su
# change to ROOT user
$~ yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel
# to install git
$~ exit 
# exit ROOT user
$~ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$~ . ~/.nvm/nvm.sh
$~ nvm install node
$~ git clone <urlToGitHubRepo>
$~ cd <repoName>
$~ npm i
# install all dependencies
$~ sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs -y
# install postrgeSQL
$~ sudo postgresql-setup initdb
# initialize DB - an important step 
$~ sudo service postgresql start
# start postgres
$~ sudo locate pg_hba.conf
# to find config file
$~ sudo vi /var/lib/pgsql/data/pg_hba.conf
```
At bottom of the file change ident’s => md5 to allow for password authentication. It should look like this:
![pg_hba](https://imgur.com/a/kicK8Bt)

```sh
$~ sudo locate postgresql.conf
# to find other config file
$~ sudo vim /var/lib/pgsql/data/postgresql.conf
```
Under “Connection Settings” change the listen address and the port, which may also need to be uncommented, like this:
![postgresql](https://imgur.com/a/9jFlNLC)

```sh
sudo service postgresql restart
# restart postgres so changes take effect 
$~ sudo -u postgres psql
# enter the psql shell
```

```sql
\password
# enter password twice
CREATE USER power_user SUPERUSER;
ALTER USER power_user WITH PASSWORD ‘password’;
CREATE DATABASE dynamo WITH OWNER power_user;
\c dbname
CREATE TABLE <enter schema here>
\q
# quit/exit the psql shell
```

Now we can begin to populate our database using the seed scripts. Whew!

###### 4.2 Deploying Microservice & Proxy Server
Deploying the service and proxy were relatively simple on EC2 compared to the prior process. Here are the steps I took to get everything working:

From a terminal window, `cd` into the directory with the AWS `.pem` file, then…
```sh
$~ ssh -i <.pem filename> <ec2user@ url to amazon ec2 instance>
$~ yes
$~ sudo yum update -y
$~ sudo su
# change to ROOT user
$~ yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel
# to install git
$~ exit 
# exit ROOT user
$~ git clone <urlToGitHubRepo>
$~ cd <repoName>
$~ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$~ . ~/.nvm/nvm.sh
$~ nvm install node
$~ npm i
# install all dependencies
```
Then, start the server with the npm start script. Done!

###### 4.3 Detach Screen
I was running into an issue where my EC2 server instance would disconnect as soon as I closed my terminal window. 
Linux `Screen` is a command that allows us to keep processes running despite a dropped connection. Type
```sh
$~ screen
```
Then, connect to the server through this “screen.”  To leave the connection running and continue to work in the shell, we must detach from the screen by typing:
`control + A + D`

Now, we can view the screens with the command:
```sh
$~ screen -ls
```

To reconnect to a `screen`, type the following with the name of the screen:
```sh
$~ screen -r <screenName>
```

There we can see the processes that are still running in the background. We can have multiple screens running on one instance, which is how I set up a Redis-Server and Node.js server on the same instance.
[More info about the Linux Screen](https://www.howtoforge.com/linux_screen)

### 5. OPTIMIZATION 1: Redis (cache)
###### 5.1 Configuring Redis

After getting Redis installed, we can configure it for optimal performance in our environment. To find the config file:
```sh
$~ sudo find / -name "redis.conf"
```
Then, open the file with VIM:
```sh
$~ sudo vi /usr/local/src/redis-stable/redis.conf
``` 

Here are some of the configurations options that I modified. There is still much more to learn about how to maximize Redis’s performance:
- tcp-backlog
- databases
- maxclients
- maxmemory
- maxmemory-policy
- maxmemory-samples
- appendfsync

To run Redis with the default config:
```sh
$~ redis-server
```
To run Redis with the updated config file options:
```sh
$~ redis-server /usr/local/src/redis-stable/redis.conf
```

Testing with and without the config modifications, I was able to see slight improvements with the config file modified.  So, I used the config file when I ran the Redis load tests below.

###### 5.2 Load Testing - Redis
Load tests were run with [Loader.io] (https://loader.io/)

GET Requests made to a range of 3,000 GameId pages selected at random (querying the Postgres DB of 10M+)

####### Before Optimization:
**In 5 consecutive 30 sec runs.**
Run 1. GET 300 RPS - avg. 7977ms fail
Run 2. GET 300 RPS - avg. 5769ms
Run 3. GET 300 RPS - avg. 3987ms
Run 4. GET 300 RPS - avg. 3247ms **best** *- the improvement in performance up to this point indicates that Postgres is doing a bit of caching on its own.*
Run 5. GET 300 RPS - no improvement

{ 300 RPS was the highest my DB could handle responding to w/o optimizations }

####### After Optimization:
**- Redis installed and configured on the Server EC2. Queried a fresh 3,000 Game Id's in 3 consecutive 30 sec runs.**
Run 1. GET 300 RPS - avg. 7729ms fail
Run 2. GET 300 RPS - avg. 1762ms
Run 3. GET 300 RPS - avg. 64ms **best** *- fully cached*

####### Additional Redis Stress Test:
500 RPS was about the highest I was able to handle with Redis installed (as opposed to barely 300 without).
I tested this Redis config over 5,000 randomly selected Game Id's in 4 consecutive runs.
Run 1. GET 500 RPS - avg. 7393ms fail
Run 2. GET 500 RPS - avg. 4076ms
Run 3. GET 500 RPS - avg. 558ms
Run 4. GET 500 RPS - avg. 64ms **best** *- fully cached*

Redis only helped performance - no downside was observed in this configuration. However, a better way to use Redis would be to install it on the database’s EC2, or even better its own dedicated EC2 instance. This would allow Redis full access to the processing power of one instance without competing for CPU with the server or DB.


### 6. OPTIMIZATION 2: Server-Side Rendering (SSR)
###### 6.1 Options & Challenges
In a React app, the first requirement to SSR is getting the app on the server so that it’s content can be read and attached to the HTML page, stringified, and then sent to the client.
However, React is written in ES6 syntax with the keyword `import` which Node.js (written in ES5 with the keyword `require`) doesn’t understand out of the box. To allow Node to read ES6, the server code must be re-written with ES6 `import` statements and compiled with `Babel` before the server is started. < Babel converts the ES6 to ES5 >

There are two ways that I discovered to accomplish this.
1) Create a separate Webpack config for the server and compile it. Then, start the server with the Webpack compiled version the server file. This works well but created several extra steps and made the code base messier. In my case, I was looking for the simplest effective solution.
2) Create an entry file that compiles the server on the fly. Start the server with the entry file, which then triggers the compiled server. This was the simple option and worked well. The entry file, `start.js` looked like this:
``` js
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react']
});

module.exports = require(‘./serverES6.js');
```

``` sh
$~ npm i -s @babel/register react-dom/server
```

Now in the server file, when someone requests the page, we need to read the existing HTML page, and paste in the App, and send it to the client:
``` js
fs.readFile('server/index.html', 'utf8', (err, page) => {
  if (err) { 
    res.send(err);
  } else {
    res.send(page.replace(
      '<!--App-->', renderToString(<App />)
    ));
  }
})
```

On the client, to `hydrate` the page after it’s been sent and loaded we no longer use the `.render()` method of ReactDOM, we use `.hydrate()`:
``` js
ReactDOM.hydrate(<App />, document.getElementById('reviews'));
```

The lifecycle method `componentDidMount` will still fire off after the page loads. So, there are a few options for getting the data from the DB to the page.
1) Query the data on the server, before the SSR and send it already attached the page. I experimented a lot with this method, and found its challenges. Because I was now passing props down to the App from within the server, if there were mismatches between props received there and those that were hydrated. In this case, we receive the error: `Warning: Text content did not match.` There were two workarounds that I discovered in the allowed time, neither of which were ideal. As time ran out, I was looking into door number 3.
   a) Get the data twice (once on the server, and again when the page loads). This is obviously not a great idea for a large application, but it did produce the desired result.
   b) Skip the hydration phase. Now this would only work if the page is completely static and can be 100% rendered on the server. It’s pretty unlikely that this will be useful in most cases.
   c) What I wanted to do was - Conditionally send specific props through, so there’s no mismatch and no need for a 2nd API call on the client side.
2) Query the data after `componentDidMount`. This means that the App structure is stringified and the page load will be very quick, but the data will take an extra 50-100ms or so to populate after page load. This was the best option in my case for the time I had, because I needed that data to come through to set certain state variables which dynamically updated the display on the page. As I tested pre-rendering all the data, the state was not dynamically updated.

One more note:
I was originally setting the state of the gameId with `window.location.pathname.split(‘/‘)[1]`, but due to the order of operations, I had to wait for the component to mount before we had access to the window object, because I can’t stringify a window value on the server that doesn’t exist yet. So, I moved that to `this.setState()` within `componentDidMount()`.


###### 6.2 Load Testing SSR HTML
Load tests were run with [Loader.io] (https://loader.io/)

GET Requests were made at random to 100,000 of the GameId pages
{ 1500 RPS was the highest my Server could handle responding to both before and after optimization }

####### Before Optimization:
- GET 10 RPS - avg. 227ms
- GET 100 RPS - avg. 224ms
- GET 1000 RPS - avg. 230ms
- GET 1500 RPS - avg. 1508ms (performance greatly wained from here up)

####### After Server-Side Rendering the HTML:
- GET 10 RPS - avg. 126ms (101 ms Better!)
- GET 100 RPS - avg. 124ms (100 ms Better!)
- GET 1000 RPS - avg. 1901ms (worse)
- GET 1500 RPS - avg. 2943ms (worse)

(extra tests on the SSR)
- GET 750 RPS - avg. 137ms (still very good!)
- GET 800 RPS - avg. 216ms 

On the SSR’d page, *GET 800 RPS* was the point at which the performance matched the non-SSR’d page and above which started to perform worse.
Given additional resources of time and money it appears that horizontal scaling and load balancing would be the solution. I believe that the reason that it started to perform worse was due to my single server trying to read and stringify the HTML page more than 800x per second. When it slowed, I started to see this error pop up repeatedly in the console: `Error: EMFILE: too many open files, open ‘index.html’`

I am very happy with the initial performance boost of SSR, plus the opportunity to learn how it is done.

:grinning: :thumbsup:
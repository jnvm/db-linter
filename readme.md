# db-linter

Do you wish:
* your codebase came with some [helpful github-flavored markdown](https://github.com/jnvm/db-linter#example) that provided a 
canonical, easily-linkable place for textual descriptions of database tables and columns to be stored?
* and required team members to update them as new ones were added?
* and made sure the schema followed certain conventions?
* or that your code had a dynamic definition of your database schema?

Then this is for you.

<table>
<tr><th>Table of Contents</th></tr>
<tr><td><ul>
    <li><a href='#setup'>Setup</a></li>
    <li><a href='#rules'>Rules</a></li>
    <li><a href='#how'>How</a></li>
    <li><a href='#why'>Why</a></li>
    <li><a href='#caveats'>Caveats</a></li>
    <li><a href='#example'>Example</li>
</ul></td></tr>
</table>

## Setup
Run this during your test suite (or just `extractDbSchema` in your code if you want the object for your use):
```javascript
const {extractDbSchema,run} = require('db-linter')
extractDbSchema({
	//sql flavor
	lang: 'postgres',//or 'mysql' (if using mariadb, say 'mysql')
	//db creds
	host: '127.0.0.1',
	//port: 5432,//optional; if empty, assumes 3306 if mysql, 5432 if postgres
	user: 'postgres',//note this user will need access to information_schema
	password: '',
	database:'test',
})
.then(db=>{
	//or write your own convention checks once you have db
	return run(db,{
		path:'./readme.md',//which markdown to place/update the table
		rules:'all',//or array of rule name strings from readme
		//rule options
		boolPrefixes:['is','allow'],
		isObviousColumn:(columnName,tableName,db)=>{
			//custom reasons a column does not need describing in your setup
			//maybe columns that are everywhere, like created_at?
			return false
		}
	})
})
.then( passedConventionCheck => //if this is false, all conventions were not followed
	process.exit(passedConventionCheck ? 0 : 1)//or however you want to handle success / failure
)
```

Failed rules will be logged out for the dev to fix.

## Rules
Below is the full list of built-in rules, but feel free to create your own and assess the json schema directly:

* **`require_table_description_in_readme`** - all tables need explanations for why they exist. Sometimes even describing table `x_y` as `1 x can have many y's` will be appreciated going forward.
* **`require_column_description_in_readme`** - all non-obvious columns need explanations for why they exist. ("Non-obvious" is customizable with the `isObviousColumn()` in setup)
* **`require_lower_snake_case_table_name`** - some instances, collations, & OSes are case insensitive, making this the only reliable naming style for tables and columns
* **`require_lower_snake_case_column_name`** - see above.
* **`disallow_bare_id`** - columns named `id` have repeatedly been found to create footgun-level ambiguity downstream, and make sql more verbose & confusing by eliminating utility of the `using` keyword
* **`require_primary_key`** - each row should always be individually fetchable from each table, otherwise the data structure & author needs may be at odds
* **`require_unique_primary_keys`** - identical primary keys would suggest they should be the same table
* **`require_singular_table_name`** - the table name should describe _each row_, not the table as a whole. A _table_ holds multiple records, otherwise it would be called a _pedestal_; clarity is _never_ added when a table is pluralized, it only makes remembering which part to pluralize harder when join tables inevitably have singular qualifiers.  Also, consider using names for tables that are not SQL keywords or quoting them over pluralizing.
* **`require_all_foreign_keys`** - every column titled `x_id` (when `x` is another table) should have a foreign key to table `x`.  In composite primary key scenarios, this may require denormalizing properties to retain the link.
* **`require_same_name_columns_share_type`** - reduces confusion when talking & promotes more unique names
* **`require_bool_prefix_on_only_bools`** - `is_`, `allow_` should always refer to boolean columns. (Prefix list customizable with the `boolPrefixes` in setup)

## How
This is done in a few steps:
1. it queries `information_schema` to provide a json schema representation of your **mysql** or **postgres** db (which you can also use in your code)
2. it constructs and updates a git-flavored markdown readme of your db from this json that preserves user-supplied descriptions across rebuilds, with each table and column deep-linkable
3. it checks whether the current state of the db follows the desired rules

## Why
* **Documentation** - Being able to see an overview is desirable.
Being able to point at something in conversation is helpful.
Things not committed become folklore.
* **Total Freedom Is Not Always Desirable** - Dev teams, especially those which suffer from high turnover, 
allow too much freedom in databases, which leads to local contradictions,
which leads to ever-increasing mental overhead.
Adding some reasonable rules can minimize the mental overhead necessary, and increase reliability.

  Given the levels of restrictions and rigor placed on executed code,
there are curiously few placed on everything else.  Such freedom in a space can send
the signal that equivalent rigor is not worthwhile here, when of course it still is.

## Caveats
* stored procedures, views, and enums are currently not considered, because they are not recommended.


## Example
Automatically rebuilt with updates, retaining descriptions devs provide.
Note all links are deep-linkable for referencing in conversation.

(Given github is where you would be viewing this file, the links work as expected there, not necessarily on npm.)

A 4 col-max TOC is on top, for dbs with many tables.

<!--DB-LINTER-->
<table>
	<!--<thead><tr><th colspan=4 >Tables</th></tr></thead>-->
	<tbody>
		<tr valign=top >
			<td>
				<a href='#history'><code>history</code></a><br>
				<a href='#dimension'><code>dimension</code></a>
			</td>
			<td>
				<a href='#rick'><code>rick</code></a><br>
				<a href='#organism_dimension'><code>organism_dimension</code></a>
			</td>
			<td>
				<a href='#portal_gun'><code>portal_gun</code></a><br>
				<a href='#organism'><code>organism</code></a>
			</td>
		</tr>
	</tbody>
</table>
<table>
	<thead>
		<tr>
			<th>Table</th>
			<th>Relations
			<br>
			&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
			</th>
		</tr>
	</thead>
	<tbody>
			<tr>
			<td id='dimension'>
				<dd alt=table-description>
					<a href='#dimension'><code><b>dimension</b></code></a>
					- a parallel plane of existence accessible with a portal gun.
				</dd>
				<ul alt=table-columns>
					<li id='dimension.dimension_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#dimension.dimension_id'>dimension_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with dimension.dimension_id description -->
						</dd>
					</li>
					<li id='dimension.name' >
						<dd alt=column-description>
							<code>
								<b><a href='#dimension.name'>name</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							- the name the discovering Rick gave this dimension
						</dd>
					</li>
					<li id='dimension.description' >
						<dd alt=column-description>
							<code>
								<b><a href='#dimension.description'>description</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							- distinguishing properties of this dimension
						</dd>
					</li>
				</ul>
			</td>
			<td>
			#<a href='#dimension'><code>dimension</code></a><br/>
			&emsp;⭦<a href='#history'><code>history</code></a><br/>
			&emsp;⭦<a href='#organism_dimension'><code>organism_dimension</code></a><br/>
			&emsp;⭦<a href='#rick'><code>rick</code></a>
			</td>
		</tr>
		<tr>
			<td id='history'>
				<dd alt=table-description>
					<a href='#history'><code><b>history</b></code></a>
					- an archived instance of travel via a specific portal gun, by a Rick, to a dimension, at a specific point in time
				</dd>
				<ul alt=table-columns>
					<li id='history.history_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#history.history_id'>history_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with history.history_id description -->
						</dd>
					</li>
					<li id='history.portal_gun_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#history.portal_gun_id'>portal_gun_id</a></b>
								<i alt=column-type>uuid <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with history.portal_gun_id description -->
						</dd>
					</li>
					<li id='history.dimension_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#history.dimension_id'>dimension_id</a></b>
								<i alt=column-type>uuid <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with history.dimension_id description -->
						</dd>
					</li>
					<li id='history.rick_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#history.rick_id'>rick_id</a></b>
								<i alt=column-type>integer <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with history.rick_id description -->
						</dd>
					</li>
					<li id='history.created_at' >
						<dd alt=column-description>
							<code>
								<b><a href='#history.created_at'>created_at</a></b>
								<i alt=column-type>timestamp without time zone <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with history.created_at description -->
						</dd>
					</li>
				</ul>
			</td>
			<td>
			&emsp;↗<a href='#dimension'><code>dimension</code></a><br/>
			&emsp;↗<a href='#portal_gun'><code>portal_gun</code></a><br/>
			&emsp;↗<a href='#rick'><code>rick</code></a><br/>
			#<a href='#history'><code>history</code></a>
			</td>
		</tr>
		<tr>
			<td id='organism'>
				<dd alt=table-description>
					<a href='#organism'><code><b>organism</b></code></a>
					- a living creature Rick has encountered
				</dd>
				<ul alt=table-columns>
					<li id='organism.organism_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism.organism_id'>organism_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with organism.organism_id description -->
						</dd>
					</li>
					<li id='organism.name' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism.name'>name</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							- its apt &amp; fitting name that was not made up on the spot
						</dd>
					</li>
					<li id='organism.image' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism.image'>image</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							- visual confirmation of organism
						</dd>
					</li>
				</ul>
			</td>
			<td>
			#<a href='#organism'><code>organism</code></a><br/>
			&emsp;⭦<a href='#organism_dimension'><code>organism_dimension</code></a><br/>
			&emsp;⭦<a href='#organism_dimension'><code>organism_dimension</code></a>
			</td>
		</tr>
		<tr>
			<td id='organism_dimension'>
				<dd alt=table-description>
					<a href='#organism_dimension'><code><b>organism_dimension</b></code></a>
					- 1 organism can be found in many dimensions
				</dd>
				<ul alt=table-columns>
					<li id='organism_dimension.organism_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism_dimension.organism_id'>organism_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with organism_dimension.organism_id description -->
						</dd>
					</li>
					<li id='organism_dimension.dimension_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism_dimension.dimension_id'>dimension_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with organism_dimension.dimension_id description -->
						</dd>
					</li>
					<li id='organism_dimension.discovered_at' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism_dimension.discovered_at'>discovered_at</a></b>
								<i alt=column-type>timestamp without time zone <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with organism_dimension.discovered_at description -->
						</dd>
					</li>
				</ul>
			</td>
			<td>
			&emsp;↗<a href='#dimension'><code>dimension</code></a><br/>
			&emsp;↗<a href='#organism'><code>organism</code></a><br/>
			&emsp;↗<a href='#organism'><code>organism</code></a><br/>
			#<a href='#organism_dimension'><code>organism_dimension</code></a>
			</td>
		</tr>
		<tr>
			<td id='portal_gun'>
				<dd alt=table-description>
					<a href='#portal_gun'><code><b>portal_gun</b></code></a>
					- A portal gun made by a Rick, capable of opening portals to other dimensions.
				</dd>
				<ul alt=table-columns>
					<li id='portal_gun.portal_gun_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#portal_gun.portal_gun_id'>portal_gun_id</a></b>
								<i alt=column-type>pk uuid</i>
							</code>
							<!-- replace this comment with portal_gun.portal_gun_id description -->
						</dd>
					</li>
					<li id='portal_gun.rick_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#portal_gun.rick_id'>rick_id</a></b>
								<i alt=column-type>integer <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with portal_gun.rick_id description -->
						</dd>
					</li>
				</ul>
			</td>
			<td>
			&emsp;↗<a href='#rick'><code>rick</code></a><br/>
			#<a href='#portal_gun'><code>portal_gun</code></a><br/>
			&emsp;⭦<a href='#history'><code>history</code></a>
			</td>
		</tr>
		<tr>
			<td id='rick'>
				<dd alt=table-description>
					<a href='#rick'><code><b>rick</b></code></a>
					which Rick this is
				</dd>
				<ul alt=table-columns>
					<li id='rick.rick_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#rick.rick_id'>rick_id</a></b>
								<i alt=column-type><i title="default generates new value">auto</i> pk integer</i>
							</code>
							<!-- replace this comment with rick.rick_id description -->
						</dd>
					</li>
					<li id='rick.first_name' >
						<dd alt=column-description>
							<code>
								<b><a href='#rick.first_name'>first_name</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with rick.first_name description -->
						</dd>
					</li>
					<li id='rick.last_name' >
						<dd alt=column-description>
							<code>
								<b><a href='#rick.last_name'>last_name</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with rick.last_name description -->
						</dd>
					</li>
					<li id='rick.email' >
						<dd alt=column-description>
							<code>
								<b><a href='#rick.email'>email</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							<!-- replace this comment with rick.email description -->
						</dd>
					</li>
					<li id='rick.dimension_id' >
						<dd alt=column-description>
							<code>
								<b><a href='#rick.dimension_id'>dimension_id</a></b>
								<i alt=column-type>uuid <sub><sup>nullable</sup></sub></i>
							</code>
							- which dimension this Rick originated
						</dd>
					</li>
				</ul>
			</td>
			<td>
			&emsp;↗<a href='#dimension'><code>dimension</code></a><br/>
			#<a href='#rick'><code>rick</code></a><br/>
			&emsp;⭦<a href='#history'><code>history</code></a><br/>
			&emsp;⭦<a href='#portal_gun'><code>portal_gun</code></a>
			</td>
		</tr>
	</tbody>
</table>
<!--DB-LINTER-->

Note you can place anything _outside_ the `<`!`--DB-LINTER--`!`>` markers.
But only descriptions inside, as everything else is regenerated between them.
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
This spaced added so scrolling works as expected when deep-linking.
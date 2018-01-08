# db-linter

Do you wish:
* your codebase came with some helpful markdown that provided a 
canonical, easily-linkable place for textual descriptions of database tables and columns to be stored?
* and required team members to update them as new ones were added?
* and made sure the schema followed certain conventions?

Then this is for you.

<table>
<tr><th>Table of Contents</th></tr>
<tr><td><ul>
    <li><a href='#setup'>Setup</a></li>
    <li><a href='#rules'>Rules</a></li>
    <li><a href='#how'>How</a></li>
    <li><a href='#why'>Why</a></li>
    <li><a href='#caveats'>Caveats</a></li>
</ul></td></tr>
</table>

## Setup
Run this during your test suite:
```javascript
require('db-linter').run({
	//sql flavor
	lang: 'postgres',//or mysql
	//db creds
	host: '127.0.0.1',
	port: 5432,
	user: '',//note this user will need access to information_schema
	password: '',
	database:'test',
	//module settings
	path:'./readme.md',//where to look for a markdown file
	    //with 2 <!--DB-LINTER--> tags between which
	    //to place generated markdown
	rules:'all',//or array of rule name strings from readme
	//rule options
	boolPrefixes:['is','allow'],
	isObviousColumn:(columnName,tableName,db)=>{
		//custom reasons a column does not need describing in your setup
		//maybe columns that are everywhere, like created_at?
		return false
	}
})
.then(pass=> process.exit(pass ? 0 : 1))//or however you want to handle success / failure
```

Failed rules will be logged out for the dev to fix.

## Rules
Below is the full list of built-in rules, but feel free to create your own and assess the json schema directly:

* **`require_table_description_in_readme`** - all tables need explanations for why they exist. Sometimes even describing table `x_y` as `1 x can have many y's` will be appreciated going forward.
* **`require_column_description_in_readme`** - all non-obvious (customizable) columns need explanations for why they exist.
* **`require_lower_snake_case_table_name`** - some instances, collations, & OSes are case insensitive, making this the only reliable naming style for tables and columns
* **`require_lower_snake_case_column_name`** - see above.
* **`disallow_bare_id`** - columns named `id` have repeatedly been found to create footgun-level ambiguity downstream, and make sql more verbose & confusing by eliminating utility of the `using` keyword
* **`require_primary_key`** - each row should always be individually fetchable from each table, otherwise the data structure & needs may be at odds
* **`require_unique_primary_keys`** - identical primary keys would suggest they should be the same table
* **`require_singular_table_name`** - the table name should describe _each row_, not the table as a whole. A _table_ holds multiple records, otherwise it would be called a _pedestal_; clarity is _never_ added when a table is pluralized, it only makes remembering which part to pluralize harder when join tables inevitably have singular qualifiers.
* **`require_all_foreign_keys`** - every column titled `x_id` (when `x` is another table) should have a foreign key to table `x`.  In composite primary key scenarios, this may require denormalizing properties to retain the link.
* **`require_same_name_columns_share_type`** - reduces confusion when talking & promotes more unique names
* **`require_bool_prefix_on_only_bools`** - `is_`, `allow_` (etc, add your list) should always refer to boolean columns

## How
This is done in a few steps:
1. it queries `information_schema` to provide a json schema representation of your **mysql** or **postgres** db (which you can also use in your code)
2. it constructs and updates a git-flavored markdown readme of your db from this json that preserves user-supplied descriptions across rebuilds, with each table and column deep-linkable
3. it checks whether the current state of the db follows the desired rules

## Why
* **Documentation** - Being able to see an overview is desirable.
Being able to point at something in conversation is helpful.
Things not committed become folklore.
* **Total Freedom Is Not Always Desirable** - Dev teams, especially those which suffer from high turnaround, 
allow too much freedom in databases, which leads to local contradictions,
which leads to ever-increasing mental overhead.
Adding some reasonable rules can minimize the mental overhead necessary, and increase reliability.

  Given the levels of restrictions and rigor placed on executed code,
there are curiously few placed on everything else.  Such freedom in a space can send
the signal that equivalent rigor is not worthwhile here, when of course it still is.

## Caveats
* stored procedures, views, and enums are currently not considered, because they are not recommended.
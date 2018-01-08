const _=require('lodash')
const varIterator=require('drier')
const {fs,cheerio,compromise,args}=varIterator(require)

;['unhandledRejection','uncaughtRejection'].forEach(e=>{
	process.on(e,err=>{
		console.error(err)
		process.exit(1)
	})
})

var marker=`<!--DB-LINTER-->`
async function makeDb(queryer,dbName){
	/*
	db={
		tables:{
			[table_name]:{
				columns:{
					[column_name]:{
						type,
						ordinal_position,
						default,
						is_nullable
					},...
				},
				primary_key:[column_name,...],
				foreign_keys:[
					{
						constraint_name,
						table_name, //will be parent table_name
						column_names,
						foreign_table_name,
						foreign_column_names,
					},...
				],
				target_of_foreign_keys:[
					{
						constraint_name,
						table_name,
						column_names,
						foreign_table_name,//will be parent table_name
						foreign_column_names,
					},...
				]
			}
		}
	}
	*/
	
	function splitPluralCols(row){
		if(isMysql){
			for(var key in row){
				if(key.match(/s$/)){
					row[key]=row[key].split(',')
				}
			}
		}
		return row
	}
	
	var hasExtra=(await queryer(`
		select count(*) n
		from information_schema.columns
		where table_schema='information_schema'
			and column_name='extra';`))[0].n*1
	var isMysql=!!hasExtra
	var groupFxn=isMysql? 'group_concat' : 'json_agg'

	//mysql/mariadb
	var columns= await queryer(`
select table_name
	,column_name
	,data_type as type
	,ordinal_position
	,column_default
	,case
		when is_nullable='YES' then true
		else false 
	end is_nullable
	${hasExtra? `,extra` : ''}
from information_schema.columns
where table_schema='${dbName}'
order by ordinal_position asc;`)
	
	var pks=(await queryer(`
select table_name
	,${groupFxn}(column_name order by ordinal_position asc) column_names
from information_schema.key_column_usage
inner join information_schema.table_constraints tc using(table_schema,constraint_schema,table_name,constraint_name)
where constraint_schema='${dbName}'
and tc.constraint_type='PRIMARY KEY'
group by table_name;`)
).map(splitPluralCols)

	var fks=(await queryer(`
select constraint_name
	,table_name
	,${groupFxn}(column_name order by ordinal_position asc) column_names
	,referenced_table_name foreign_table_name
	,${groupFxn}(referenced_column_name order by ordinal_position asc) foreign_column_names
from information_schema.table_constraints tc
inner join information_schema.key_column_usage kcu using(table_schema,table_name,constraint_name)
${!isMysql?`
inner join (
	select table_schema
		,constraint_name
		,column_name referenced_column_name
		,table_name referenced_table_name
	from information_schema.constraint_column_usage
	) ccu using(table_schema,constraint_name)
`:''}
where table_schema='${dbName}'
and constraint_type='FOREIGN KEY'
group by table_name,constraint_name,referenced_table_name`)).map(splitPluralCols)


	var db={tables:{}}

	columns.forEach(row=>{
		//console.log(row.table_name,row.column_name,row.column_default)
		if(!db.tables[row.table_name])
			db.tables[row.table_name]={
				columns:{}
				,primary_key:[]
				,foreign_keys:[]
				,target_of_foreign_keys:[]
			}
		db.tables[row.table_name].columns[row.column_name]=_.omit(row,['table_name'])
	})
	
	pks.forEach(pk=>{
		db.tables[pk.table_name].primary_key=pk.column_names
	})
	
	fks.forEach(fk=>{
		//each fk that table has
		db.tables[fk.table_name].foreign_keys.push(fk)
		//and each fk that points at it
		db.tables[fk.foreign_table_name].target_of_foreign_keys.push(fk)
	})

	return db
}
function makeMarkdownHtml(db,descriptions){
	//recall https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/sanitization_filter.rb#L40
	var t='generating markdown'
	console.time(t)
	function link(name){
		return `<a href='#${name}'><code>${name}</code></a>`
	}
	function shrink(html){
		return `<sub><sup>${html}</sup></sub>`
	}
	var html=`${marker}
<table>
	<!--<thead><tr><th colspan=4 >Tables</th></tr></thead>-->
	<tbody>${(function makeTOC(){
			var tables=_.keys(db.tables)
			var n=tables.length
			n=n+(n%2)//make even
			//always assume more than present to never exceed 4 cols
			n+=2
			var cols=4
			return `
		<tr valign=top >${_.chunk(tables,n/cols)
			.map(tableNames=>`
			<td>
				${tableNames.map(link).join(`<br>
				`)}
			</td>`
			).join('')
			}
		</tr>`
		})()}
	</tbody>
</table>
<table>
	<thead>
		<tr>
			<th>Table</th>
			<th>Relations</th>
		</tr>
	</thead>
	<tbody>
	${_.keys(db.tables)
	.sort()//my/psql vary in how _ is sorted, so do it here
	.map(tableName=>{
		var table=db.tables[tableName]
		return `		<tr>
			<td id='${tableName}'>
				<dd alt=table-description>
					<a href='#${tableName}'><code><b>${tableName}</b></code></a>
					${_.get(descriptions[tableName],'description',`<!-- replace this comment with ${tableName} description -->`)}
				</dd>
				<ul alt=table-columns>${_.map(table.columns,(column,columnName)=>{
					return `
					<li id='${tableName+"."+columnName}' >
						<dd alt=column-description>
							<code>
								<b><a href='#${tableName+"."+columnName}'>${columnName}</a></b>
								<i alt=column-type>${
								_.compact([
									(column.column_default+column.extra||'')
										.match(/auto_increment|serial|nextval|uuid/i)
											? '<i title="default generates new value">auto</i>'
											: null,
									table.primary_key.includes(columnName) ? 'pk' : null,
									column.type,
									column.is_nullable? shrink('nullable') : null,
								]).join(' ')
							}</i>
							</code>
							${_.get(descriptions[tableName],'columns.'+columnName,`<!-- replace this comment with ${tableName}.${columnName} description -->`)}
						</dd>
					</li>`
				}).join('')}
				</ul>
			</td>
			<td>
			${
				[]
				.concat(table.foreign_keys
					.map(x=>`&emsp;⭧`+link(x.foreign_table_name))//⮣
				)
				.concat('#'+link(tableName))
				.concat(table.target_of_foreign_keys
					.map(x=>`&emsp;⭦`+link(x.table_name))//⭦⮤
				)
				.join('<br/>\n'+'\t'.repeat(3))
			}
			</td>
		</tr>`
	},'').join('\n')}
	</tbody>
</table>
${marker}`
	console.timeEnd(t)
	return html
}
function extractDescriptionsFromMarkdown(path){
	var html=fs.readFileSync(path).toString().split(marker)[1]
	var $=cheerio.load(html)
	function requireUsefulDescription(txt,table,col){
		return txt.replace(/<!-- replace this comment with \S+ description -->/,'')
			||undefined
	}
	//get md-only data, so, descriptions 
	//md={[table_name]:{description,columns:{[column_name]:description,...}}
	return $('td[id]').toArray().reduce((set,td)=>{
		//use .children to be as exact as possible & allow user-supplied html
		var tableName=td.attribs.id
		var description=$(td).children("dd[alt='table-description']")
		description.children(`a[href='#${tableName}']`).remove()
		set[tableName] = {
			description:requireUsefulDescription(description.html().trim())
			,columns:$(td).children("ul[alt='table-columns']").children("li").toArray().reduce((set,li)=>{
				var columnName=li.attribs.id.split('.')[1]
				var description=$(li).children("dd[alt='column-description']")
				description.children('code:first-child').remove()
				set[columnName]=requireUsefulDescription(description.html().trim())
				return set
			},{})
		}
		return set
	},{})
}
function passesConventions(db,descriptions,opts){
	var problems=[]

	var boolPrefixes=opts.boolPrefixes
	function isObviousColumn(columnName,tableName,db){
		//user supplied?
		if(opts.isObviousColumn(columnName,tableName,db)) return true
		//if an id corresponds to a known table
		if(columnName.slice(-3)=='_id' && db.tables[columnName.slice(0,-3)]) return true
		//should be able to insert user-supplied fxns somehow
		else return false
	}
	
	//don't have to repeat rule names this way
	var rule={
		perSchema:{
			require_unique_primary_keys(){
				var dupes=[]
				_.reduce(db.tables,(set,{primary_key},tableName)=>{
					var pk=[...primary_key].sort()
					if(set[pk]) dupes.push(tableName,set[pk])
					else set[pk]=tableName
					return set
				},{})
				return dupes
			}
			,require_same_name_columns_share_type(){
				var typesByCol={}
				var differentTypes=[]
				_.each(db.tables,(table,tableName)=>{
					_.each(table.columns,(column,columnName)=>{
						if(typesByCol[columnName]){
							if(typesByCol[columnName]!=column.type){
								differentTypes.push({target:columnName,msg:column.type+' when all other are '+typesByCol[columnName]})
							}
						}
						else typesByCol[columnName]=column.type
					})
				})
				return differentTypes
			}
		}
		,perTable:{
			require_table_description_in_readme(table,tableName){
				return !descriptions[tableName].description ? tableName : []
			}
			,require_primary_key(table,tableName){
				return !db.tables[tableName].primary_key.length ? tableName : []
			}
			,require_singular_table_name(table,tableName){
				return compromise(tableName).match('#singular').list.length ? [] : tableName
			}
			,require_lower_snake_case_table_name(table,tableName){
				return tableName==_.snakeCase(tableName) ? [] : tableName
			}
			,require_all_foreign_keys(table,tableName){
				//could handle composite case...later
				var missing=[]
				_.each(table.columns,(column,columnName)=>{
					//if this is an id
					if(columnName.slice(-3)=='_id'){
						var maybeTable=columnName.slice(0,-3)
						//that corresponds to an existing table that isn't me
						if(db.tables[maybeTable] && maybeTable==columnName){
							//and the rel is missing
							var rel=_.some(table.foreign_keys,
									fk=>fk.table_name==tableName
									&& fk.foreign_table_name==maybeTable
								)
							if(!rel) missing.push(tableName+"."+columnName)
						}
					}
				})
				return missing
			}
		}
		,perColumn:{
			disallow_bare_id(table,tableName,column,columnName){
				return columnName=='id' ? tableName+'.'+columnName : []
			}
			,require_column_description_in_readme(table,tableName,column,columnName){
				return (
						descriptions[tableName].columns[columnName]
						|| isObviousColumn(columnName,tableName,db)
					)
					? []
					: tableName+"."+columnName
			}
			,require_bool_prefix_on_only_bools(table,tableName,column,columnName){
				var prefix=new RegExp(`^(${boolPrefixes.join('|')})_`)
				return (
					//is bool but lacks prefix
					(column.type.match(/bool/i) && !columnName.match(prefix))
					||//or is not bool but has prefix
					(!column.type.match(/bool/i) && columnName.match(prefix))
				) ? tableName+"."+columnName
				: []
			}
			,require_lower_snake_case_column_name(table,tableName,column,columnName){
				return columnName==_.snakeCase(columnName) ? [] : columnName
			}
		}
	}
	
	function performCheck(check,ruleName,...args){
		return ((opts.rules=='all' || opts.rules[ruleName])
			? _.castArray(check(...args))
			: []
			).map(problem=>({ruleName,problem}))
	}
	
	//schema level
	_.each(rule.perSchema,(check,ruleName)=>{
		problems.push(...performCheck(check,ruleName))
	})
	//table level
	_.each(db.tables,(table,tableName)=>{
		_.each(rule.perTable,(check,ruleName)=>{
			problems.push(...performCheck(check,ruleName,table,tableName))
		})
		//column level
		_.each(table.columns,(column,columnName)=>{
			_.each(rule.perColumn,(check,ruleName)=>{
				problems.push(...performCheck(check,ruleName,table,tableName,column,columnName))
			})
		})
	})
	
	if(problems.length){
		problems.forEach(({problem,ruleName})=>{
			var msg=''
			var target=problem
			if(_.isObject(problem))
				({target}=problem)
			console.log(`* ${target}: ${ruleName} ${msg?`(${msg})`:''}`)
		})
		return false
	}
	else{
		console.log("documentation present & conventions followed")
		return true
	}
}

async function run(opts={}){
	_.defaults(opts,{
		path:'./readme.md',
		rules:'all',
		boolPrefixes:['is','allow'],
		isObviousColumn:()=>false
	})
	
	var {lang,database,user,password,host,port,path}=varIterator(x=>{
		if(!(x in opts)){
			console.error(x+' required in !')
			process.exit(0)
		}
		return opts[x]
	})
	var dbCreds={host,user,password,database,port}
	async function mysqlSetup(creds){
		var mysql=require('mysql')
		var connection = mysql.createConnection(creds)
		/*{
		  host     : 'localhost',
		  user     : 'root',
		  password : 'none',
		  database : 'tempus',
		  port     : 3306
		});*/
		return function(sql){
			return new Promise((good,bad)=>{
				connection.query(sql, function (error, results, fields) {
					if (error) bad(error)
					else good(results)
				})
			})
		}
	}
	async function psqlSetup(creds){
		var pg=require('pg')
		const client = new pg(creds)/*{
			  host: '127.0.0.1',
			  port: 5432,
			  user: 'postgres',
			  password: '',
			  database:'test'
			})*/
		await client.connect()
		return function(sql){
			return new Promise(async (good,bad)=>{
				const res = await client.query(sql)
				if(res) good(res.rows)
				else bad(res)
			})
		}
	}
	var db=await makeDb(
			  lang.match(/mysql/i)    ? await mysqlSetup(dbCreds)
			: lang.match(/postgres/i) ? await psqlSetup(dbCreds)
			: (()=>{throw new Error(`lang may only be 'mysql' or 'postgres', not '${lang}'`)})()
		,database)
	var descriptions=extractDescriptionsFromMarkdown(path)
	//console.log(JSON.stringify({descriptions},null,'\t'))
	var html=makeMarkdownHtml(db,descriptions)
	var file=fs.readFileSync(path).toString()
	var [before,table,after]=file.split(marker)
	fs.writeFileSync(path,`${before}${html}${after}`)
	//by this point will be final state w/new things / old things removed
	return passesConventions(db,descriptions,opts)
}

//progammatic
//if(module.parent)
module.exports = {
	run
	,makeDb
	,makeMarkdownHtml
	,extractDescriptionsFromMarkdown
	,passesConventions
}
/* //later
//cli
else{
	args//.option('readmePath', 'The path to the file with 2 <!--SCHEMIZE--> tags between which it should place the markdown it generates', './readme.md')
		.option('settings', 'The path to a js file which exports a settings object', './db-lint-settings.js')
	const flags = args.parse(process.argv)
	
	run()
}
*/
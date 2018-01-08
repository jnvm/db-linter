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
			&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
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
			&emsp;⭧<a href='#dimension'><code>dimension</code></a><br/>
			&emsp;⭧<a href='#portal_gun'><code>portal_gun</code></a><br/>
			&emsp;⭧<a href='#rick'><code>rick</code></a><br/>
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
							- its apt & fitting name that was not made up on the spot
						</dd>
					</li>
					<li id='organism.image' >
						<dd alt=column-description>
							<code>
								<b><a href='#organism.image'>image</a></b>
								<i alt=column-type>text <sub><sup>nullable</sup></sub></i>
							</code>
							- or did it happen?
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
					- dimensions an organism has been found in
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
			&emsp;⭧<a href='#dimension'><code>dimension</code></a><br/>
			&emsp;⭧<a href='#organism'><code>organism</code></a><br/>
			&emsp;⭧<a href='#organism'><code>organism</code></a><br/>
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
			&emsp;⭧<a href='#rick'><code>rick</code></a><br/>
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
			&emsp;⭧<a href='#dimension'><code>dimension</code></a><br/>
			#<a href='#rick'><code>rick</code></a><br/>
			&emsp;⭦<a href='#history'><code>history</code></a><br/>
			&emsp;⭦<a href='#portal_gun'><code>portal_gun</code></a>
			</td>
		</tr>
	</tbody>
</table>
<!--DB-LINTER-->
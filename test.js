//incomplete
beforeAll(async()=>{
var pgForm=`
create table "dimension" (
	dimension_id uuid,
	name text,
	description text,
	primary key ("dimension_id")
);

CREATE TABLE "rick" (
  "rick_id"        serial,
  "first_name"     text,
  "last_name"      text,
  "email"          text,
  "dimension_id"   uuid,
  PRIMARY KEY ("rick_id")
);


create table "portal_gun" (
	portal_gun_id uuid,
	rick_id int,
	primary key ("portal_gun_id")
);

create table "history" (
	history_id uuid,
	portal_gun_id uuid,
	dimension_id uuid,
	rick_id int,
	created_at timestamp default current_timestamp,
	primary key ("history_id")
);

create table "organism" (
	organism_id uuid,
	name text,
	image text,
	primary key ("organism_id")
);

create table "organism_dimension" (
	organism_id uuid,
	dimension_id uuid,
	discovered_at timestamp default current_timestamp,
	primary key ("organism_id","dimension_id")
);

alter table rick               add foreign key (dimension_id) references dimension(dimension_id);
alter table portal_gun         add foreign key (rick_id) references rick(rick_id);
alter table history            add foreign key (rick_id) references rick(rick_id);
alter table history            add foreign key (portal_gun_id) references portal_gun(portal_gun_id);
alter table history            add foreign key (dimension_id) references dimension(dimension_id);
alter table organism_dimension add foreign key (dimension_id) references dimension(dimension_id);
alter table organism_dimension add foreign key (organism_id)  references organism(organism_id);


	`
	
var mysqlForm=pgForm
	.replace(/"/g,'')
	.replace(/uuid/g,'varchar(32)')
	.replace(/serial/g,'int auto_increment')
	
	
})
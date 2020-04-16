create table if not exists items(
id serial primary key,
name text,
done text,
created_date text not null default TO_CHAR(NOW() :: DATE, 'dd/mm/yyyy'),
updated_date text
);
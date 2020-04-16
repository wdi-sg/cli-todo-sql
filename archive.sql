create table if not exists archive(
id INTEGER PRIMARY KEY,
name text,
done text,
created_date text not null default TO_CHAR(NOW() :: DATE, 'dd/mm/yyyy'),
updated_date date
);
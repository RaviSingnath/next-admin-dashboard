alter table colleges
add constraint colleges_official_email_unique
unique (official_email);
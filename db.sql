create table showcase
(
    id       int auto_increment
        primary key,
    platinum tinyint null,
    gold     tinyint null,
    silver   tinyint null
);

create table userlisting
(
    id            int auto_increment
        primary key,
    userId        int          null,
    showcaseIndex int          null,
    description   text         null,
    phone         varchar(255) null
);

create table userlistingphoto
(
    id        int auto_increment
        primary key,
    listingId int           null,
    photo     varchar(1024) null
);

create table users
(
    id       int auto_increment
        primary key,
    username varchar(255)      null,
    password varchar(255)      null,
    isAdmin  tinyint default 0 null
);

create table usershowcase
(
    id            int auto_increment
        primary key,
    userId        int null,
    showcaseIndex int null
);


CREATE TABLE IF NOT EXISTS channels_by_user (
    user text,
    joined_at timestamp,
    channel text,
    title text,
    is_owner boolean,
    PRIMARY KEY (user, joined_at, channel)
) WITH CLUSTERING ORDER BY (joined_at DESC, channel ASC);

CREATE TABLE IF NOT EXISTS users_by_channel (
    channel text,
    joined_at timestamp,
    user text,
    name text,
    email text,
    picture text,
    is_owner boolean,
    PRIMARY KEY (channel, joined_at, user)
) WITH CLUSTERING ORDER BY (joined_at DESC, user ASC);

CREATE TABLE IF NOT EXISTS channels (
    channel text,
    user text,
    title text,
    name text,
    picture text,
    joined_at timestamp,
    is_owner boolean,
    PRIMARY KEY (channel, user)
);

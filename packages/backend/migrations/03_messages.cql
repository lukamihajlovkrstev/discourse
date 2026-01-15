CREATE TABLE IF NOT EXISTS messages (
  channel text,
  message timestamp,
  user text,
  username text,
  picture text,
  content text,
  PRIMARY KEY (channel, message)
) WITH CLUSTERING ORDER BY (message DESC)
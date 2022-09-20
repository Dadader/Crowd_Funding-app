const query = `
CREATE TABLE IF NOT EXISTS CAMPAIGNS
(
    "C_ID" serial,
    "C_NAME" character varying(50),
    "C_DESCRIPTIONS" character varying(200),
    "C_IMAGE" bytea,
    "C_GOALS" bigint
)`;

module.exports = query;
CREATE TABLE IF NOT EXISTS "accounts" (
    id INTEGER PRIMARY KEY,
    login VARCHAR(40) NOT NULL,
    password_hash BLOB NOT NULL,
    is_read_i=only BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "client_profiles" (
    id INTEGER NOT NULL,
    client VARCHAR(255),
    login VARCHAR(40),
    password_hash TEXT,
    phone_number VARCHAR(40),
    email VARCHAR(255),
    contract VARCHAR(255),
    read_only BOOLEAN,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "contracts" (
    account_id INTEGER PRIMARY KEY,
    phone_number VARCHAR(40),
    email VARCHAR(255),
    CONSTRAINT fk_contacts_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
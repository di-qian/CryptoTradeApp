CREATE EXTENSION "uuid-ossp";
CREATE TABLE users(
	user_id uuid PRIMARY KEY DEFAULT
	uuid_generate_v4(),
	user_name VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	user_created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE profolio (
	user_id uuid NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    asset_ticker VARCHAR (50) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
	purchase_price MONEY NOT NULL,
    PRIMARY KEY(user_id, asset_ticker),
    CONSTRAINT fk_users
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
);

INSERT INTO profolio(user_id, owner_email, asset_name, quantity, purchase_price) VALUES (1, 'johndoe@gmail.com', 'btc', 0.5, 50000.00);
INSERT INTO profolio(user_id, owner_email, asset_name, quantity, purchase_price) VALUES (2, 'johndoe@gmail.com', 'cash', 10000, 1.00);

